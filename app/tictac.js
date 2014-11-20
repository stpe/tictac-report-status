var Promise = require('es6-promise').Promise;
var moment = require('moment');
var tictac = require('./modules/tictacApi');
var dateRange = require('./modules/dateRange');
var template = require('./modules/template');
var email = require('./modules/sendEmail');

// the whole of previous month
var startDate = moment().subtract(1, 'month').startOf('month');
var endDate = moment().subtract(1, 'month').endOf('month');

var userData = {};
var projectData = {};

Promise.all([
    tictac.getUserReport(startDate, endDate),
    tictac.getProjects(),
    tictac.getUsers(),
    tictac.getNormaltime(startDate, endDate)
])
.then(function(data) {
    var userReport = data[0];
    var projects = data[1];
    var users = data[2];
    var normaltime = data[3];

    // create user data
    users.TicTacUsers.TicTacUser.forEach(function(u) {
        userData[u.userid] = {
            userid: u.userid,
            loginName: u.loginName,
            email: u.email,
            firstName: u.firstName,
            lastName: u.lastName,
            active: u.isActive == "true",
            dates: dateRange.getWithNormaltime(startDate, endDate, normaltime)
        };
    });

    // map project name with id
    var projectLookup = {};
    projects.TicTacProjects.TicTacProject.forEach(function(p) {
        projectLookup[p.name] = p.projid;
        projectData[p.projid] = {
            projid: p.projid,
            name: p.name
        };
    });

    // get list of projects with reported time this period
    var currentProjects = [];
    var projectScratchpad = [];
    userReport.TimeSumPerUserAndProject.row.forEach(function(p) {
        if (projectScratchpad.indexOf(p.project) == -1) {
            projectScratchpad.push(p.project);
            currentProjects.push({
                name: p.project,
                id: projectLookup[p.project]
            });
        }
    });
    projectScratchpad = null;

    return currentProjects;
})
.then(function(projects) {
    // get project rows for each project
    var s = projects.map(function(p) {
        return tictac.getProjectRows(startDate, endDate, p.id);
    });

    return Promise.all(s);
})
.then(function(data) {
    // parse each project to find out how many hours a day
    // each person has reported and for what project
    data.forEach(function(project) {
        project.TicTacRows.TicTacTime.forEach(function(row) {
            if (userData[row.userid]) {
                var shortname = projectData[row.projid] ? projectData[row.projid].name : row.projectname;
                userData[row.userid].dates[row.date].projects.push({
                    projectname: row.projectname,
                    shortname: shortname,
                    slug: shortname.toLowerCase().replace(/[^a-z]/g, ""),
                    projid: row.projid,
                    hours: parseFloat(row.hours)
                });
            } else {
                console.log("User '"+ row.userid + "' does not exist in userdata.");
            }
        });
    });

    return userData;
})
.then(function(data) {
    // convert into calendar structure for presentation
    var calendarRange = dateRange.getCalendarRange(startDate, endDate);
    // get name of weekdays for header row in presentation
    var weekdays = dateRange.getWeekdays(startDate.clone().day(1), startDate.clone().day(7));

    Object.keys(data)
        .filter(function(user) {
            // only do active users
            return data[user].active;
        })
        .forEach(function(user) {
            var html = template.generate({
                calendar: calendarRange.map(function(week) {
                    return week.map(function(day) {
                        return {
                            date: day.date,
                            day: day.day,
                            user: data[user].dates[day.date],
                            type: function(dayType) {
                                switch (dayType) {
                                    case 0: return "weekend";
                                    case 1: return "whole";
                                    case 2: return "half";
                                    case 3: return "holiday";
                                    case 4: return "half";
                                    default: return "outofrange";
                                }
                            }(data[user].dates[day.date] ? data[user].dates[day.date].dayType : -1)
                        };
                    });
                }),
                weekdays: weekdays,
                user: data[user]
            });

            console.log(html);

            // email.send(
            //     data[user].email,
            //     html,
            //     startDate,
            //     endDate
            // );
        });
})
.catch(function(err) {
    console.log(err);
});

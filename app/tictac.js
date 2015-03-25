var Promise = require('es6-promise').Promise;
var moment = require('moment');
var tictac = require('./modules/tictacApi');
var dateRange = require('./modules/dateRange');
var template = require('./modules/template');
var email = require('./modules/sendEmail');
var textualize = require('./modules/textualize');
var fs = require('fs');

// set locale
moment.locale('sv');

// the whole of previous month
// var startDate = moment().subtract(1, "month").startOf("month");
// var endDate = moment().subtract(1, "month").endOf("month");

// previous week
var startDate = moment().startOf("week").subtract(1, "week").day(1);
var endDate = moment().endOf("week").subtract(1, "week").day(0);

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
            workgroup: u.workgroup,
            dates: dateRange.getWithNormaltime(startDate, endDate, normaltime)
        };
    });

    // map project name with id
    var projectLookup = {};
    projects.TicTacProjects.TicTacProject.forEach(function(p) {
        projectLookup[p.name] = p.projid;
        projectData[p.projid] = {
            projid: p.projid,
            name: p.name,
            company: p.invoiceCorpname
        };
    });

    // get list of projects with reported time this period
    var currentProjects = [];
    var projectScratchpad = [];
    if (userReport.TimeSumPerUserAndProject) {
        userReport.TimeSumPerUserAndProject.row.forEach(function(p) {
            if (projectScratchpad.indexOf(p.project) == -1) {
                projectScratchpad.push(p.project);
                currentProjects.push({
                    name: p.project,
                    id: projectLookup[p.project]
                });
            }
        });
    }
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
        var TicTacTime = project.TicTacRows.TicTacTime || [];

        // if object (only one entry) make it as an array
        if (TicTacTime.constructor !== Array) {
            TicTacTime = [TicTacTime];
        }

        TicTacTime.forEach(function(row) {
            if (userData[row.userid]) {
                var shortname = projectData[row.projid] ? projectData[row.projid].name : row.projectname;
                var company = projectData[row.projid] ? projectData[row.projid].company : "";
                userData[row.userid].dates[row.date].projects.push({
                    projectname: row.projectname,
                    shortname: shortname,
                    slug: shortname.toLowerCase().replace(/[^a-z]/g, ""),
                    projid: row.projid,
                    company: company,
                    hours: parseFloat(row.hours)
                });
            } else {
                // debug
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

    // choose template depending on period length
    var templateName = "weekly";
    if (endDate.diff(startDate, 'days') > 25) {
        templateName = "monthly";
    }

    var users = Object.keys(data)
        .filter(function(user) {
            // only do active users
            return data[user].active && data[user].workgroup == process.env.TICTAC_WORKGROUP;
        })
        .filter(function(user) {
            return data[user].firstName == "Stefan";
        });

    // put together common statistics
    var whoDidWhat = {};
    var usersWhoDidTheirTimeReport = {};
    users.forEach(function(user) {
        Object.keys(data[user].dates).forEach(function(date) {
            data[user].dates[date].projects.forEach(function(project) {
                var projectName = project.company;

                // if internal, use projectname too
                if (projectName == "Internal") {
                    projectName += ";" + project.projectname;
                }

                if (!whoDidWhat[projectName]) {
                    whoDidWhat[projectName] = {};
                }

                whoDidWhat[projectName][user] = data[user].firstName;

                if (!usersWhoDidTheirTimeReport[user]) {
                    usersWhoDidTheirTimeReport[user] = 1;
                }
            });
        });
    });

    // users who did not do their time report last week
    var usersWhoDidNotTimeReport = {};
    users.forEach(function(user) {
        if (!usersWhoDidTheirTimeReport[user]) {
            usersWhoDidNotTimeReport[user] = data[user].firstName;
        }
    });

    if (Object.keys(usersWhoDidNotTimeReport).length > 0) {
        whoDidWhat["Internal;DidNotTimeReport"] = usersWhoDidNotTimeReport;
    }
    var whoDidWhatString = textualize.projects(whoDidWhat);

    if (process.env.WRITE_TO_FILE) {
        // remove output file to start empty, since we're going to append to it
        try {
            fs.unlinkSync(process.env.WRITE_TO_FILE);
        } catch(error) {}
    }

    users.forEach(function(user) {
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
            user: data[user],
            team: whoDidWhatString,
            stats: (function() {
                var totalNormal = 0;
                var totalHours = 0;
                Object.keys(data[user].dates).forEach(function(date) {
                    totalNormal += data[user].dates[date].normaltime;
                    data[user].dates[date].projects.forEach(function(project) {
                        totalHours += project.hours;
                    });
                });

                return {
                    totalNormal: totalNormal,
                    totalHours: totalHours
                };
            })()
        }, templateName);

        if (process.env.WRITE_TO_FILE) {
            fs.appendFileSync(process.env.WRITE_TO_FILE, html);
        } else {
            email.send(
                data[user].email,
                html,
                startDate,
                endDate
            );
        }
    });
})
.catch(function(err) {
    console.log(err);
});

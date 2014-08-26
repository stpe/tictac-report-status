var Promise = require('es6-promise').Promise;
var moment = require('moment');
var tictac = require('./modules/tictacApi');
var dateRange = require('./modules/dateRange');
var template = require('./modules/template');

// the whole of previous month
var startDate = moment().subtract(1, 'month').startOf('month');
var endDate = moment().subtract(1, 'month').endOf('month');

var userData = {};

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
        if (u.isActive == "true") {
            userData[u.userid] = {
                userid: u.userid,
                loginName: u.loginName,
                email: u.email,
                firstName: u.firstName,
                lastName: u.lastName,
                dates: dateRange.get(startDate, endDate, normaltime)
            };
        }
    });

    // map project name with id
    var projectLookup = {};
    projects.TicTacProjects.TicTacProject.forEach(function(p) {
        projectLookup[p.name] = p.projid;
    });

    // get list of projects with reported time this period
    var currentProjects = [];
    var projectScrachpad = [];
    userReport.TimeSumPerUserAndProject.row.forEach(function(p) {
        if (projectScrachpad.indexOf(p.project) == -1) {
            projectScrachpad.push(p.project);
            currentProjects.push({
                name: p.project,
                id: projectLookup[p.project]
            });
        }
    });
    projectScrachpad = null;

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
            userData[row.userid].dates[row.date].projects.push({
                projectname: row.projectname,
                projid: row.projid,
                hours: parseFloat(row.hours)
            });
        });
    });

    // convert dates into sorted array
    Object.keys(userData).forEach(function(userid) {
        var dates = Object.keys(userData[userid].dates).sort();
        var dateArray = [];
        dates.forEach(function(date) {
            userData[userid].dates[date].date = date;
            dateArray.push(userData[userid].dates[date]);
        });
        userData[userid].dates = dateArray;
    });

    return userData;
})
.then(function(data) {
    // blurt everything out as prettified json to console for now...
    //console.log(JSON.stringify(data, null, 2));

    var html = template.generate(data);
    console.log(html);
})
.catch(function(err) {
    console.log(err);
});

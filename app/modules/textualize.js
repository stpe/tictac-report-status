exports.projects = function(users, data) {
  var projectsData = exports.projectsData(users, data);

  return exports.projectsString(projectsData);
};

exports.projectsString = function(projects) {
  var projectStrings = [];

  Object.keys(projects).forEach(function(project, index, arr) {
      var members = Object.keys(projects[project]).map(function(key) {
          return projects[project][key];
      });

      // string of team members
      var membersStr = members.slice(0, Math.max(1, members.length - 1)).join(", ");
      if (members.length > 1) {
          membersStr += " and " + members.slice(-1);
      }

      // beautify project name
      var projectName = project;
      projectName = projectName.replace(" AB", ""); // remove AB ending

      // check if internal activity
      if (projectName.indexOf("Internal") == -1) {
          // working on project
          if (index == arr.length - 1) {
              // last project in list
              membersStr = "Last but not least " + membersStr + " did work with ";
          } else {
              membersStr += " worked with ";
          }
          membersStr += "<b>" + projectName + "</b>.";
      } else {
          // internal
          switch (projectName) {
              case "Internal;Absence/Paid vacation":
                membersStr += " was on vacation.";
                break;
              // case "Internal;Absence/Care of sick child (VAB) ":
              //   membersStr += " fick vabba.";
              //   break;
              case "Internal;DidNotTimeReport":
                membersStr += " did not time report :((((.";
                break;
              default:
                // skip project
                membersStr = "";
          }
        }

      if (membersStr) {
        projectStrings.push(membersStr);
      }
  });

  return projectStrings.join(" ");
};

exports.projectsData = function(users, data) {
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

    return whoDidWhat;
};
exports.projects = function(projects) {
  var projectStrings = [];

  Object.keys(projects).forEach(function(project, index, arr) {
      var members = Object.keys(projects[project]).map(function(key) {
          return projects[project][key];
      });

      // string of team members
      var membersStr = members.slice(0, Math.max(1, members.length - 1)).join(", ")
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
                console.log("Skipping internal project: " + projectName);
                membersStr = "";
          }
        }

      if (membersStr) {
        projectStrings.push(membersStr);
      }
  });

  return projectStrings.join(" ");
};

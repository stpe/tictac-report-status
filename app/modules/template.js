var handlebars = require('handlebars');
var fs = require('fs');

exports.generate = function(data, templateName) {
    var template = fs.readFileSync(__dirname + "/../template/" + templateName + ".handlebars", "utf8");
    return (handlebars.compile(template))(data);
};

var handlebars = require('handlebars');
var fs = require('fs');

exports.generate = function(data, template) {
    var template = fs.readFileSync(__dirname + "/../template/" + template + ".handlebars", "utf8");
    return (handlebars.compile(template))(data);
};

var handlebars = require('handlebars');
var fs = require('fs');

exports.generate = function(data) {
    var template = fs.readFileSync(__dirname + "/../template/monthly.handlebars", "utf8");
    return (handlebars.compile(template))(data);
};

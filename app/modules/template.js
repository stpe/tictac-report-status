var handlebars = require('handlebars');
var fs = require('fs');
var moment = require('moment');

moment.locale('sv');

exports.generate = function(data, templateName) {
    var template = fs.readFileSync(__dirname + "/../template/" + templateName + ".handlebars", "utf8");
    return (handlebars.compile(template))(data);
};

// Handlebars helpers
//--------------------------

// if equals
handlebars.registerHelper('if_eq', function(a, b, opts) {
    if (a == b) {
        return opts.fn(this);
    }
    return opts.inverse(this);
});

// formatDate
handlebars.registerHelper("formatDate", function(datetime, format) {
    return moment(datetime).format(format);
});
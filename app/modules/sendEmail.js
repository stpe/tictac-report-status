var juice = require('juice');
var sendgrid = require('sendgrid')(
    process.env.SENDGRID_USERNAME,
    process.env.SENDGRID_PASSWORD
);

var DATE_FORMAT = "YYYY-MM-DD";

exports.send = function(email, body, startDate, endDate) {
    // inline all css
    var inlinedHtml = juice(body);

    sendgrid.send({
        to: email,
        from: process.env.FROM_EMAIL,
        subject: "Tidrapport " + startDate.format(DATE_FORMAT) + " - " + endDate.format(DATE_FORMAT),
        html: inlinedHtml
    }, function(err, json) {
        if (err) {
            console.error("SendGrid error", err);
        } else {
            console.log("Message sent successfully to " + email);
        }
    });
};

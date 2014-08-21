var moment = require('moment-range');

exports.get = function(startDate, endDate, normalTime) {
    var rangeObj = {};
    var range = moment().range(startDate, endDate);
    range.by('days', function(moment) {
        var dateString = moment.format("YYYY-MM-DD");
        rangeObj[dateString] = {
            projects: [],
            normalTime: getNormaltime(dateString, normalTime)
        };
    });
    return rangeObj;
};

// dateString on format YYYY-MM-DD, normalTime is API response as object
function getNormaltime(dateString, normalTime) {
    var dates = normalTime.TicTacNormalTime.NormalTime;
    for (var i = 0; i < dates.length; i++) {
        if (dates[i].date == dateString) {
            return {
                dayType: parseInt(dates[i].dayType, 10),
                time: parseInt(dates[i].time, 10)
            };
        }
    }
    // if day not found, it is probably a weekend
    return {
        dayType: 0,
        time: 0
    };
}

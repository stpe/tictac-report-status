var moment = require('moment-range');

exports.getCalendarRange = function(startDate, endDate) {
    // get monday on or before start date, get sunday on or after end date
    var range = moment().range(startDate.clone().day(1), endDate.clone().day(7));
    var result = [], week = [];
    range.by('days', function(moment) {
        week.push({
            date: moment.format("YYYY-MM-DD")
        });

        if (moment.day() === 0) { // if end of week (sunday)...
            result.push(week);
            week = [];
        }
    });
    return result;
};

exports.getWeekdays = function(startDate, endDate) {
    var range = moment().range(startDate, endDate);
    var result = [];
    range.by('days', function(moment) {
        result.push(moment.format("dddd"));
    });
    return result;
};

exports.getWithNormaltime = function(startDate, endDate, normaltime) {
    var rangeObj = {};
    var range = moment().range(startDate, endDate);
    range.by('days', function(moment) {
        var dateString = moment.format("YYYY-MM-DD");
        var normaltimeObj = getNormaltime(dateString, normaltime);
        rangeObj[dateString] = {
            projects: [],
            normaltime: normaltimeObj.time,
            dayType: normaltimeObj.dayType
        };
    });
    return rangeObj;
};

// dateString on format YYYY-MM-DD, normalTime is API response as object
function getNormaltime(dateString, normaltime) {
    var dates = normaltime.TicTacNormalTime.NormalTime;
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

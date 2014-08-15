var chai = require('chai');
var should = chai.should();
var moment = require('moment');

describe('dateRange', function() {
    var dateRange = require('../app/modules/dateRange');
    var normalTime = require('./data/getNormaltime.json');

    it('should return range of days with normaltime', function() {
        var startDate = moment("2014-07-01");
        var endDate = moment("2014-07-31");
        var range = dateRange.get(
            startDate,
            endDate,
            normalTime
        );

        var rangeKeys = Object.keys(range);
        var diff = endDate.diff(startDate, "days") + 1;
        rangeKeys.should.have.length(diff);
    });
});

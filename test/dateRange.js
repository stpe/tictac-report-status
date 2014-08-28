var chai = require('chai');
var should = chai.should();
var moment = require('moment');

describe('dateRange', function() {
    var dateRange = require('../app/modules/dateRange');
    var api = require('../app/modules/tictacApi');

    it('should return range of days with normaltime', function() {
        var startDate = moment("2014-07-01");
        var endDate = moment("2014-07-31");
        var diff = endDate.diff(startDate, "days") + 1;

        var listOfDaysInMonth = [];
        var currentDate = startDate.clone();
        while (currentDate <= endDate) {
            listOfDaysInMonth.push(currentDate.format("YYYY-MM-DD"));
            currentDate = currentDate.add(1, 'day');
        }

        api.getNormaltime(startDate, endDate)
            .then(function(normalTime) {
                return dateRange.getWithNormaltime(
                    startDate,
                    endDate,
                    normalTime
                );
            })
            .then(function(range) {
                return Object.keys(range);
            })
            .should.eventually.have.length(diff).and.deep.equal(listOfDaysInMonth);
    });
});

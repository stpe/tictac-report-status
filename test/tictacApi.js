var dotenv = require('dotenv');
dotenv.load();

var chai = require('chai');
var should = chai.should();
chai.use(require("chai-as-promised"));

var moment = require('moment');

describe('Tictac API', function() {
    var api = require('../app/modules/tictacApi');

    var projectId;

    it('should retrieve user report', function() {
        return api.getUserReport(
            moment().subtract(1, 'month').startOf('month'),
            moment().subtract(1, 'month').endOf('month')
        ).should.eventually.have.property('TimeSumPerUserAndProject');
    });

    it('should retrieve projects', function() {
        return api.getProjects().should.eventually.have.property('TicTacProjects')
            .then(function(projects) {
                // get id of first project
                projectId = projects.TicTacProject[0].projid;
            });
    });

    it('should retrieve project rows', function() {
        return api.getProjectRows(
                moment().subtract(1, 'month').startOf('month'),
                moment().subtract(1, 'month').endOf('month'),
                projectId
            ).should.eventually.have.property('TicTacRows');
    });

    it('should retrieve normal time', function() {
        return api.getNormaltime(
            moment().subtract(1, 'month').startOf('month'),
            moment().subtract(1, 'month').endOf('month')
        ).should.eventually.have.property('TicTacNormalTime');
    });

    it('should retrieve users', function() {
        return api.getUsers().should.eventually.have.property('TicTacUsers');
    });
});

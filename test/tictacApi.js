var dotenv = require('dotenv');
dotenv.load();

var chai = require('chai');
var should = chai.should();
chai.use(require("chai-as-promised"));

var moment = require('moment');
var nock = require('nock');

describe('Tictac API', function() {
    var api = require('../app/modules/tictacApi');

    nock(api.TICTAC_API_BASE_URL)
        .filteringPath(/webservice\/rest\/getProjectRows\.jsp\?projectId=(\d+).*/, 'getProjectRows$1')
        .get('/getProjectRows1344344083404')
        .replyWithFile(200, __dirname + '/data/getProjectRows1344344083404.xml', {
            'content-type': 'application/xml'
        })
        .get('/getProjectRows1345410092429')
        .replyWithFile(200, __dirname + '/data/getProjectRows1345410092429.xml', {
            'content-type': 'application/xml'
        })
        .get('/getProjectRows1393961115410')
        .replyWithFile(200, __dirname + '/data/getProjectRows1393961115410.xml', {
            'content-type': 'application/xml'
        })
        .get('/getProjectRows1398845875122')
        .replyWithFile(200, __dirname + '/data/getProjectRows1398845875122.xml', {
            'content-type': 'application/xml'
        })
        .get('/getProjectRows1399919145449')
        .replyWithFile(200, __dirname + '/data/getProjectRows1399919145449.xml', {
            'content-type': 'application/xml'
        });

    nock(api.TICTAC_API_BASE_URL)
        .filteringPath(/webservice\/rest\/(\w+)\.jsp?.*/, '$1')
        .get('/getUsers')
        .replyWithFile(200, __dirname + '/data/getUsers.xml', {
            'content-type': 'application/xml'
        })
        .get('/getNormaltime')
        .replyWithFile(200, __dirname + '/data/getNormaltime.xml', {
            'content-type': 'application/xml'
        })
        .get('/getProjects')
        .replyWithFile(200, __dirname + '/data/getProjects.xml', {
            'content-type': 'application/xml'
        })
        .get('/getUserReport')
        .replyWithFile(200, __dirname + '/data/getUserReport.xml', {
            'content-type': 'application/xml'
        });

    var startDate = moment("2014-07-01");
    var endDate = moment("2014-07-31");
    var projectId;

    it('should retrieve user report', function() {
        return api.getUserReport(
            startDate,
            endDate
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
                startDate,
                endDate,
                projectId
            ).should.eventually.have.property('TicTacRows');
    });

    it('should retrieve normal time', function() {
        return api.getNormaltime(
            startDate,
            endDate
        ).should.eventually.have.property('TicTacNormalTime');
    });

    it('should retrieve users', function() {
        return api.getUsers().should.eventually.have.property('TicTacUsers');
    });
});

var chai = require('chai');
var should = chai.should();
var moment = require('moment');

describe('textualize', function() {
    var textualize = require('../app/modules/textualize');
    var projectsData = require('./data/projectsData.json');

    it('should generate readable text', function() {
        var s = textualize.projectsString(projectsData);

        s.should.to.be.a('string');
    });
});

var nock = require('nock');
var api = require('../../app/modules/tictacApi');

nock(api.TICTAC_API_BASE_URL)
    .persist()
    .filteringPath(/webservice\/rest\/getProjectRows\.jsp\?projectId=(\d+).*/, 'webservice/rest/getProjectRows$1')
    .get('/getProjectRows1344344083404')
    .replyWithFile(200, __dirname + '/../../test/data/getProjectRows1344344083404.xml', {
        'content-type': 'application/xml'
    })
    .get('/getProjectRows1345410092429')
    .replyWithFile(200, __dirname + '/../../test/data/getProjectRows1345410092429.xml', {
        'content-type': 'application/xml'
    })
    .get('/getProjectRows1393961115410')
    .replyWithFile(200, __dirname + '/../../test/data/getProjectRows1393961115410.xml', {
        'content-type': 'application/xml'
    })
    .get('/getProjectRows1398845875122')
    .replyWithFile(200, __dirname + '/../../test/data/getProjectRows1398845875122.xml', {
        'content-type': 'application/xml'
    })
    .get('/getProjectRows1399919145449')
    .replyWithFile(200, __dirname + '/../../test/data/getProjectRows1399919145449.xml', {
        'content-type': 'application/xml'
    });

nock(api.TICTAC_API_BASE_URL)
    .persist()
    .filteringPath(/webservice\/rest\/(\w+)\.jsp?.*/, 'webservice/rest/$1')
    .get('/getUsers')
    .replyWithFile(200, __dirname + '/../../test/data/getUsers.xml', {
        'content-type': 'application/xml'
    })
    .get('/getNormaltime')
    .replyWithFile(200, __dirname + '/../../test/data/getNormaltime.xml', {
        'content-type': 'application/xml'
    })
    .get('/getProjects')
    .replyWithFile(200, __dirname + '/../../test/data/getProjects.xml', {
        'content-type': 'application/xml'
    })
    .get('/getUserReport')
    .replyWithFile(200, __dirname + '/../../test/data/getUserReport.xml', {
        'content-type': 'application/xml'
    });

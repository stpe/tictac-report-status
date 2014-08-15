var moment = require('moment');
var needle = require('needle');
var Promise = require('es6-promise').Promise;
var querystring = require('querystring');

var TICTAC_API_BASE_URL = 'https://www.tictacmobile.com/webservice/rest/';

var apiGet = function(method, params) {
    params = params || {};
    params.userid = process.env.TICTAC_API_USERID;
    params.password = process.env.TICTAC_API_PASSWORD;

    // clear non-set parameters
    Object.keys(params).forEach(function(key) {
        if (typeof params[key] == 'undefined') {
            delete params[key];
        }
    });

    var url = TICTAC_API_BASE_URL + method + '.jsp?' + querystring.stringify(params);
    if (process.env.TICTAC_LOG_URLS) {
        console.log(url);
    }

    if (process.env.TICTAC_DEBUG) {
        console.log('API ' + method + ': ' + querystring.stringify(params, ', ', '='));
    }

    return new Promise(function(resolve, reject) {
        needle.get(url,
            function(err, resp, data) {
                if (err) {
                    return reject(Error(err));
                }
                if (data.errorMessage) {
                    return reject(Error(data.errorMessage));
                }

                if (process.env.TICTAC_DEBUG) {
                    console.log('API response:');
                    console.log(JSON.stringify(data, null, 2));
                }
                resolve(data);
            }
        );
    });
};

// Returns time summed up for all users or one specific user
exports.getUserReport = function(startDate, endDate, forUser) {
    return apiGet('getUserReport', {
        startdate: moment(startDate).format('YYYY-MM-DD'),
        enddate: moment(endDate).format('YYYY-MM-DD'),
        forUser: forUser
    });
};

// Returns all time, cost, expence and sales entries for the given period for a given project
exports.getProjectRows = function(startDate, endDate, projectId) {
    return apiGet('getProjectRows', {
        projectId: projectId,
        startdate: moment(startDate).format('YYYY-MM-DD'),
        enddate: moment(endDate).format('YYYY-MM-DD')
    });
};

// Returns normal time for the given period
exports.getNormaltime = function(startDate, endDate) {
    return apiGet('getNormaltime', {
        startdate: moment(startDate).format('YYYY-MM-DD'),
        enddate: moment(endDate).format('YYYY-MM-DD')
    });
};

// Returns all projects and activities in the account. Or the [number] most recently created or updated projects
exports.getProjects = function() {
    return apiGet('getProjects');
};

// Returns all users in the account
exports.getUsers = function() {
    return apiGet('getUsers');
};

tictac-report-status
====================

Just hacking... move on. Nothing to see here.

### API Documentation

http://www.tictacmobile.com/webservice/rest/

### Setup

The following environment variables must be set:
```
TICTAC_API_USERID
TICTAC_API_PASSWORD
```

And optionally this one for debug output of API requests:
```
TICTAC_DEBUG=true
TICTAC_LOG_URLS=true
```

For convenience during local development, use a ``.env`` file with [foreman](https://www.npmjs.org/package/foreman) (part of Heroku toolbelt).

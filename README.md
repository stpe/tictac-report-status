tictac-report-status
====================

Just hacking... move on. Nothing to see here.

### Tictac API Documentation

http://www.tictacmobile.com/webservice/rest/

### Setup

The following environment variables must be set:

* ``TICTAC_API_USERID`` User ID to access Tictac API
* ``TICTAC_API_PASSWORD`` Password for user to access Tictac API
* ``SENDGRID_USERNAME`` SendGrid username
* ``SENDGRID_PASSWORD`` SendGrid password

For configuration:

* ``TICTAC_WORKGROUP`` Filter users by workgroup
* ``FROM_EMAIL`` Email address to use as from-address in sent emails

And optionally these ones for debugging purposes:

* ``TICTAC_DEBUG=true`` Log API responses to console
* ``TICTAC_LOG_URLS=true`` Log requested API URLs to console
* ``TICTAC_MOCK_API=true`` Mock API with static data from */test/data/* (no actual requests will be made)

For convenience during local development, use a ``.env`` file with [foreman](https://www.npmjs.org/package/foreman) (part of Heroku toolbelt).

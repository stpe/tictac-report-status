Tic-Tac Time Report Status Emails
=================================

Automatically send personalized time report status emails for [Tic-Tac Mobile](http://tictacmobile.com/) time-reporting system.

I developed this with two main purposes.

1. Remind people to have their time report updatedby end of week by emailing a personalized reminder containing what they have currently reported for the week.
2. Keep people up-to-date with what everyone is doing and what projects they are involved with by emailing a week in review summary (also extra incentive to report in time, otherwise it will look like you haven't worked on anything).

This is a Node.js app, made to be run as a scheduled worker on Heroku, that retrieves data about current projects and employees from the Tic-Tac API and then sends custom, personalized emails using SendGrid (free tier is enough, 400 emails/day).

### Email screen capture

These are just examples; content, style and conditional logic is controlled by a Handlebars template.

| End of week reminder | Week in review |
| ------------- | ------------- |
| ![End of week reminder](http://stpe.github.io/tictac-report-status/tictac-status-report-friday.png) | ![Week in review](http://stpe.github.io/tictac-report-status/tictac-status-report-week-in-review.png) |

### Setup

The following environment variables must be set:

* ``TICTAC_API_USERID`` User ID to access Tictac API
* ``TICTAC_API_PASSWORD`` Password for user to access Tictac API
* ``SENDGRID_USERNAME`` SendGrid username
* ``SENDGRID_PASSWORD`` SendGrid password

For configuration:

* ``TICTAC_WORKGROUP`` Filter users by workgroup
* ``FROM_EMAIL`` Email address to use as from-address in sent emails
* ``WRITE_TO_FILE`` If set, output written to file instead of sent as email (useful for testing purposes)

And optionally these ones for debugging purposes:

* ``TICTAC_DEBUG=true`` Log API responses to console
* ``TICTAC_LOG_URLS=true`` Log requested API URLs to console
* ``TICTAC_MOCK_API=true`` Mock API with static data from */test/data/* (no actual requests will be made)

For convenience during local development, use a ``.env`` file with [foreman](https://www.npmjs.org/package/foreman) (part of Heroku toolbelt).

### Installation

Make sure you got [Node.js](https://nodejs.org/) installed. The script is also making use of Foreman, also part of the [Heroku Toolbelt](https://toolbelt.heroku.com/) - install it.

`npm install`

### Usage

#### Run locally

This will send out emails: `npm start`

or to see output concationated without sending out emails:

`npm run demo` (make sure `WRITE_TO_FILE` environment variable is set)

#### Deployment

Currently meant to be run as a [scheduled](https://devcenter.heroku.com/articles/scheduler) *worker* process on [Heroku](https://www.heroku.com) (hence the use of Foreman).

### Customization

Email template is located in `app/template` directory and uses [Handlebars](http://handlebarsjs.com/) as templating language. CSS is automatically inlined when sent as an email, so no need to do that manually.

### Todo/Further development

To be more useful the next feature to development would be to run *tictac-report-status* with a parameter controllinng which template and time period to use. By that it is possible to have different message at different times (e.g. a reminder with current status on Fridays, a summary of previous week on Mondays and a monthly wrap-up, etc).

Because I do no longer use Tic-Tac as time-reporting system I will most-likely not continue development, but I'm happy to accept pull requests and I do encourage forks.

### References

[Tictac API Documentation](http://www.tictacmobile.com/webservice/rest/)

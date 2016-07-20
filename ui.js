const Setup = require('./setup');


module.exports = [
  {
    method: 'GET',
    path: '/',
    config: {
      auth: 'session',
    },
    handler: (request, reply) => {

      Setup.setup(request.auth.credentials, (err, result) => {

        if (err) {
          console.log('Setup error', err);
          return reply(err);
        }

        if (result !== true) {
          return reply.redirect(result);
        }

        return reply.file('./app/app.html');
      });
    },
  },
  {
    method: 'GET',
    path: '/static/{filename*}',
    handler: {
      directory: {
        path: 'static',
      },
    },
  },
];

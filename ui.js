const Setup = require('./setup');


module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (request, reply) => {

      Setup.setup((err, result) => {

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
    path: '/app/{filename*}',
    handler: {
      directory: {
        path: 'app',
      },
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
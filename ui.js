module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      return reply.file('./app/app.html');
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
'use strict';


module.exports = [
  {
    method: 'GET',
    path: '/static/{filename*}',
    handler: {
      directory: {
        path: 'static',
      },
    },
  },
  {
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      return reply.file('./template/index.html');
    },
  },
];
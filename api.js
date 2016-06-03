'use strict';


module.exports = [
  {
    method: 'GET',
    path: '/api/StockType',
    handler: (request, reply) => {
      request.server.app.db.StockType.read({}, (err, result) => {
        return reply(err || result);
      });
    },
  },
  {
    method: 'POST',
    path: '/api/StockType',
    handler: (request, reply) => {
      request.server.app.db.StockType.createOne(request.payload, (err, result) => {
        return reply(err || result);
      });
    },
  },
];
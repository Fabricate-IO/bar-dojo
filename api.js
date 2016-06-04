'use strict';

/* API endpoints for each object:
DELETE /?query
DELETE /id
GET /?query
GET /id
PATCH /id <payload>
POST / <payload>
PUT / <payload>
*/

module.exports = [
  {
    method: 'GET',
    path: '/api/Recipe',
    handler: (request, reply) => {
      request.server.app.db.Recipe.read({}, (err, result) => {
        return reply(err || result);
      });
    },
  },
  {
    method: 'POST',
    path: '/api/Recipe',
    handler: (request, reply) => {
      request.server.app.db.Recipe.createOne(request.payload, (err, result) => {
        return reply(err || result);
      });
    },
  },
];
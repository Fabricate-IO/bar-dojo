'use strict';

const Joi = require('joi');

const Recipe = require('./model/Recipe');

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
    method: 'DELETE',
    path: '/api/Recipe/{id}',
    handler: (request, reply) => {
      Joi.validate(request.params, Recipe.schema, (err, params) => {
        request.server.app.db.Recipe.deleteOne(params.id, (err, result) => {
          return reply(err || result);
        });
      });
    },
  },
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
      Joi.validate(request.payload, Recipe.schema, (err, payload) => {
        request.server.app.db.Recipe.createOne(payload, (err, result) => {
          return reply(err || result);
        });
      });
    },
  },
];
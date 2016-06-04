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
    config: {
      validate: {
        params: Recipe.schema,
      },
    },
    handler: (request, reply) => {
      request.server.app.db.Recipe.deleteOne(request.params.id, (err, result) => {
        return reply(err || result);
      });
    },
  },
  {
    method: 'GET',
    path: '/api/Recipe/{id}',
    config: {
      validate: {
        params: Recipe.schema,
      },
    },
    handler: (request, reply) => {
      request.server.app.db.Recipe.readOne(request.params.id, (err, result) => {
        return reply(err || result);
      });
    },
  },
  {
    method: 'GET',
    path: '/api/Recipe',
    config: {
      validate: {
        query: Recipe.schema,
      },
    },
    handler: (request, reply) => {
      request.server.app.db.Recipe.read(request.query, (err, result) => {
        return reply(err || result);
      });
    },
  },
  {
    method: 'PUT',
    path: '/api/Recipe/{id}',
    config: {
      validate: {
        params: Recipe.schema,
        payload: Recipe.schema,
      },
    },
    handler: (request, reply) => {
      request.server.app.db.Recipe.updateOne(request.params.id, request.payload, (err, result) => {
        return reply(err || result);
      });
    },
  },
  {
    method: 'POST',
    path: '/api/Recipe',
    config: {
      validate: {
        payload: Recipe.schema,
      },
    },
    handler: (request, reply) => {
      request.server.app.db.Recipe.createOne(request.payload, (err, result) => {
        return reply(err || result);
      });
    },
  },
];
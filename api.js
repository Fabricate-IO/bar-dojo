'use strict';

const Boom = require('boom');
const Joi = require('joi');

const models = {
  Recipe: require('./model/Recipe'),
  Stock: require('./model/Stock'),
  StockType: require('./model/StockType'),
};


module.exports = [

/* ===== Recipe ===== */
  {
    method: 'DELETE',
    path: '/api/{modelName}/{id}',
    handler: (request, reply) => {

      const modelName = request.params.modelName;
      delete request.params.modelName;

      Joi.validate(request.params, models[modelName].schema, (err, params) => {

        if (err) {
          return reply(Boom.badRequest(err));
        }

        request.server.app.db[modelName].deleteOne(request.params.id, (err, result) => {
          return reply(err || result);
        });
      });
    },
  },
  {
    method: 'GET',
    path: '/api/{modelName}/{id}',
    handler: (request, reply) => {

      const modelName = request.params.modelName;
      delete request.params.modelName;

      Joi.validate(request.params, models[modelName].schema, (err, params) => {

        if (err) {
          return reply(Boom.badRequest(err));
        }

        request.server.app.db[modelName].readOne(params.id, (err, result) => {
          return reply(err || result);
        });
      });
    },
  },
  {
    method: 'GET',
    path: '/api/{modelName}',
    handler: (request, reply) => {

      const modelName = request.params.modelName;
      delete request.params.modelName;

      const sortableSchema = Joi.object(models[modelName].schema).keys({ order: Joi.string(), orderBy: Joi.string() });

      Joi.validate(request.query, sortableSchema, (err, query) => {

        if (err) {
          return reply(Boom.badRequest(err));
        }

        request.server.app.db[modelName].read(query, (err, result) => {
          return reply(err || result);
        });
      });
    },
  },
  {
    method: 'PUT',
    path: '/api/{modelName}/{id}',
    handler: (request, reply) => {

      const modelName = request.params.modelName;
      delete request.params.modelName;

      Joi.validate(request.params, models[modelName].schema, (err, params) => {

        if (err) {
          return reply(Boom.badRequest(err));
        }

        Joi.validate(request.payload, models[modelName].schema, (err, payload) => {

          if (err) {
            return reply(Boom.badRequest(err));
          }

          if (params.id != null && payload.id != null && params.id !== payload.id) {
            return reply(Boom.badRequest("IDs in param and payload do not match"));
          }

          request.server.app.db[modelName].updateOne(params.id, payload, (err, result) => {
            return reply(err || result);
          });
        });
      });
    },
  },
  {
    method: 'POST',
    path: '/api/{modelName}',
    config: {
      validate: {
        payload: models.Recipe.schema,
      },
    },
    handler: (request, reply) => {

      const modelName = request.params.modelName;
      delete request.params.modelName;

      Joi.validate(request.payload, models[modelName].schema, (err, payload) => {

        if (err) {
          return reply(Boom.badRequest(err));
        }

        request.server.app.db[modelName].createOne(payload, (err, result) => {
          return reply(err || result);
        });
      });
    },
  },
];
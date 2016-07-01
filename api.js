'use strict';

const Boom = require('boom');
const Joi = require('joi');

const Splitwise = require('./splitwise');

const models = {
  Recipe: require('./model/Recipe'),
  Stock: require('./model/Stock'),
  StockType: require('./model/StockType'),
  Patron: require('./model/Patron'),
  Friend: require('./model/Friend'),
};


module.exports = [
/* ===== GENERIC CRUD ===== */
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

        request.server.app.db[modelName].deleteOne(params.id, (err, result) => {

          if (err) {
            return reply(Boom.badImplementation(err));
          }

          return reply(result);
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

          if (err) {
            return reply(Boom.badImplementation(err));
          }

          request.server.app.db[modelName].prePublicObject(result, (err, result) => {

            if (err) {
              return reply(Boom.badImplementation(err));
            }

            return reply(result);
          });
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

          if (err) {
            return reply(Boom.badImplementation(err));
          }

          request.server.app.db[modelName].prePublicArray(result, (err, result) => {

            if (err) {
              return reply(Boom.badImplementation(err));
            }

            return reply(result);
          });
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

            if (err) {
              return reply(Boom.badImplementation(err));
            }

            return reply(result);
          });
        });
      });
    },
  },
  {
    method: 'POST',
    path: '/api/{modelName}',
    handler: (request, reply) => {

      const modelName = request.params.modelName;
      delete request.params.modelName;

      Joi.validate(request.payload, models[modelName].schema, (err, payload) => {

        if (err) {
          return reply(Boom.badRequest(err));
        }

        request.server.app.db[modelName].createOne(payload, (err, result) => {

          if (err) {
            return reply(Boom.badImplementation(err));
          }

          return reply(result);
        });
      });
    },
  },

/* ===== SPECIAL FUNCTIONS ===== */
  {
    method: 'POST',
    path: '/api/Patron/{id}/charge',
    config: {
      validate: {
        params: {
          id: models.Patron.schema.id,
        },
        payload: {
          amount: Joi.number(),
        },
      },
    },
    handler: (request, reply) => {

      request.server.app.db.Patron.updateOne(request.params.id, { $inc: { tab: request.payload.amount } }, (err, result) => {

        if (err) {
          return reply(Boom.badImplementation(err));
        }

        return reply(result);
      });
    },
  },
  {
    method: 'POST',
    path: '/api/Patron/{id}/settle',
    config: {
      validate: {
        params: {
          id: models.Patron.schema.id,
        },
        payload: {
          type: Joi.string().allow(['splitwise', 'cash', 'house']),
        },
      },
    },
    handler: (request, reply) => {

      request.server.app.db.Patron.readOne(request.params.id, (err, patron) => {

        if (err) {
          return reply(Boom.badImplementation(err));
        }

        if (patron == null) {
          return reply(Boom.notFound('Patron id ' + request.params.id + ' not found'));
        }

        if (request.payload.type === 'splitwise') {

          if (patron.splitwiseId == null) {
            return reply(Boom.badRequest(patron.name + ' is not connected to splitwise'));
          }

          Splitwise.createExpense(patron.tab, 'Bar Dojo', patron.splitwiseId, (err, result) => {

            if (err) {
              return reply(Boom.badImplementation(err));
            }

            return settle(request.params.id, reply);
          });
        }
        else {
          return settle(request.params.id, reply);
        }
      });


      function settle (id, callback) { // note the unusual callback returns; for code brevity

        request.server.app.db.Patron.updateOne(id, { tab: 0 }, (err, result) => {

          if (err) {
            return callback(Boom.badImplementation(err));
          }

          return callback(result);
        });
      }
    },
  },
];
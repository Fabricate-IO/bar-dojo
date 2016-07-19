const Boom = require('boom');
const Joi = require('joi');

const models = {
  Bar: require('./model/Bar'),
  BarStock: require('./model/BarStock'),
  Friend: require('./model/Friend'),
  Patron: require('./model/Patron'),
  Recipe: require('./model/Recipe'),
  StockModel: require('./model/StockModel'),
  StockType: require('./model/StockType'),
  Transaction: require('./model/Transaction'),
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

          request.server.app.db[modelName].hooks.prePublicObject(result, (err, result) => {

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

          request.server.app.db[modelName].hooks.prePublicArray(result, (err, result) => {

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
    path: '/api/Patron/{id}/order',
    config: {
      validate: {
        params: {
          id: models.Patron.schema.id,
        },
        payload: {
          abv: models.StockModel.schema.abv,
          ingredients: models.Transaction.schema.ingredients,
          monetaryValue: Joi.number(),
          recipeId: models.Transaction.schema.recipeId,
        },
      },
    },
    handler: (request, reply) => {

      const Db = request.server.app.db;

      Db.Transaction.createOne({
        patronId: request.params.id,
        type: 'order',
        monetaryValue: request.payload.monetaryValue,
        recipeId: request.payload.recipeId,
        ingredients: request.payload.ingredients,
      }, (err, result) => {

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
          platform: Joi.string().allow(['splitwise', 'cash', 'house']),
        },
      },
    },
    handler: (request, reply) => {

      const Db = request.server.app.db;

      Db.Patron.settle(request.params.id, request.payload.platform, (err, result) => {

        if (err) {
          return reply(Boom.badImplementation(err));
        }

        return reply(result);
      });
    },
  },
];

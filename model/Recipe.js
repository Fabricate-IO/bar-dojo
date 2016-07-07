// Recipe: a named combination of quantities of stock types

'use strict';

const Joi = require('joi');

const db = require('../db');
const StockType = require('./StockType');


exports.schema = {
  id: Joi.number(),
  name: Joi.string(),
  instructions: Joi.string(), // optional
  ingredients: Joi.array().items(Joi.object().keys({
    stockTypeId: StockType.schema.id,
    quantity: Joi.number(),
  })),
  archived: Joi.boolean().default(false),

  // Metadata
  costMin: Joi.number().description('Current cheapest cost, calculated live'),
  costMax: Joi.number().description('Current most expensive cost, calculated live'),
  inStock: Joi.boolean().description('If it is currently possible to make this drink, calculated live'),
  created: Joi.date().timestamp(),
};


exports.indexes = [
  {
    keys: {
      id: 1
    },
    options: {
      unique: true,
    },
  },
  {
    keys: {
      name: 1
    },
    options: {
      unique: true,
    },
  },
];


exports.hooks = {

  // attaches metadata
  read: function (Rethink, query, sort, limit, callback) {

    const queryInStock = query.inStock;
    delete query.inStock;

    Rethink.table('BarStock').filter({ inStock: true, archived: false }).run((err, result) => {

      if (err) {
        return callback(err);
      }

      // convert stock into a dict of stocks by stockTypeId
      const stock = {};
      result.forEach((element) => {
        const id = element.stockTypeId;
        stock[id] = stock[id] || [];
        stock[id].push(element);
      });

      Rethink.table('Recipe').filter(query).orderBy(sort).limit(limit).run((err, result) => {

        if (err) {
          return callback(err);
        }

        // calculate metadata
        const recipes = result.map((element) => {

          element.inStock = true;
          element.costMin = 0;
          element.costMax = 0;

          element.ingredients.forEach((ingredient) => {

            let inStock = false;
            let costMin = 9999;
            let costMax = 0;

            if (stock[ingredient.stockTypeId] != null) {

              stock[ingredient.stockTypeId].forEach((stock) => {

                if (stock.remainingQuantity >= ingredient.quantity) {
                  inStock = true;
                  costMin = Math.min(costMin, stock.unitCost * ingredient.quantity);
                  costMax = Math.max(costMax, stock.unitCost * ingredient.quantity);
                }
              });

              element.costMin += costMin;
              element.costMax += costMax;
            }

            if (!inStock) {
              element.inStock = false;
            }
          });

          return element;
        }).filter((element) => {
          return (queryInStock == null || queryInStock === element.inStock);
        });

        return callback(null, recipes);
      });
    });
  },
};


exports.initialState = require('./initial/Recipe');
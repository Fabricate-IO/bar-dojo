// Recipe: a named combination of quantities of stock types

'use strict';

const Joi = require('joi');

const db = require('../db');
const StockType = require('./StockType');

exports.schema = {
  id: Joi.number(),
  name: Joi.string(),
  tags: Joi.array().items(Joi.string()), // tag name
  instructions: Joi.string(), // optional
  ingredients: Joi.array().items(Joi.object().keys({
    stockTypeId: StockType.schema.id,
    quantity: Joi.number(),
  })),
  archived: Joi.boolean().default(false),

  // Metadata
  // costMin - number
  // costMax - number
  inStock: Joi.boolean(),
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


// attaches UI metadata
exports.readMany = function (Mongo, query, sort, callback) {

  const queryInStock = query.inStock;
  delete query.inStock;

  Mongo.collection("Stock").find({ remainingQuantity: { $gt: 0 }, archived: { $ne: true } }).toArray((err, result) => {

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

    Mongo.collection("Recipe").find(query).sort(sort).toArray((err, result) => {

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
};


exports.initialState = [
  {
    name: 'Dark and Stormy',
    // TODO tags
    ingredients: [
      {
        stockTypeId: 'dark rum',
        quantity: 2,
      },
      {
        stockTypeId: 'ginger beer',
        quantity: 0.2,
      },
    ],
  },
  {
    name: 'Long Island Ice Tea',
    // TODO tags
    instructions: 'Add ingredients. Shake vigorously. Enjoy',
    ingredients: [
      {
        stockTypeId: 'ice cube',
        quantity: 4,
      },
      {
        stockTypeId: 'gin',
        quantity: 1,
      },
      {
        stockTypeId: 'tequila',
        quantity: 1,
      },
      {
        stockTypeId: 'vodka',
        quantity: 1,
      },
      {
        stockTypeId: 'white rum',
        quantity: 1,
      },
      {
        stockTypeId: 'triple sec',
        quantity: 0.5,
      },
      {
        stockTypeId: 'cola',
        quantity: 4,
      },
    ],
  },
  {
    name: 'Mudslide',
    // TODO tags
    instructions: 'Add ingredients to blender. Blend until smooth. Enjoy',
    ingredients: [
      {
        stockTypeId: 'ice cube',
        quantity: 4,
      },
      {
        stockTypeId: 'irish cream',
        quantity: 1,
      },
      {
        stockTypeId: 'kahlua',
        quantity: 1,
      },
      {
        stockTypeId: 'milk',
        quantity: 1,
      },
      {
        stockTypeId: 'vodka',
        quantity: 1,
      },
    ],
  },
  {
    name: 'Rum and Coke',
    // TODO tags
    ingredients: [
      {
        stockTypeId: 'dark rum',
        quantity: 1.5,
      },
      {
        stockTypeId: 'cola',
        quantity: 5,
      },
    ],
  },
];
// Recipe: a named combination of quantities of stock types

const Joi = require('joi');

const Db = require('../db');
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

    Db.BarStock.read({ inStock: true }, (err, result) => {

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
          element.abvMin = 0;
          element.abvMax = 0;
          element.volume = 0;

          element.ingredients.forEach((ingredient) => {

            let inStock = false;
            let costMin = 9999;
            let costMax = 0;
            let abvMin = 9999;
            let abvMax = 0;

            if (stock[ingredient.stockTypeId] != null) {

              stock[ingredient.stockTypeId].forEach((stock) => {

                if (stock.volumeAvailable >= ingredient.quantity) {
                  inStock = true;
                  costMin = Math.min(costMin, stock.volumeCost * ingredient.quantity);
                  costMax = Math.max(costMax, stock.volumeCost * ingredient.quantity);
                  abvMin = Math.min(abvMin, stock.abv * ingredient.quantity);
                  abvMax = Math.max(abvMax, stock.abv * ingredient.quantity);
                }
              });

              element.costMin += costMin;
              element.costMax += costMax;
              element.abvMin += abvMin;
              element.abvMax += abvMax;
              element.volume += ingredient.quantity;
            }

            if (!inStock) {
              element.inStock = false;
            }
          });

          if (element.volume > 0) {
            element.abvMin /= element.volume;
            element.abvMax /= element.volume;
          }

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

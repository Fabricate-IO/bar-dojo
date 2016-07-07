// BarStock: the available inventory and price of a given StockModel in a given Bar

'use strict';

const Joi = require('joi');

const db = require('../db');
const StockModel = require('./StockModel');


// TODO compound key on stockModelId and barId
exports.schema = {
  barId: Joi.number(),
  stockModelId: StockModel.schema.id,
  remainingUnits: Joi.array().items(Joi.number().min(0)).description('Array of remaining full volumes / quantities'),
  residualVolume: Joi.number().min(0).description('How much volume is left in the current open bottle'),
  archived: Joi.boolean().default(false),

  // Metadata
  volumeCost: Joi.number().min(0).description('Cost per <volume>, only updated on StockTransaction saves'),
  volumeAvailable: Joi.number().min(0).description('Amount of volume available, calclulated live based on residual + remaining units'),
  inStock: Joi.boolean().description('If volumeAvailable > 0, calclulated live'),
  created: Joi.date().timestamp(),
};


exports.indexes = [];


exports.hooks = {

  // attaches metadata
  read: function (Mongo, query, sort, limit, callback) {

    const queryInStock = query.inStock;
    delete query.inStock;

    Mongo.collection("BarStock").find(query).limit(limit).toArray((err, result) => {

      if (err) {
        return callback(err);
      }

      const stock = result.map((element) => {
        element.remainingUnits = element.remainingUnits || [];
        element.volumeAvailable = element.residualVolume + element.remainingUnits.reduce((a, b) => { return a + b; }, 0);
        element.inStock = (element.volumeAvailable > 0);
        return element;
      }).filter((element) => {
        return (queryInStock == null || queryInStock === element.inStock);
      });

      return callback(null, stock);
    });
  },
};
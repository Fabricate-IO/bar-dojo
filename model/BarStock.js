// BarStock: the available inventory and price of a given StockModel in a given Bar

'use strict';

const Joi = require('joi');

const Db = require('../db');
const StockModel = require('./StockModel');


// TODO compound key on stockModelId and barId
exports.schema = {
  id: Joi.string(), // compound key: barId.stockModelId
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

  assignId: function (Rethink, object, callback) {

    object.id = object.barId + '-' + object.stockModelId;
    return callback(null, object);
  },

  read: function (Rethink, query, sort, limit, callback) {

    const queryInStock = query.inStock;
    delete query.inStock;

    // implementation note: joining before order by insures output is ordered
    Rethink.table('BarStock')
      .filter(query)
      .eqJoin('stockModelId', Rethink.table('StockModel'))
      .zip()
      .eqJoin('stockTypeId', Rethink.table('StockType'))
      .orderBy(sort)
      .limit(limit)
      .zip()
      .run((err, result) => {

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
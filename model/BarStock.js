// BarStock: the available inventory and price of a given StockModel in a given Bar

const Joi = require('joi');

const Db = require('../db');
const Bar = require('./Bar');
const StockModel = require('./StockModel');
const StockType = require('./StockType');


exports.schema = {
  id: Joi.string(), // compound key: barId-stockModelId
  barId: Bar.schema.id,
  stockModelId: StockModel.schema.id,
  remainingUnits: Joi.array().items(Joi.number().min(0)).description('Array of remaining full volumes / quantities'),
  residualVolume: Joi.number().min(0).description('How much volume is left in the current open bottle'),
  residualVolumeDelta: Joi.number().description('Shorthand to express a change in residualVolume; negative value = reduce stock'),
  archived: Joi.boolean().default(false),
  // unitType

  category: StockType.schema.category.description('For searching'),

  // Metadata
  volumeCost: Joi.number().min(0).description('Cost per <volume>, only updated on StockTransaction saves'),
  volumeAvailable: Joi.number().min(0).description('Amount of volume available, calclulated live based on residual + remaining units'),
  inStock: Joi.boolean().description('If volumeAvailable > 0, calclulated live'),
  unitType: StockType.schema.unitType,
  created: Joi.date().timestamp(),
};


exports.indexes = [];


exports.hooks = {

  assignId: function (Rethink, auth, object, callback) {

    object.id = object.barId + '-' + object.stockModelId;
    return callback(null, object);
  },

  preSave: function (Rethink, auth, object, callback) {

    object.remainingUnits = object.remainingUnits || [];
    object.residualVolume = object.residualVolume || 0;

    if (object.residualVolumeDelta != null) {

      object.residualVolume += object.residualVolumeDelta;

      while (object.residualVolume < 0 && object.remainingUnits.length > 0) {

        object.residualVolume += object.remainingUnits.shift();
      }

      object.residualVolume = Math.max(0, object.residualVolume);
      delete object.residualVolumeDelta;
    }
    return callback(null, object);
  },

  read: function (Rethink, auth, query, sort, limit, callback) {

    const queryInStock = query.inStock;
    delete query.inStock;

    // implementation note: joining before order by insures output is ordered
    Rethink.table('BarStock')
      .filter({ barId: auth.barId })
      .eqJoin('stockModelId', Rethink.table('StockModel'))
      .without({ right: { 'id': true, 'archived': true }})
      .zip()
      .eqJoin('stockTypeId', Rethink.table('StockType'))
      .without({ right: { 'id': true, 'archived': true }})
      .zip()
      .filter(query)
      .orderBy(sort)
      .limit(limit)
      .run((err, result) => {

        if (err) {
          return callback(err);
        }

        const stock = result.map((element) => {
          element.remainingUnits = element.remainingUnits || [];
          element.volumeAvailable = element.residualVolume + element.remainingUnits.reduce((a, b) => { return a + b; }, 0);
          element.inStock = (element.volumeAvailable > 0);
          element.unitType = element.unitType || 'ml';
          return element;
        }).filter((element) => {
          return (queryInStock == null || queryInStock === element.inStock);
        });

        return callback(null, stock);
      });
  },
};

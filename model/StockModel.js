// StockModel: A specific named / branded item, ie 1800 Silver Tequila

'use strict';

const Joi = require('joi');

const StockType = require('./StockType');


exports.schema = {
  id: Joi.number(),
  stockTypeId: StockType.schema.id,
  name: Joi.string(),
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
      name: 1,
    },
  },
];


exports.initialState = (() => {
  const StockTypes = require('./initial/StockType');
  return StockTypes.map((StockType) => {
    return {
      name: StockType.id,
      stockTypeId: StockType.id,
    };
  });
})();
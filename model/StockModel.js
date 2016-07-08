// StockModel: A specific named / branded item, ie 1800 Silver Tequila

'use strict';

const Joi = require('joi');

const db = require('../db');
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
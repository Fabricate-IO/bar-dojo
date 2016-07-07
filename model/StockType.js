// StockType: general class of ingredients (ie vodka, salt, beer)
// Implemenetation note: because its name is the unqiue key, deleting (aka archiving) then re-adding a StockType
  // with the same name will result in a "key already exists" error

'use strict';

const Joi = require('joi');

const db = require('../db');


exports.schema = {
  id: Joi.string(), // unique key
  unitType: Joi.string().valid(['oz', 'bottle', 'cup', 'wedge']),
  archived: Joi.boolean().default(false),

  // Metadata
  created: Joi.date().timestamp(),
};


exports.indexes = [
  {
    keys: {
      id: 1,
    },
    options: {
      unique: true,
    },
  },
];


exports.initialState = require('./initial/StockType');
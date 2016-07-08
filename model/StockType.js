// StockType: general class of ingredients (ie vodka, salt, beer)
// Implemenetation note: because its name is the unqiue key, deleting (aka archiving) then re-adding a StockType
  // with the same name will result in a "key already exists" error

'use strict';

const Joi = require('joi');

const db = require('../db');


exports.schema = {
  id: Joi.string().description('unique broad lower case name, ie white rum, dark rum'),
  unitType: Joi.string().valid(['oz', 'bottle', 'cup', 'wedge']),
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
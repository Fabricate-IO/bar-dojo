// StockType: general class of ingridients (ie vodka, salt, beer)
// Implemenetation note: because its name is also its id, deleting (aka archiving) then re-adding a StockType
  // with the same name will result in a "key already exists" error

'use strict';

const Joi = require('joi');

const db = require('../db');


exports.schema = {
  id: Joi.string(),
  archived: Joi.boolean().default(false),
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
];


exports.initialState = [
  { id: 'rum' },
  { id: 'vodka' },
  { id: 'beer' },
];
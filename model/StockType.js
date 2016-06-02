// StockType: general class of ingredients (ie vodka, salt, beer)
// Implemenetation note: because its name is also its id, deleting (aka archiving) then re-adding a StockType
  // with the same name will result in a "key already exists" error

'use strict';

const Joi = require('joi');

const db = require('../db');


exports.schema = {
  id: Joi.string(),
  unitType: Joi.string().valid(['oz', 'bottle', 'unit']).default('unit'),

  created: Joi.date().timestamp(),
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
  // hard alcohol
  { id: 'dark rum', unitType: 'oz' },
  { id: 'gin', unitType: 'oz' },
  { id: 'tequila', unitType: 'oz' },
  { id: 'vodka', unitType: 'oz' },
  { id: 'white rum', unitType: 'oz' },
  // liquors
  { id: 'triple sec', unitType: 'oz' },
  // other alcohols
  { id: 'beer', unitType: 'bottle' },
  // mixers
  { id: 'cola', unitType: 'bottle' },
  // misc
  { id: 'ice cube' },
];
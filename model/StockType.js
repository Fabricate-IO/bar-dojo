// StockType: general class of ingredients (ie vodka, salt, beer)
// Implemenetation note: because its name is the unqiue key, deleting (aka archiving) then re-adding a StockType
  // with the same name will result in a "key already exists" error

'use strict';

const Joi = require('joi');

const db = require('../db');


exports.schema = {
  id: Joi.string(), // unique key
  unitType: Joi.string().valid(['oz', 'bottle', 'cup', 'wedge']),

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
  { id: 'irish cream', unitType: 'oz' },
  { id: 'kahlua', unitType: 'oz' },
  { id: 'triple sec', unitType: 'oz' },
  // other alcohols
  { id: 'beer', unitType: 'bottle' },
  { id: 'ginger beer', unitType: 'bottle' },
  // mixers and juices
  { id: 'cola', unitType: 'oz' },
  { id: 'milk', unitType: 'oz' },
  // misc
  { id: 'ice cube' },
];
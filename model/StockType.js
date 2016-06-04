// StockType: general class of ingredients (ie vodka, salt, beer)
// Implemenetation note: because its name is the unqiue key, deleting (aka archiving) then re-adding a StockType
  // with the same name will result in a "key already exists" error

'use strict';

const Joi = require('joi');

const db = require('../db');


exports.schema = {
  id: Joi.number(),
  name: Joi.string(),
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
  {
    keys: {
      name: 1,
    },
    options: {
      unique: true,
    },
  },
];


exports.initialState = [
  // hard alcohol
  { name: 'dark rum', unitType: 'oz' },
  { name: 'gin', unitType: 'oz' },
  { name: 'tequila', unitType: 'oz' },
  { name: 'vodka', unitType: 'oz' },
  { name: 'white rum', unitType: 'oz' },
  // liquors
  { name: 'irish cream', unitType: 'oz' },
  { name: 'kahlua', unitType: 'oz' },
  { name: 'triple sec', unitType: 'oz' },
  // other alcohols
  { name: 'beer', unitType: 'bottle' },
  { name: 'ginger beer', unitType: 'bottle' },
  // mixers and juices
  { name: 'cola', unitType: 'oz' },
  { name: 'milk', unitType: 'oz' },
  // misc
  { name: 'ice cube' },
];
// Stock: a specific purchase of an ingredient

'use strict';

const Joi = require('joi');

const db = require('../db');
const StockType = require('./StockType');


exports.schema = {
  id: Joi.number(),
  stockTypeId: StockType.schema.id,
  name: Joi.string(),
  initialQuantity: Joi.number().min(1),
  initialCost: Joi.number().min(0),
  remainingQuantity: Joi.number().min(0),

  afterTaxCost: Joi.number().min(0), // auto-calc on save
  unitCost: Joi.number().min(0), // auto-calc on save

  created: Joi.date().timestamp(), // purchased
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
  },
];


exports.preSave = function (object, callback) {

  if (object.initialCost != null) {
    object.afterTaxCost = object.initialCost * (1 + .06 + .18); // TODO put tax in config (separate sales, alcohol tax)
    if (object.initialQuantity != null) {
      object.unitCost = (object.afterTaxCost / object.initialQuantity).toFixed(2);
    }
  }
  callback(null, object);
};


exports.initialState = [];
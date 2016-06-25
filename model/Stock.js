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
  remainingQuantity: Joi.number().min(0).max(Joi.ref('initialQuantity')),
  archived: Joi.boolean().default(false),

  // Metadata
  afterTaxCost: Joi.number().min(0), // auto-calc on save
  unitCost: Joi.number().min(0), // auto-calc on save
  inStock: Joi.boolean(),
  created: Joi.date().timestamp(), // purchased
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


exports.preSave = function (Config, object, callback) {

  if (object.initialCost != null) {
    object.afterTaxCost = object.initialCost * (1 + Config.taxRate);
    if (object.initialQuantity != null) {
      object.unitCost = (object.afterTaxCost / object.initialQuantity);
    }
  }
  callback(null, object);
};


// attaches UI metadata
exports.readMany = function (Mongo, query, sort, callback) {

  const queryInStock = query.inStock;
  delete query.inStock;

  Mongo.collection("Stock").find({ remainingQuantity: { $gt: 0 } }).toArray((err, result) => {

    if (err) {
      return callback(err);
    }

    const inStock = result.map((element) => {
      element.inStock = true;
      return element;
    });

    Mongo.collection("Stock").find({ remainingQuantity: 0 }).toArray((err, result) => {

      if (err) {
        return callback(err);
      }

      const outOfStock = result.map((element) => {
        element.inStock = false;
        return element;
      });

      const stock = inStock.concat(outOfStock).filter((element) => {
        return (queryInStock == null || queryInStock === element.inStock);
      });

      return callback(null, stock);
    });
  });
};


exports.initialState = [];
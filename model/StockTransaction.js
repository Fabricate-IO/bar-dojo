// StockTransaction: purchase of additional quantity of a Stock

'use strict';

const Joi = require('joi');

const db = require('../db');
const BarStock = require('./BarStock');


exports.schema = {
  id: Joi.number(),
  barStockId: BarStock.schema.id,
  itemCost: Joi.number().min(0).description('The receipt cost of the item, before taxes.'),
  quantity: Joi.number().min(1).description('Number of unitSize purchased'),
  unitSize: Joi.number().min(1).description('Size of units purchased'),
  archived: Joi.boolean().default(false),

  // Metadata
  afterTaxCost: Joi.number().min(0), // auto-calc on save
  created: Joi.date().timestamp(),
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


exports.hooks = {

  preSave: function (Config, object, callback) {

    // TODO check if it's an update (ie id already exists)
    // If so, figure out what changed and recalc stock info
    // If unitSize was changed, go back and find / replace those volumes in stock available array Min(<quantity>, remaining quantity at that size) times
    // if quantity was changed, add or remove Min(<quantity delta>, remaining quantity at that size) unitSize from Stock available array
    // Then have to recalc unitCost via crazy weighted averaging that I should triple test

    object.afterTaxCost = object.itemCost * (1 + Config.taxRate);

    // if (object.initialCost != null) {

    //   if (object.initialQuantity != null) {
    //     object.unitCost = (object.afterTaxCost / object.initialQuantity);
    //   }
    // }
    callback(null, object);
  },


  // attaches metadata
  read: function (Mongo, query, sort, limit, callback) {

    const queryInStock = query.inStock;
    delete query.inStock;

    Mongo.collection("Stock").find(query).limit(limit).toArray((err, result) => {

      if (err) {
        return callback(err);
      }

      const stock = result.map((element) => {
        element.inStock = (element.remainingQuantity > 0);
        return element;
      }).filter((element) => {
        return (queryInStock == null || queryInStock === element.inStock);
      });

      return callback(null, stock);
    });
  },
};
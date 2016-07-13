// Transaction: a log of transactions made

'use strict';

const Async = require('async');
const Joi = require('joi');

const Config = require('../config');
const Db = require('../db');
const Splitwise = require('../splitwise');

const BarStock = require('./BarStock');
const Patron = require('./Patron');
const Recipe = require('./Recipe');
const StockModel = require('./StockModel');
const StockType = require('./StockType');


exports.schema = {
  id: Joi.number(),
  type: Joi.string().allow(['order', 'settle', 'restock']),
  barId: Joi.number(),
  monetaryValue: Joi.number().description('The cost of the drink when ordered / settlement payment amount / cost of item restocked'),

  // Restock
  barStockId: BarStock.schema.id,
  stockModelId: StockModel.schema.id.description('Used for restock transactions where the BarStock does not already exist'),
  name: StockModel.schema.name.description('Used for restock transactions where StockModel does not already exist'),
  abv: StockModel.schema.abv.description('Used for restock transactions where StockModel does not already exist'),
  stockTypeId: StockType.schema.id.description('Used for restock transactions where StockModel does not already exist'),
  unitsStocked: Joi.array(Joi.number().min(0)).description('For restocks, array of volumes added'),

  // order / settle
  patronId: Patron.schema.id,
  settlementPlatform: Joi.string().allow(['cash', 'splitwise']),
  recipeId: Recipe.schema.id.description('Recipe ordered'),
  ingredients: Joi.array(Joi.object().keys({
    barStockId: BarStock.schema.id,
    quantity: Joi.number(),
  })).description('BarStock and quantities used in the order'),

  archived: Joi.boolean().default(false),

  // Metadata
  created: Joi.date().timestamp(),
};


exports.indexes = [
  {
    keys: {
      created: 1,
    },
  },
];


exports.hooks = {

  preSave: function (Rethink, object, callback) {

    if (object.type === 'order') {
      if (object.ingredients == null || object.ingredients.length === 0) {
        return callback(new Error('No ingredients defined'));
      }

      if (object.patronId == null) {
        return callback(new Error('No patron defined'));
      }

      Async.forEach(object.ingredients, (ingredient, callback) => {

        if (ingredient.barStockId != null) {
          return Db.BarStock.updateOne(ingredient.barStockId, {
            residualVolumeDelta: -ingredient.quantity,
          }, callback);
        }

        return callback(new Error('Ingredient missing barStockId'));
      },
      (err) => {

        if (err) {
          return callback(err);
        }

        Db.Patron.updateOne(object.patronId, { tabDelta: object.monetaryValue }, (err, result) => {
          return callback(err, object);
        });
      });
    }
    else if (object.type === 'settle') {

      Db.Patron.readOne(object.patronId, (err, patron) => {

        if (err) {
          return callback(err);
        }

        if (patron == null) {
          return callback(new Error('Patron id ' + object.patronId + ' not found'));
        }

        object.monetaryValue = -patron.tab;

        if (object.settlementPlatform === 'splitwise') {

          if (patron.splitwiseId == null) {
            return callback(new Error(patron.name + ' is not connected to splitwise'));
          }

          Splitwise.createExpense(patron.tab, 'Bar Dojo', patron.splitwiseId, (err, result) => {

            if (err) {
              return callback(err);
            }

            return Db.Patron.updateOne(patron.id, { tab: 0 }, (err) => { return callback(err, object); });
          });
        }
        else if (object.settlementPlatform === 'cash') {
          return Db.Patron.updateOne(patron.id, { tab: 0 }, (err) => { return callback(err, object); });
        }
        else {
          return callback(new Error('Settlement missing valid settlementPlatform value'));
        }
      });
    }
    else if (object.type === 'restock') {

      object.monetaryValue = object.monetaryValue * (1 + Config.taxRate); // add taxes

      if (object.barStockId != null) {
        return _updateBarStock(object, callback);
      }
      else {

        if (object.stockModelId == null) {

          if (object.stockTypeId == null || object.name == null) {
            return callback(new Error('Cannot restock - missing barStockId, stockModelId, stockTypeId and name. Cannot create required object(s).'));
          }

          _createStockModel(object, (err, object) => {
            return _createBarStock(object, callback);
          });
        }
        else {
          return _createBarStock(object, callback);
        }
      }
    }
    else {
      return callback(new Error('Transaction object missing type'));
    }
  },
};


function _createBarStock(object, callback) {

  const volumeAvailable = object.unitsStocked.reduce((a, b) => { return a + b; }, 0);

  Db.BarStock.createOne({
    barId: object.barId,
    stockModelId: object.stockModelId,
    remainingUnits: object.unitsStocked,
    volumeCost: object.monetaryValue / volumeAvailable,
  }, (err, result) => {
    object.barStockId = result.id;
    return callback(err, object);
  });
}


function _createStockModel(object, callback) {

  Db.StockModel.createOne({
    name: object.name,
    stockTypeId: object.stockTypeId,
    abv: object.abv,
  }, (err, result) => {
    object.stockModelId = result.id;
    return callback(err, object);
  });
}


function _updateBarStock(object, callback) {

  Db.BarStock.readOne(object.barStockId, (err, result) => {

    if (err) {
      return callback(err);
    }

    if (result == null) {
      return callback(new Error('Specified BarStock does not exist'));
    }

    const update = {
      remainingUnits: result.remainingUnits.concat(object.unitsStocked),
    };
    update.volumeAvailable = result.residualVolume + update.remainingUnits.reduce((a, b) => { return a + b; }, 0);
    update.volumeCost = ((result.volumeCost * result.volumeAvailable) + object.monetaryValue) / update.volumeAvailable;

    Db.BarStock.updateOne(object.barStockId, update, (err, result) => {
      return callback(err, object);
    });
  });
}
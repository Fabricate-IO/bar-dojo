// Transaction: a log of transactions made

const Async = require('async');
const Joi = require('joi');

const Config = require('../config');
const Db = require('../db');
const Splitwise = require('../splitwise');

const Bar = require('./Bar');
const BarStock = require('./BarStock');
const User = require('./User');
const Recipe = require('./Recipe');
const StockModel = require('./StockModel');
const StockType = require('./StockType');


exports.schema = {
  id: Joi.number(),
  type: Joi.string().allow(['order', 'settle', 'restock']),
  barId: Bar.schema.id,
  monetaryValue: Joi.number().description('The cost of the drink when ordered / settlement payment amount / cost of item restocked'),

  // Restock
  barStockId: BarStock.schema.id,
  stockModelId: StockModel.schema.id.description('Used for restock transactions where the BarStock does not already exist'),
  name: StockModel.schema.name.description('Used for restock transactions where StockModel does not already exist'),
  abv: StockModel.schema.abv.description('Used for restock transactions where StockModel does not already exist'),
  stockTypeId: StockType.schema.id.description('Used for restock transactions where StockModel does not already exist'),
  unitsStocked: Joi.array(Joi.number().min(0)).description('For restocks, array of volumes added'),

  // order / settle
  userId: User.schema.id,
  settlementPlatform: Joi.string().allow(['cash', 'splitwise']),
  recipeId: Recipe.schema.id.description('Recipe ordered'),
  ingredients: Joi.array(Joi.object().keys({
    barStockId: BarStock.schema.id,
    quantity: Joi.number(),
  })).description('BarStock and quantities used in the order'),

  archived: Joi.boolean().default(false),

  // Metadata
  created: Joi.date().timestamp().default(Date.now()),
};


exports.indexes = [
  {
    keys: {
      created: 1,
    },
  },
];


exports.hooks = {

  preSave: function (Rethink, auth, object, callback) {

    object.barId = auth.barId;

    if (object.type === 'order') {
      if (object.ingredients == null || object.ingredients.length === 0) {
        return callback(new Error('No ingredients defined'));
      }

      if (object.userId == null) {
        return callback(new Error('No user defined'));
      }

      Async.forEach(object.ingredients, (ingredient, callback) => {

        if (ingredient.barStockId != null) {
          return Db.BarStock.updateOne(auth, ingredient.barStockId, {
            residualVolumeDelta: -ingredient.quantity,
          }, callback);
        }

        return callback(new Error('Ingredient missing barStockId'));
      },
      (err) => {

        if (err) {
          return callback(err);
        }

        Db.User.updateOne(auth, object.userId, { tabDelta: object.monetaryValue }, (err, result) => {
          return callback(err, object);
        });
      });
    }
    else if (object.type === 'settle') {

      Db.User.readOne(auth, object.userId, (err, user) => {

        if (err) {
          return callback(err);
        }

        if (user == null) {
          return callback(new Error('User id ' + object.userId + ' not found'));
        }

        object.monetaryValue = -user.tab;

        if (object.settlementPlatform === 'splitwise') {

          if (user.splitwiseId == null) {
            return callback(new Error(user.name + ' is not connected to splitwise'));
          }

          Splitwise.createExpense(auth, user.tab, 'Tavern Manager', user.splitwiseId, (err, result) => {

            if (err) {
              return callback(err);
            }

            return Db.User.updateOne(auth, user.id, { tab: 0 }, (err) => { return callback(err, object); });
          });
        }
        else if (object.settlementPlatform === 'cash') {
          return Db.User.updateOne(auth, user.id, { tab: 0 }, (err) => { return callback(err, object); });
        }
        else {
          return callback(new Error('Settlement missing valid settlementPlatform value'));
        }
      });
    }
    else if (object.type === 'restock') {

      object.monetaryValue = object.monetaryValue * (1 + Config.taxRate); // add taxes

      if (object.barStockId != null) {
        return _updateBarStock(auth, object, callback);
      }
      else {

        if (object.stockModelId == null) {

          if (object.stockTypeId == null || object.name == null) {
            return callback(new Error('Cannot restock - missing barStockId, stockModelId, stockTypeId and name. Cannot create required object(s).'));
          }

          _createStockModel(auth, object, (err, object) => {
            return _createBarStock(auth, object, callback);
          });
        }
        else {
          return _createBarStock(auth, object, callback);
        }
      }
    }
    else {
      return callback(new Error('Transaction object missing type'));
    }
  },
  read: function (Rethink, auth, query, sort, limit, callback) {

    query.barId = auth.barId;
    Rethink.table('Transaction').filter(query).orderBy(sort).limit(limit).run(callback);
  },
};


function _createBarStock(auth, object, callback) {

  const volumeAvailable = object.unitsStocked.reduce((a, b) => { return a + b; }, 0);

  Db.BarStock.createOne(auth, {
    barId: auth.barId,
    stockModelId: object.stockModelId,
    remainingUnits: object.unitsStocked,
    volumeCost: object.monetaryValue / volumeAvailable,
  }, (err, result) => {
    object.barStockId = result.id;
    return callback(err, object);
  });
}


function _createStockModel(auth, object, callback) {

  Db.StockModel.createOne(auth, {
    name: object.name,
    stockTypeId: object.stockTypeId,
    abv: object.abv,
  }, (err, result) => {
    object.stockModelId = result.id;
    return callback(err, object);
  });
}


function _updateBarStock(auth, object, callback) {

  Db.BarStock.readOne(auth, object.barStockId, (err, result) => {

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

    Db.BarStock.updateOne(auth, object.barStockId, update, (err, result) => {
      return callback(err, object);
    });
  });
}

// Patron: users


'use strict';

const Joi = require('joi');

const Splitwise = require('../splitwise');

const db = require('../db');


exports.schema = {
  id: Joi.number(), // unique key
  name: Joi.string(),
  tab: Joi.number(), // current amount owed (can be negative, ie gift card / credit)
  splitwiseId: Joi.number(), // splitwise user id, if their account is tied to splitwise
  secret: {
    splitwiseToken: Joi.string(), // only for the user(s) making the splitwise transactions
    splitwiseSecret: Joi.string(), // only for the user(s) making the splitwise transactions
  },

  // Metadata
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


// before being sent over the wire, strip secret info
exports.prePublic = function (object, callback) {

  delete object.secret;
  return callback(null, object);
};


// triggers a transaction on the specified platform, then 0's the patron's tab
exports.settle = function (Db, id, platform, callback) {

  Db.Patron.readOne(id, (err, patron) => {

    if (err) {
      return callback(err);
    }

    if (patron == null) {
      return callback(new Error('Patron id ' + id + ' not found'));
    }

    if (platform === 'splitwise') {

      if (patron.splitwiseId == null) {
        return callback(new Error(patron.name + ' is not connected to splitwise'));
      }

      Splitwise.createExpense(patron.tab, 'Bar Dojo', patron.splitwiseId, (err, result) => {

        if (err) {
          return callback(err);
        }

        Db.Patron.updateOne(id, { tab: 0 }, callback);
      });
    }
    else {
      Db.Patron.updateOne(id, { tab: 0 }, callback);
    }
  });
};


exports.initialState = [
  {
    id: 0,
    name: 'Owner',
    tab: 0,
  },
];
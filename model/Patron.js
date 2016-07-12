// Patron: users


'use strict';

const Joi = require('joi');

const Db = require('../db');


exports.schema = {
  id: Joi.number(),
  name: Joi.string(),
  image: Joi.string(), // optional; pulled from API they're created from when possible
  tab: Joi.number(), // current amount owed (can be negative, ie gift card / credit)
  tabDelta: Joi.number().description('Shortcut for charging patrons; positive value = increase tab'),
  splitwiseId: Joi.number().description('splitwise user id, if their account is tied to splitwise'),
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


exports.hooks = {

  preSave: function (Rethink, object, callback) {

    if (object.tabDelta != null) {
      object.tab += object.tabDelta;
      delete object.tabDelta;
    }

    return callback(null, object);
  },
  prePublic: function (object, callback) {

    delete object.secret;
    return callback(null, object);
  },
};


exports.initialState = [
  {
    id: 0,
    name: 'Owner',
    tab: 0,
  },
];


exports.settle = function (id, platform, callback) {
  Db.Transaction.createOne({
    patronId: id,
    settlementPlatform: platform,
    type: 'settle',
  }, callback);
};
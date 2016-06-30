// Patron: users


'use strict';

const Joi = require('joi');

const db = require('../db');


exports.schema = {
  id: Joi.number(), // unique key
  name: Joi.string(),
  tab: Joi.number(), // current amount owed (can be negative, ie gift card / credit)
  splitwiseId: Joi.string(), // splitwise user id, if their account is tied to splitwise
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


exports.initialState = [
  {
    id: 0,
    name: 'Owner',
    tab: 0,
  },
];
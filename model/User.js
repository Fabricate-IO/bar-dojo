// Users: bar owners and patrons

const Joi = require('joi');

const Db = require('../db');
const Bar = require('./Bar');

exports.schema = {
  id: Joi.number(),
  name: Joi.string(),
  image: Joi.string().description('optional; pulled from API they were created from when possible'),
  ownsBarId: Bar.schema.id.description('If they own a bar, what bar?'),
  tab: Joi.number().description('current amount owed (can be negative, ie gift card / credit)'),
  tabDelta: Joi.number().description('Shortcut for charging user; positive value = increase tab'),
  splitwiseId: Joi.number().description('splitwise user id, if their account is tied to splitwise'),
  secret: {
    splitwiseToken: Joi.string().description('API key for users making splitwise transactions'),
    splitwiseSecret: Joi.string().description('API key for users making splitwise transactions'),
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


exports.settle = function (id, platform, callback) {
  Db.Transaction.createOne({
    userId: id,
    settlementPlatform: platform,
    type: 'settle',
  }, callback);
};

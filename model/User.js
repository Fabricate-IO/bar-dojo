// Users: bar owners and patrons

const Joi = require('joi');

const Db = require('../db');
const Bar = require('./Bar');

exports.schema = {
  id: Joi.number(),
  name: Joi.string(),
  image: Joi.string().description('optional; pulled from API they were created from when possible'),
  ownsBarId: Bar.schema.id.description('If they own a bar, what bar?'),
  twitterId: Joi.number().description('For auth; if account created via Twitter API'),
  splitwiseId: Joi.number().description('splitwise user id, if bar is tied to splitwise'),
  tab: Joi.number().description('current amount owed (can be negative, ie gift card / credit)'),
  tabDelta: Joi.number().description('Shortcut for charging user; positive value = increase tab'),

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

  preSave: function (Rethink, auth, object, callback) {

    if (object.tabDelta != null) {
      object.tab += object.tabDelta;
      delete object.tabDelta;
    }

    return callback(null, object);
  },
};


exports.settle = function (auth, id, platform, callback) {
  Db.Transaction.createOne(auth, {
    userId: id,
    settlementPlatform: platform,
    type: 'settle',
  }, callback);
};

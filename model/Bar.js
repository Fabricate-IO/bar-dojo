// Bar: A specific bar location with payment info and settings attached

const Joi = require('joi');


exports.schema = {
  id: Joi.number(),
  name: Joi.string(),
  settings: {
    unitSystem: Joi.string().allow(['common', 'imperial', 'metric']).description('How units should be displayed at this bar'),
  },
  secret: {
    splitwiseToken: Joi.string().description('API key for making splitwise transactions'),
    splitwiseSecret: Joi.string().description('API key for making splitwise transactions'),
  },

  // Metadata
  created: Joi.date().timestamp(),
};


exports.hooks = {

  prePublic: function (auth, object, callback) {

    delete object.secret;
    return callback(null, object);
  },
};


exports.indexes = [];

// Bar: A specific bar location

const Joi = require('joi');


exports.schema = {
  id: Joi.number(),
  name: Joi.string(),

  // Metadata
  created: Joi.date().timestamp(),
};


exports.indexes = [];

// Recipe: a named combination of quantities of stock types

'use strict';

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const db = require('../db');


exports.schema = {
  name: Joi.string(),
  tags: Joi.array().items(Joi.string()), // tag object id
  instructions: Joi.array().items(Joi.string()),
  ingredients: Joi.array().items(Joi.object().keys({
    stockTypeId: Joi.string(),
    quantity: Joi.number(),
  })),

  created: Joi.date().timestamp(),
  archived: Joi.boolean().default(false),
};


exports.indexes = [
  {
    keys: {
      name: 1
    },
    options: {
      unique: true,
    },
  },
];


exports.initialState = [
  {
    name: 'Long Island Ice Tea',
    // TODO tags
    instructions: ['Add ingredients', 'Shake vigorously', 'Enjoy'],
    ingredients: [
      {
        stockTypeId: 'ice cube',
        quantity: 4,
      },
      {
        stockTypeId: 'gin',
        quantity: 1,
      },
      {
        stockTypeId: 'tequila',
        quantity: 1,
      },
      {
        stockTypeId: 'vodka',
        quantity: 1,
      },
      {
        stockTypeId: 'white rum',
        quantity: 1,
      },
      {
        stockTypeId: 'triple sec',
        quantity: 0.5,
      },
      {
        stockTypeId: 'cola',
        quantity: 0.5,
      },
    ],
  },
];
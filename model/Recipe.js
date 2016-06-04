// Recipe: a named combination of quantities of stock types

'use strict';

const Joi = require('joi');

const db = require('../db');


exports.schema = {
  id: Joi.number(),
  name: Joi.string(),
  tags: Joi.array().items(Joi.string()), // tag name
  instructions: Joi.string(), // optional
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
      id: 1
    },
    options: {
      unique: true,
    },
  },
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
    name: 'Dark and Stormy',
    // TODO tags
    ingredients: [
      {
        stockTypeId: 'dark rum',
        quantity: 2,
      },
      {
        stockTypeId: 'ginger beer',
        quantity: 0.2,
      },
    ],
  },
  {
    name: 'Long Island Ice Tea',
    // TODO tags
    instructions: 'Add ingredients. Shake vigorously. Enjoy',
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
        quantity: 4,
      },
    ],
  },
  {
    name: 'Mudslide',
    // TODO tags
    instructions: 'Add ingredients to blender. Blend until smooth. Enjoy',
    ingredients: [
      {
        stockTypeId: 'ice cube',
        quantity: 4,
      },
      {
        stockTypeId: 'irish cream',
        quantity: 1,
      },
      {
        stockTypeId: 'kahlua',
        quantity: 1,
      },
      {
        stockTypeId: 'milk',
        quantity: 1,
      },
      {
        stockTypeId: 'vodka',
        quantity: 1,
      },
    ],
  },
  {
    name: 'Rum and Coke',
    // TODO tags
    ingredients: [
      {
        stockTypeId: 'dark rum',
        quantity: 1.5,
      },
      {
        stockTypeId: 'cola',
        quantity: 5,
      },
    ],
  },
];
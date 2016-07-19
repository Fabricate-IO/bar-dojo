// StockModel: A specific named / branded item, ie 1800 Silver Tequila

const Joi = require('joi');

const StockType = require('./StockType');


exports.schema = {
  id: Joi.number(),
  stockTypeId: StockType.schema.id,
  name: Joi.string(),
  abv: Joi.number().min(0).max(100).description('Alcohol by Volume, 0-100 as percentage'),
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
      name: 1,
    },
  },
];


// pre-populates with generic versions of all non-alcoholic StockTypes
// (since alcoholic versions need to have ABV specified on a per-model basis)
exports.initialState = (() => {

  const StockTypes = require('./initial/StockType');
  const nonAlcoholicCategories = ['mixer', 'juice', 'bitters'];

  return StockTypes.filter((StockType) => {
    return (nonAlcoholicCategories.indexOf(StockType.category) !== -1);
  }).map((StockType) => {
    return {
      name: StockType.id,
      stockTypeId: StockType.id,
      abv: 0,
    };
  });
})();

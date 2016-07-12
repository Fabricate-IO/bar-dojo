// StockType: general class of ingredients (ie vodka, salt, beer)
// Implemenetation note: because its name is the unqiue key, deleting (aka archiving) then re-adding a StockType
  // with the same name will result in a "key already exists" error

'use strict';

const Joi = require('joi');


exports.schema = {
  id: Joi.string().description('unique broad lower case name, ie white rum, dark rum'),
  unitType: Joi.string(),
    // ^^ needs more spec'ing, right now just assumes everything is volume (stored as ML)
};


exports.hooks = {

  read: function (Rethink, query, sort, limit, callback) {

    Rethink.table('StockType').filter(query).orderBy(sort).limit(limit).run((err, result) => {

      if (err) {
        return callback(err);
      }

      const StockTypes = result.map((element) => {

        element.unitType = element.unitType || 'ml';
        return element;
      });

      return callback(null, StockTypes);
    });
  },
};


exports.indexes = [
  {
    keys: {
      id: 1,
    },
    options: {
      unique: true,
    },
  },
];


exports.initialState = require('./initial/StockType');
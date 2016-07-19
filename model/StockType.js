// StockType: general class of ingredients (ie vodka, salt, beer)
// Implemenetation note: because its name is the unqiue key, deleting (aka archiving) then re-adding a StockType
  // with the same name will result in a "key already exists" error
// Not designed to be deleted or edited - global + once they're fully populated, these categories shouldn't really change

const Joi = require('joi');


exports.schema = {
  id: Joi.string().description('unique broad lower case name, ie white rum, dark rum'),
  category: Joi.string().allow(['spirit', 'liqueur', 'wine', 'beer', 'bitters', 'juice', 'mixer'])
      .description('General category of this StockType'),
  unitType: Joi.string(),
    // ^^ needs more spec'ing, right now just assumes everything is volume (stored as ML)
    // ^^ referenced by BarStock
};


exports.hooks = {

  read: function (Rethink, query, sort, limit, callback) {

    Rethink.table('StockType').filter(query).orderBy(sort).limit(limit).run((err, result) => {

      if (err) {
        return callback(err);
      }

      const StockTypes = result.map((element) => {
// NOTE here's where units could be converted on the back-end
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

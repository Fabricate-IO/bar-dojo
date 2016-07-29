// Wrapper around the DB

const Async = require('async');
const Fs = require('fs');
const Hoek = require('hoek');
const Joi = require('joi');
const Models = {};
const RethinkDb = require('rethinkdbdash');
let Rethink = null;
let Config = null;

const modelNames = [ // in requirement order
  'Bar',
  'StockType',
  'StockModel',
  'BarStock',
  'Recipe',
  'User',
  'Friend',
  'Transaction',
];


exports.init = function (config, callback) {

  Config = config;

  Rethink = RethinkDb(Config.rethink);

  if (Config.nuke === true) {
    Rethink.dbDrop(Config.rethink.db);
  }

  // initialize DB and models
  Async.series([
    (callback) => {
      Rethink.dbList().run((err, dbs) => {

        if (err) {
          return callback(err);
        }

        if (dbs.indexOf(Config.rethink.db) !== -1) {
          return callback();
        }

        return Rethink.dbCreate(Config.rethink.db).run(callback);
      });
    },
    (cb) => { Async.each(modelNames, _requireModels, cb); },
    (cb) => { Async.each(modelNames, _setModelInitialState, cb); }, // must be done before other db tasks that might create the table
    (cb) => { Async.each(modelNames, _initializeIndexes, cb); },
    (cb) => { Async.each(modelNames, _assignModelCrudFunctions, cb); },
    (cb) => { Async.each(modelNames, (name, cb) => { exports[name] = Models[name]; cb(); }, cb)},
  ], (err) => {
    return callback(err, exports);
  });
};


exports.exit = function (callback) {
  Rethink.getPoolMaster().drain();
  return callback();
};


// DELETES ALL COLLECTIONS - USE WITH CAUTION
exports.nuke = function (callback) {
  Async.each(modelNames, (modelName, callback) => {
    exports[modelName].nuke({}, {}, callback);
  }, callback);
};


/* ===== CRUD functions ===== */
// each of these can be overridden by a model by defining exports[crud function name]
// even if overridden, it will still go through the same parameter pre-processing for consistency


function create (modelName, auth, objects, callback) {
  Async.eachSeries(objects, (object, cb) => { createOne(modelName, auth, object, cb); }, callback);
}

function createOne (modelName, auth, object, callback) {

  Joi.validate(object, Models[modelName].schema, (err, object) => {

    if (err) {
      return callback(err);
    }

    Models[modelName].hooks.assignId(Rethink, auth, object, (err, object) => {

      if (err) {
        return callback(err);
      }

      Models[modelName].hooks.preSave(Rethink, auth, object, (err, object) => {

        if (err) {
          return callback(err);
        }

        object.archived = object.archived || false; // global default

        Rethink.table(modelName).insert(object).run((err, result) => {
          return callback(err || result.first_error || null, object);
        });
      });
    });
  });
}

// skips archived items unless otherwise specified, defaults to sorting by id (neweset to oldest)
function read (modelName, auth, query, callback) {

  query.archived = query.archived || false;
  query.orderBy = query.orderBy || 'id';
  let sort = Rethink.desc(query.orderBy); // default to desc to show most recent / largest first
  if (query.order === 'asc') {
    sort = Rethink.asc(query.orderBy);
  }
  delete query.orderBy;
  delete query.order;
  let limit = query.limit || 1000;
  delete query.limit;

  return Models[modelName].hooks.read(Rethink, auth, query, sort, limit, callback);
}

// read one, based on id. Uses read to reduce code redundancy
function readOne (modelName, auth, id, callback) {

  return read(modelName, auth, { id: id, limit: 1 }, (err, result) => {
    return callback(err, result[0] || null);
  });
}

// bulk edit via query
// NOTE: does not currently trigger preSave handlers, but that might be a good idea....
function update (modelName, auth, query, delta, callback) {
  return Rethink.table(modelName).filter(query).update(delta).run((err, result) => {
    return callback(err || result.first_error || null, result);
  });
}

// update a single ID - triggers preSave handlers
function updateOne (modelName, auth, id, delta, callback) {

  readOne(modelName, auth, id, (err, object) => {

    if (err) {
      return callback(err);
    }

    if (object == null) {
      delta.id = id;
      return createOne(modelName, auth, delta, callback);
    }

    Hoek.merge(object, delta);

    Models[modelName].hooks.preSave(Rethink, auth, object, (err, delta) => {

      if (err) {
        return callback(err);
      }

      delete delta.id;

      Rethink.table(modelName).get(id).update(delta).run((err, result) => {
        return callback(err || result.first_error || null, result);
      });
    });
  });
}

function archive (modelName, auth, query, callback) {
  return update(modelName, auth, query, { archived: true }, callback);
}

function archiveOne (modelName, auth, id, callback) {
  return updateOne(modelName, auth, id, { archived: true }, callback);
}


/* ===== PRIVATE HELPERS ===== */

// attaches hooks:
  // preSave: edits to single object before being saved
  // prePublic: edits to single object before being sent over the wire. Includes wrapper to support arrays of objects.
  // read: reads one or more objects, with the ability to manipulate them before returning
function _requireModels (modelName, callback) {

  Models[modelName] = require('./model/' + modelName + '.js');
  const hooks = Models[modelName].hooks || {};
  Models[modelName].hooks = {
    assignId: hooks.assignId || ((Rethink, auth, object, callback) => {

      if (object.id != null) {
        return callback(null, object);
      }

      Rethink.table(modelName).max('id').default({ id: -1 }).run((err, result) => {

        if (err) {
          return callback(err);
        }

        object.id = Number(result.id) + 1;
        return callback(null, object);
      });
    }),
    preSave: hooks.preSave || ((Rethink, auth, object, callback) => { callback(null, object); }),
    prePublicObject: hooks.prePublic || ((auth, object, callback) => { callback(null, object); }),
    prePublicArray: ((auth, objectOrObjects, callback) => {
      Async.map([].concat(objectOrObjects),
        (object, callback) => { Models[modelName].hooks.prePublicObject(auth, object, callback); },
        callback);
    }),
    read: hooks.read || ((Rethink, auth, query, sort, limit, callback) => {
      Rethink.table(modelName).filter(query).orderBy(sort).limit(limit).run(callback);
    }),
  };

  return callback();
}

// TODO redo indexes from Mongo
function _initializeIndexes (modelName, callback) {
  // const model = Models[modelName];
  // const collection = Mongo.collection(modelName);

  // model.indexes = [].concat(model.indexes || []);
  // model.indexes.push({ keys: { archived: 1 } }); // automatic index on the archived field
  // Async.forEach(model.indexes, (index, callback) => {
  //   collection.createIndex(index.keys, index.options, callback);
  // }, callback);
  callback();
}


function _setModelInitialState (modelName, callback) {

  _checkIfCollectionExists(modelName, (err, exists) => {

    if (err) {
      return callback(err);
    }

    if (!exists) {

      // TODO log to server: console.log(modelName + ' does not exist, initializing');

      Rethink.tableCreate(modelName).run((err, result) => {

        if (err) {
          return callback(err);
        }

        if (Models[modelName].initialState == null) {
          // TODO log to server: console.log('No initial state defined for ' + modelName + ', skipping initialization');
          return callback();
        }

        return create(modelName, Models[modelName].initialState, callback);
      });
    }
    else {
      return callback();
    }
  });
}


function _assignModelCrudFunctions (modelName, callback) {

  const model = Models[modelName];

  model.create = (auth, objects, callback) => { create(modelName, auth, objects, callback); };
  model.createOne = (auth, object, callback) => { createOne(modelName, auth, object, callback); };
  model.read = (auth, query, callback) => { read(modelName, auth, query, callback); };
  model.readOne = (auth, id, callback) => { readOne(modelName, auth, id, callback); };
  model.update = (auth, query, delta, callback) => { update(modelName, auth, query, delta, callback); };
  model.updateOne = (auth, id, delta, callback) => { updateOne(modelName, auth, id, delta, callback); };
  model.delete = (auth, query, callback) => { archive(modelName, auth, query, callback); };
  model.deleteOne = (auth, id, callback) => { archiveOne(modelName, auth, id, callback); };

  // the actual delete function - USE WITH CAUTION
  model.nuke = (auth, query, callback) => {
    Rethink.table(modelName).filter(query).delete().run(callback);
  };

  // for testing
  model.initialState = Models[modelName].initialState;

  return callback();
}


function _checkIfCollectionExists (collectionName, callback) {

  Rethink.tableList().run((err, result) => {

    if (err) {
      return callback(err);
    }

    return callback(null, result.indexOf(collectionName) !== -1);
  });
}

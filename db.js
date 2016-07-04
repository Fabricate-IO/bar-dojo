// Wrapper around db objects (assumes they're using mongo)

'use strict';

const Async = require('async');
const Fs = require('fs');
const Hoek = require('hoek');
const Joi = require('joi');
const Models = {};
const MongoClient = require('mongodb').MongoClient;
let Mongo = null; // object for accessing the db
let Config = null;

const modelNames = [ // in requirement order
  'StockType',
  'Stock',
  'Recipe',
  'Patron',
  'Friend',
];
const reservedUpdateProperties = [
  '$inc',
  '$mul',
  '$rename',
  '$setOnInsert',
  '$set',
  '$unset',
  '$min',
  '$max',
  '$currentDate'
];


exports.init = function (config, callback) {

  Config = config;

  MongoClient.connect(Config.mongoUrl, (err, db) => {

    if (err) {
      return callback(err);
    }

    Mongo = db;

    if (Config.nuke === true) {
      Mongo.dropDatabase();
    }

    // fetch and initialize all models
    Async.series([
      (cb) => { Async.each(modelNames, _requireModels, cb); },
      (cb) => { Async.each(modelNames, _setModelInitialState, cb); }, // must be done before other db tasks that might create the table
      (cb) => { Async.each(modelNames, _initializeIndexes, cb); },
      (cb) => { Async.each(modelNames, _assignModelCrudFunctions, cb); },
      (cb) => { Async.each(modelNames, (name, cb) => { exports[name] = Models[name]; cb(); }, cb)},
    ], (err) => {
      return callback(err, exports);
    });
  });
};


exports.exit = function (callback) {
  Mongo.close();
  return callback();
};


// DELETES ALL COLLECTIONS - USE WITH CAUTION
exports.nuke = function (callback) {
  Async.each(modelNames, (modelName, callback) => {
    exports[modelName].nuke({}, callback);
  }, callback);
};


/* ===== CRUD functions ===== */
// each of these can be overridden by a model by defining exports[crud function name]
// even if overridden, it will still go through the same parameter pre-processing for consistency


function createMany (modelName, objects, callback) {
  Async.eachSeries(objects, (object, cb) => { createOne(modelName, object, cb); }, callback);
}

function createOne (modelName, object, callback) {

  Joi.validate(object, Models[modelName].schema, (err, object) => {

    if (err) {
      return callback(err);
    }

    Models[modelName].preSave(Config, object, (err, object) => {

      if (err) {
        return callback(err);
      }

      if (object.id == null) {

        Mongo.collection(modelName).findOne({}, { sort: [[ 'id', 'desc' ]] }, (err, result) => {

          if (err) {
            return callback(err);
          }

          object.id = (result == null) ? 0 : Number(result.id) + 1;
          return Mongo.collection(modelName).insert(object, callback);
        });
      }
      else {
        return Mongo.collection(modelName).insert(object, callback);
      }
    });
  });
}

// skips archived items unless otherwise specified, defaults to sorting by id (neweset to oldest)
function readMany (modelName, query, callback) {

  query.archived = query.archived || { $ne: true };
  let sort = { id: -1 };
  if (query.orderBy != null) {
    sort = {};
    sort[query.orderBy] = (query.order === 'desc') ? -1 : 1; // default to asc
  }
  delete query.orderBy;
  delete query.order;

  if (Models[modelName].readMany) {
    return Models[modelName].readMany(Mongo, query, sort, callback);
  }
  else {
    return Mongo.collection(modelName).find(query).sort(sort).toArray(callback);
  }
}

function readOne (modelName, id, callback) {
  return Mongo.collection(modelName).findOne({ id: id }, callback);
}

// bulk edit via query - does not upsert
// if a reserved keyword is used, call update directly
// otherwise, assume it's a $set
function updateMany (modelName, query, delta, callback) {

  if (_objectContainsKeys(delta, reservedUpdateProperties) === false) {
    delta = { $set: delta };
  }

  return Mongo.collection(modelName).update(query, delta, { multi: true }, callback);
}

// update a single ID - creates if it doesn't exist
// if a reserved keyword is used, call update directly
// otherwise, assume it's a $set
function updateOne (modelName, id, delta, callback) {

  readOne(modelName, id, (err, object) => {

    if (err) {
      return callback(err);
    }

    if (object == null) {
      delta.id = id;
      return createOne(modelName, delta, callback);
    }

    Hoek.merge(object, delta);

    Models[modelName].preSave(Config, object, (err, object) => {

      if (err) {
        return callback(err);
      }

      if (_objectContainsKeys(delta, reservedUpdateProperties) === false) {
        delta = { $set: object }; // set object instead of delta in case preSave adjusted other fields
      }

      return Mongo.collection(modelName).updateOne({ id: id }, delta, callback);
    });
  });
}

// doesn't actually delete, just flags as archived
function deleteMany (modelName, query, callback) {
  return updateMany(modelName, query, { archived: true }, callback);
}

function deleteOne (modelName, id, callback) {
  return updateOne(modelName, id, { archived: true }, callback);
}


/* ===== PRIVATE HELPERS ===== */

// attaches hooks:
  // preSave (Config, object, callback): edits to single object before being saved
  // prePublic (object, callback): edits to single object before being sent over the wire. Includes wrapper to support arrays of objects.
function _requireModels (modelName, callback) {

  Models[modelName] = require('./model/' + modelName + '.js');
  Models[modelName].preSave = Models[modelName].preSave || ((Config, object, callback) => { callback(null, object); });
  Models[modelName].prePublicObject = Models[modelName].prePublic || ((object, callback) => { callback(null, object); });
  Models[modelName].prePublicArray = ((objectOrObjects, callback) => {
    Async.map([].concat(objectOrObjects), Models[modelName].prePublicObject, callback);
  });

  return callback();
}


function _initializeIndexes (modelName, callback) {

  const model = Models[modelName];
  const collection = Mongo.collection(modelName);

  model.indexes = [].concat(model.indexes).push({ keys: { archived: 1 } }); // automatic index on the archived field

  Async.forEach(model.indexes, (index, callback) => {
    collection.createIndex(index.keys, index.options);
    callback();
  }, callback);
}


function _setModelInitialState (modelName, callback) {

  _checkIfCollectionExists(modelName, (err, exists) => {

    if (err) {
      return callback(err);
    }

    if (!exists) {

      // TODO log to server: console.log(modelName + ' does not exist, initializing');

      if (Models[modelName].initialState == null) {
        // TODO log to server: console.log('No initial state defined for ' + modelName + ', skipping initialization');
        return callback();
      }

      return createMany(modelName, Models[modelName].initialState, callback);
    }

    return callback();
  });
}


function _assignModelCrudFunctions (modelName, callback) {

  const model = Models[modelName];

  model.create = (objects, callback) => { createMany(modelName, objects, callback); };
  model.createOne = (objects, callback) => { createOne(modelName, objects, callback); };
  model.read = (query, callback) => { readMany(modelName, query, callback); };
  model.readOne = (id, callback) => { readOne(modelName, id, callback); };
  model.update = (query, delta, callback) => { updateMany(modelName, query, delta, callback); };
  model.updateOne = (id, delta, callback) => { updateOne(modelName, id, delta, callback); };
  model.delete = (query, callback) => { deleteMany(modelName, query, callback); };
  model.deleteOne = (id, callback) => { deleteOne(modelName, id, callback); };

  // the actual delete function - USE WITH CAUTION
  model.nuke = (query, callback) => {
    return Mongo.collection(modelName).remove(query, callback);
  };

  // for testing
  model.initialState = Models[modelName].initialState;

  return callback();
}


function _checkIfCollectionExists (collectionName, callback) {

  Mongo.listCollections().toArray((err, items) => {

    if (err) {
      return callback(err);
    }

    for (let i = 0; i < items.length; i++) {
      if (items[i].name === collectionName) {
        return callback(null, true);
      }
    }

    return callback(null, false);
  });
}


// returns whether the object (incl nested properties) contains any of the listed keys
function _objectContainsKeys (object, keys) {

  if (object == null) {
    return false;
  }

  let hasAKey = false;

  Object.keys(object).forEach((objKey) => {

    if (typeof object[objKey] === 'object') {
      if (_objectContainsKeys(object[objKey], keys) === true) {
        hasAKey = true;
      }
    }

    if (keys.indexOf(objKey) !== -1) { hasAKey = true; }
  });

  return hasAKey;
}
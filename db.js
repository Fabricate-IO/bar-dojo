// Wrapper around db objects (assumes they're using mongo)

'use strict';

const Async = require('async');
const Fs = require('fs');
const Joi = require('joi');
const Models = {};
const MongoClient = require('mongodb').MongoClient;
let Mongo = null; // object for accessing the db


exports.init = function (Config, callback) {

  MongoClient.connect(Config.mongoUrl, (err, db) => {

    if (err) {
      return callback(err);
    }

    Mongo = db;

    if (Config.nuke === true) {
      Mongo.dropDatabase();
    }

    // fetch and initialize all models
    const modelNames = [ // in requirement order
      'StockType',
      'Recipe',
    ];

    Async.series([
      (cb) => { Async.each(modelNames, _requireModels, cb); },
      (cb) => { Async.each(modelNames, _setModelInitialState, cb); }, // must be done before other db tasks that might create the table
      (cb) => { Async.each(modelNames, _initializeIndexes, cb); },
      (cb) => { Async.each(modelNames, _assignModelCrudFunctions, cb); },
    ], (err) => {
      return callback(err, exports);
    });
  });
};


exports.exit = function (callback) {

  Mongo.close();
  return callback();
};


/* ===== CRUD functions ===== */


function createMany (modelName, objects, callback) {
  Async.eachSeries(objects, (object, cb) => { createOne(modelName, object, cb); }, callback);
}
function createOne (modelName, object, callback) {

  Joi.validate(object, Models[modelName].schema, (err, object) => {

    if (err) {
      return callback(err);
    }

    if (object.id == null) {

      Mongo.collection(modelName).findOne({}, { sort: [[ 'id', 'desc' ]] }, (err, result) => {

        if (err) {
          return callback(err);
        }

        object.id = (result == null) ? 0 : result.id + 1;
        return Mongo.collection(modelName).insert(object, callback);
      });
    }
    else {
      return Mongo.collection(modelName).insert(object, callback);
    }
  });
}

// skips archived items unless otherwise specified, defaults to sorting by id (neweset to oldest)
function readMany (modelName, query, callback) {
  query.archived = query.archived || { $ne: true };
  var sort = query.sort || { id: -1 };
  delete query.sort;
  return Mongo.collection(modelName).find(query).sort(sort).toArray(callback);
}
function readOne (modelName, id, callback) {
  return Mongo.collection(modelName).findOne({ id: id }, callback);
}

function updateMany (modelName, query, delta, callback) {
  return Mongo.collection(modelName).update(query, { $set: delta }, callback);
}
function updateOne (modelName, id, delta, callback) {
  readOne(modelName, id, (err, result) => {
    return Mongo.collection(modelName).updateOne({ id: id }, { $set: delta }, { upsert: true }, callback);
  })
  // return Mongo.collection(modelName).updateOne({ id: id }, { $set: delta }, callback);
}

// doesn't actually delete, just flags as archived
function deleteMany (modelName, query, callback) {
  return updateMany(modelName, query, { archived: true }, callback);
}
function deleteOne (modelName, id, callback) {
  return updateOne(modelName, id, { archived: true }, callback);
}


/* ===== PRIVATE HELPERS ===== */

function _requireModels (modelName, callback) {

  Models[modelName] = require('./model/' + modelName + '.js');
  return callback();
}


function _initializeIndexes (modelName, callback) {

  const model = Models[modelName];
  const collection = Mongo.collection(modelName);

  model.indexes.push({ keys: { archived: 1 } }); // automatic index on the archived field

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

  exports[modelName] = {
    create: (objects, callback) => { createMany(modelName, objects, callback); },
    createOne: (objects, callback) => { createOne(modelName, objects, callback); },
    read: (query, callback) => { readMany(modelName, query, callback); },
    readOne: (id, callback) => { readOne(modelName, id, callback); },
    update: (query, delta, callback) => { updateMany(modelName, query, delta, callback); },
    updateOne: (id, delta, callback) => { updateOne(modelName, id, delta, callback); },
    delete: (query, callback) => { deleteMany(modelName, query, callback); },
    deleteOne: (id, callback) => { deleteOne(modelName, id, callback); },

    // the actual delete function - USE WITH CAUTION
    nuke: (query, callback) => {
      return Mongo.collection(modelName).remove(query, callback);
    },

    // for testing
    initialState: model.initialState,
  };

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
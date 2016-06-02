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

    // fetch and initialize all models

    const modelNames = Fs.readdirSync('./model').map((filename) => { return filename.replace('.js', ''); });
    return Async.series([
      (cb) => { Async.each(modelNames, _requireModels, cb); },
      (cb) => { Async.each(modelNames, _initializeIndexes, cb); },
      (cb) => { Async.each(modelNames, _setModelInitialState, cb); },
      (cb) => { Async.each(modelNames, _assignModelCrudFunctions, cb); },
    ], callback);
  });
};


exports.exit = function (callback) {

  Mongo.close();
  return callback();
};


/* ===== PRIVATE HELPERS ===== */

function _requireModels (modelName, callback) {

  Models[modelName] = require('./model/' + modelName + '.js');
  return callback();
}


function _initializeIndexes (modelName, callback) {

  const model = Models[modelName];
  const collection = Mongo.collection(modelName);

  model.indexes.push({ keys: { archived: 1 } }); // automatic index on the archived field

  return Async.forEach(model.indexes, (index, callback) => {
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

      console.log(modelName + ' does not exist, initializing');

      if (Models[modelName].initialState == null) {
        console.log('No initial state defined for ' + modelName + ', skipping initialization');
        return callback();
      }

      return create(modelName, Models[modelName].initialState, callback);
    }

    return callback();
  });
}


function _assignModelCrudFunctions (modelName, callback) {

  const model = Models[modelName];
  const schemaArray = Joi.array().items(model.schema);

  exports[modelName] = {
    initialState: model.initialState, // for testing

    create: (objects, callback) => {
      Joi.validate(objects, schemaArray, (err, objects) => {

        if (err) {
          return callback(err);
        }
        return Mongo.collection(modelName).insertMany(objects, callback);
      });
    },
    createOne: (object, callback) => {
      Joi.validate(object, model.schema, (err, object) => {

        if (err) {
          return callback(err);
        }
        return Mongo.collection(modelName).insert(object, callback);
      });
    },

    // skips archived items unless otherwise specified
    read: (query, callback) => {
      if (query.archived == null) {
        query.archived = { $ne: true };
      }
      return Mongo.collection(modelName).find(query).toArray(callback);
    },
    readOne: (query, callback) => {
      if (query.archived == null) {
        query.archived = { $ne: true };
      }
      return Mongo.collection(modelName).findOne(query, callback);
    },

    update: (query, delta, callback) => {
      return Mongo.collection(modelName).update(query, { $set: delta }, callback);
    },
    updateOne: (query, delta, callback) => {
      return Mongo.collection(modelName).updateOne(query, { $set: delta }, callback);
    },

    // doesn't actually delete, just flags as archived
    delete: (query, callback) => {
      return Mongo.collection(modelName).update(query, { $set: { archived: true } }, callback);
    },
    deleteOne: (query, callback) => {
      return Mongo.collection(modelName).updateOne(query, { $set: { archived: true } }, callback);
    },

    // the actual delete function - USE WITH CAUTION
    nuke: (query, callback) => {
      return Mongo.collection(modelName).remove(query, callback);
    },
  };
  callback();
}


function _checkIfCollectionExists (collectionName, callback) {

  Mongo.listCollections().toArray((err, items) => {

    if (err) {
      return callback(err);
    }

    for (var i = 0; i < items.length; i++) {
      if (items[i].name === collectionName) {
        return callback(null, true);
      }
    }

    return callback(null, false);
  });
}
'use strict';

const Db = require('./db');

const Config = {
  mongoUrl: 'mongodb://localhost:27017/BarNinja',
};


// general structure
  // static assets
    // css
    // img
    // js
  // templates
  // web server
    // UI
    // API
  // db objects
    // general mongo driver - auto-generates Mongo[modelName] from models folder?
      // db models
        // special case for stock types, recipes: initial state

// general flow
  // server.js run
  // initializes DB connections and objects
  // starts web server

Db.init(Config, (err) => {

  if (err) {
    return console.log('err');
  }

  console.log('DB initialized');
});

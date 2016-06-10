'use strict';

const Async = require('async');
const Hapi = require('hapi');

const Db = require('./db');
const Routes = require('./routes');

const Config = {
  mongoUrl: 'mongodb://localhost:27017/BarDojo',
  server: {
    host: 'localhost',
    port: 8000,
  }
};


exports.init = function (callback) {

  const server = new Hapi.Server();
  server.connection(Config.server);

  Db.init(Config, (err, db) => {

    if (err) {
      return callback(err);
    }

    server.app.db = db;

    server.register(require('inert'), (err) => {

      if (err) {
        return callback(err);
      }

      server.route(require('./routes'));

      return server.start(callback);
    });
  });
};


exports.init((err) => {

  if (err) {
    throw err;
  }

  console.log('Bar Dojo ready to go');
});
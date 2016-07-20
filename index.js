const Async = require('async');
const Hapi = require('hapi');

const Config = require('./config');
const Db = require('./db');
const Routes = require('./routes');


exports.init = function (callback) {

  const server = new Hapi.Server();
  server.connection(Config.server);

  server.register([require('hapi-auth-cookie'), require('bell')], (err) => {

    if (err) {
      return callback(err);
    }

    // http://mph-web.de/social-signup-with-twitter-using-hapi-js/
    server.auth.strategy('session', 'cookie', Config.sessionCookie);

    server.auth.strategy('twitter', 'bell', Config.twitterAuth);

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
  });
};


exports.init((err) => {

  if (err) {
    throw err;
  }

  console.log('Bar Dojo ready to go');
});

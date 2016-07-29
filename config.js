const Hoek = require('hoek');


const defaults = {
  rethink: {
    db: 'BarDojo',
  },
  server: {
    port: 8000,
  },
  taxRate: .24, // including sales tax, alcohol tax, etc

  // secrets
  sessionCookie: {
    password: 'password-password-password-password', // Use something more secure in production, min 32 characters
    redirectTo: '/auth/twitter',
    isSecure: true, // Set to false for local dev
  },
  splitwise: {
    consumerKey: null,
    consumerSecret: null,
    requestTokenUrl: null,
    accessTokenUrl: null,
    authorizeUrl: null,
  },
  twitterAuth: {
    provider: 'twitter',
    password: 'password-password-password-password', // Use something more secure in production, min 32 characters
    clientId: null,
    clientSecret: null,
    isSecure: true, // Set to false for local dev
  },
};

const options = (process.env.NODE_ENV === 'test') ? require('./config-test') : require('./config-secret');

const internals = Hoek.applyToDefaults(defaults, options);

module.exports = internals;

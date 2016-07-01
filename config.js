const Hoek = require('hoek');


const defaults = {
  mongoUrl: 'mongodb://localhost:27017/BarDojo',
  server: {
    port: 8000,
  },
  taxRate: .24, // including sales tax, alcohol tax, etc

  // secrets
  braintree: {
    environment: null,
    merchantId: null,
    publicKey: null,
    privateKey: null,
  },
  splitwise: {
    consumerKey: null,
    consumerSecret: null,
    requestTokenUrl: null,
    accessTokenUrl: null,
    authorizeUrl: null,
  }
};

const internals = Hoek.applyToDefaults(defaults, require('./config-secret'));

module.exports = internals;
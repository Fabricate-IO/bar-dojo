const Splitwise = require('splitwise-node');

const Db = require('./db');
const Config = require('./config');


exports.isSetup = function (auth, bar, callback) {

  if (bar.secret == null || bar.secret.splitwiseToken == null || bar.secret.splitwiseSecret == null) {
    return callback(null, false);
  }

  let splitwise = new Splitwise(Config.splitwise.consumerKey, Config.splitwise.consumerSecret);
  splitwise = splitwise.getSplitwiseApi(bar.secret.splitwiseToken, bar.secret.splitwiseSecret);
  return splitwise.getCurrentUser()
    .then((data) => {
      splitwiseOwnerId = data.id;
      setupComplete = true;
      return callback(null, true);
    })
    .catch(callback);
};


exports.setup = function (auth, bar, callback) {

  splitwise = new Splitwise(Config.splitwise.consumerKey, Config.splitwise.consumerSecret);

  if (bar.secret == null || bar.secret.splitwiseToken == null || bar.secret.splitwiseSecret == null) {

    // get splitwise access code and save to bar
    splitwise.getOAuthRequestToken()
    .then(({ token, secret }) => {

      bar.secret = bar.secret || {};
      bar.secret.splitwiseToken = token;
      bar.secret.splitwiseSecret = secret;

      Db.Bar.updateOne(auth, bar.id, { secret: bar.secret }, (err, result) => {

        if (err) {
          return callback(err);
        }

        return callback(null, splitwise.getUserAuthorisationUrl(token));
      });
    })
    .catch(callback);
  }

// TODO test access code for validity?
// TODO exchange request code for access token? (splitwise.getOAuthAccessToken)

  else {

    if (splitwise.getSplitwiseApi == null) {
      return callback(new Error('Failed to initialize Splitwise API'));
    }

    splitwise = splitwise.getSplitwiseApi(bar.secret.splitwiseToken, bar.secret.splitwiseSecret);
    splitwise.getCurrentUser()
    .then((data) => {
      return callback(null, true);
    })
    .catch(callback);
  }
};


exports.getFriends = function (auth, callback) {

  Db.Bar.readOne(auth, auth.barId, (err, bar) => {

    if (err) {
      return callback(err);
    }

    let splitwise = new Splitwise(Config.splitwise.consumerKey, Config.splitwise.consumerSecret);
    splitwise = splitwise.getSplitwiseApi(bar.secret.splitwiseToken, bar.secret.splitwiseSecret);
    return splitwise.getFriends()
    .then((data) => {
      return callback(null, data);
    })
    .catch(callback);
  });
};


exports.createExpense = function (auth, amount, description, splitwiseId, callback) {

  Db.Bar.readOne(auth, auth.barId, (err, bar) => {

    if (err) {
      return callback(err);
    }

    let splitwise = new Splitwise(Config.splitwise.consumerKey, Config.splitwise.consumerSecret);
    splitwise = splitwise.getSplitwiseApi(bar.secret.splitwiseToken, bar.secret.splitwiseSecret);
    splitwise.getCurrentUser()
    .then((data) => {
      const splitwiseOwnerId = data.id;
      splitwise.createExpense({
        payment: false,
        cost: amount,
        description: description,
      }, [{
        user_id: splitwiseId,
        paid_share: 0,
        owed_share: amount,
      }, {
        user_id: splitwiseOwnerId,
        paid_share: amount,
        owed_share: 0,
      }])
      .then((data) => {
        return callback(null, data);
      })
      .catch(callback);
    })
    .catch(callback);
  });
};

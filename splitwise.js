const Splitwise = require('splitwise-node');

const Db = require('./db');
const Config = require('./config');

let splitwise = null;
let splitwiseOwnerId = null;
let setupComplete = false;


exports.isSetup = function (callback) {
  return callback(null, setupComplete);
};


exports.setup = function (callback) {

  if (splitwise == null) {
    splitwise = new Splitwise(Config.splitwise.consumerKey, Config.splitwise.consumerSecret);
  }

  Db.Patron.readOne(0, (err, result) => {

    if (err) {
      return callback(err);
    }

    if (result.secret == null || result.secret.splitwiseToken == null || result.secret.splitwiseSecret == null) {

      // get splitwise access code and save to master user
      splitwise.getOAuthRequestToken()
      .then(({ token, secret }) => {

        Db.Patron.updateOne(0, { 'secret.splitwiseToken': token, 'secret.splitwiseSecret': secret }, (err, result) => {

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
      splitwise = splitwise.getSplitwiseApi(result.secret.splitwiseToken, result.secret.splitwiseSecret);
      splitwise.getCurrentUser()
        .then((data) => {
          splitwiseOwnerId = data.id;
          setupComplete = true;
          return callback(null, true);
        })
        .catch(callback);
    }
  });
};


exports.getFriends = function (callback) {

  splitwise.getFriends()
  .then((data) => {
    return callback(null, data);
  })
  .catch(callback);
};


exports.createExpense = function (amount, description, splitwiseId, callback) {

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
};
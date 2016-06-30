const Splitwise = require('./splitwise');


// returns true if all setup steps are complete
// otherwise works through setup tasks one at a time, returning redirect URLs
exports.setup = function (callback) {

  Splitwise.isSetup((err, splitwiseIsSetup) => {

    if (err) {
      return callback(err);
    }

    if (splitwiseIsSetup === false) {

      Splitwise.setup((err, result) => {

        if (err) {
          return callback(err);
        }

        return callback(null, result);
      });
    }
    else {
      return callback(null, true);
    }
  });
};
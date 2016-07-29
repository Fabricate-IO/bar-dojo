const Db = require('./db');
const Splitwise = require('./splitwise');


// returns true if all setup steps are complete
// otherwise works through setup tasks one at a time, returning redirect URLs
exports.setup = function (auth, callback) {

  Db.Bar.readOne(auth, auth.barId, (err, bar) => {

    if (err) {
      return callback(err);
    }

    Splitwise.isSetup(auth, bar, (err, splitwiseIsSetup) => {

      if (err) {
        return callback(err);
      }

      if (splitwiseIsSetup === false) {

        Splitwise.setup(auth, bar, (err, result) => {

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
  });
};

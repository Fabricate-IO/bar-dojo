// Friend: Use the splitwise API (not the DB) to fetch a list of friends

const Joi = require('joi');

const Splitwise = require('../splitwise');


exports.schema = {
  id: Joi.number(),
  name: Joi.string(),
};


exports.hooks = {

// TODO does not currently support sorting / querying. Since it's pulling from an external API, need to implement in JS
  read: function (Rethink, query, sort, limit, callback) {

    Splitwise.getFriends((err, result) => {

      if (err) {
        return callback(err);
      }

      const friends = result.map((friend) => {
        return {
          id: friend.id,
          image: friend.picture.large,
          name: ([friend.first_name, friend.last_name]).filter((name) => { return (name != null); })
              .join(' ')
              .trim(),
        };
      });

      return callback(null, friends.slice(0, limit));
    });
  },
};

// Friend: Use the splitwise API (not the DB) to fetch a list of friends

'use strict';

const Joi = require('joi');

const Splitwise = require('../splitwise');


exports.schema = {
  id: Joi.number(),
  name: Joi.string(),
};


exports.hooks = {

  read: function (Mongo, query, sort, callback) {

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

      return callback(null, friends);
    });
  },
};
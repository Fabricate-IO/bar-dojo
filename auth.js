const Boom = require('boom');

const Db = require('./db');


module.exports = [
  {
    method: 'GET',
    path: '/auth/twitter',
    config: {
      auth: 'twitter',
    },
    handler: (request, reply) => {

      if (!request.auth.isAuthenticated) {
        return reply(Boom.unauthorized('Authentication failed: ' + request.auth.error.message));
      }

      const auth = request.auth.credentials;
      const id = auth.profile.id;

      Db.User.read(auth, { twitterId: id }, (err, result) => {

        if (err) {
          return reply(Boom.badImplementation(err));
        }
        if (result.length > 1) {
          console.log('Error: duplicate user detected for twitter ID ' + id);
          return reply(Boom.conflict(new Error('Duplicate user detected')));
        }

        if (result.length === 1) { // if this user already exists, return the user

          if (result[0].ownsBarId == null) {
            return reply(Boom.forbidden('User does not own a bar'));
          }

          request.cookieAuth.set({
            id: result[0].id,
            barId: result[0].ownsBarId,
            token: request.auth.credentials.token,
            secret: request.auth.credentials.secret,
          });

          return reply.redirect('/');
        }
        else { // otherwise, create the user and bar

          Db.Bar.createOne(auth, {
            name: request.auth.credentials.profile.displayName + "'s bar",
          }, (err, bar) => {

            if (err) {
              return reply(Boom.badImplementation(err));
            }

            Db.User.createOne(auth, {
              twitterId: id,
              name: request.auth.credentials.profile.displayName,
              image: request.auth.credentials.profile.raw.profile_image_url,
              tab: 0,
              ownsBarId: bar.id,
            }, (err, user) => {

              if (err) {
                return reply(Boom.badImplementation(err));
              }

              request.cookieAuth.set({
                id: user.id,
                barId: bar.id,
                token: request.auth.credentials.token,
                secret: request.auth.credentials.secret,
              });

              return reply.redirect('/');
            });
          });
        }
      });
    },
  },
];

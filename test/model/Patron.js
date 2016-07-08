// Stock-specific DB test cases

'use strict';

const Async = require('async');
const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const Config = require('../../config');
const Db = require('../../db');
const helpers = require('../helpers');

const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const after = lab.after;
const expect = Code.expect;


describe('Patron:', () => {

  before((done) => {

    Db.init(Config, (err) => {

      expect(err).to.be.null();

      Db.nuke((err) => {

        expect(err).to.be.null();
        done();
      });
    });
  });

  after(Db.exit);


  const fixtures = {
    Patron: [
      {
        id: 1,
        name: 'Tester',
        tab: 10,
      },
    ],
  };

  it('create fixtures', (done) => {

    Async.eachOf(fixtures, (value, key, callback) => {
      Db[key].create(value, callback);
    }, (err) => {
      expect(err).to.be.null();
      done();
    });
  });

  it('settles correctly (using cash)', (done) => {

    Db.Patron.settle(Db, 1, 'cash', (err, result) => {

      expect(err).to.be.null();

      Db.Patron.readOne(1, (err, result) => {

        expect(err).to.be.null();
        expect(result.tab).to.equal(0);
        done();
      });
    });
  });
});

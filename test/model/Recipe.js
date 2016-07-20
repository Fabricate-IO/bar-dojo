// Recipe-specific DB test cases

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


const auth = {
  id: 0,
  barId: 0,
};


describe('Recipe:', () => {

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
    BarStock: [
      {
        barId: 0,
        stockModelId: 0,
        volumeCost: 1,
        residualVolume: 10,
      },
      {
        barId: 0,
        stockModelId: 1,
        volumeCost: 10,
        remainingUnits: [10],
        residualVolume: 0,
      },
      {
        barId: 0,
        stockModelId: 2,
        volumeCost: 999,
        residualVolume: 2,
      },
      {
        barId: 0,
        stockModelId: 3,
        volumeCost: 999,
        residualVolume: 0,
      },
      {
        barId: 0,
        stockModelId: 4,
        volumeCost: 999,
        residualVolume: 10,
        archived: true,
      },
      {
        barId: 0,
        stockModelId: 5,
        volumeCost: 999,
        residualVolume: 2,
      },
      {
        barId: 0,
        stockModelId: 6,
        volumeCost: 999,
        residualVolume: 0,
      },
      {
        barId: 0,
        stockModelId: 7,
        volumeCost: 999,
        residualVolume: 10,
        archived: true,
      },
      {
        barId: 1,
        stockModelId: 8,
        volumeCost: 999,
        residualVolume: 10,
      },
    ],
    Recipe: [
      {
        id: 0,
        name: 'In Stock',
        ingredients: [{
          stockTypeId: 'dark rum',
          quantity: 5,
        }],
      },
      {
        id: 1,
        name: 'Out of Stock',
        ingredients: [{
          stockTypeId: 'dark rum',
          quantity: 5,
        }, {
          stockTypeId: 'gin',
          quantity: 5,
        }],
      },
    ],
    StockModel: [
      {
        id: 0,
        stockTypeId: 'dark rum',
        name: 'In stock - cheap',
      },
      {
        id: 1,
        stockTypeId: 'dark rum',
        name: 'In stock - expensive',
      },
      {
        id: 2,
        stockTypeId: 'dark rum',
        name: 'In stock - not enough',
      },
      {
        id: 3,
        stockTypeId: 'dark rum',
        name: 'Out of stock',
      },
      {
        id: 4,
        stockTypeId: 'dark rum',
        name: 'Archived BarStock',
      },
      {
        id: 5,
        stockTypeId: 'gin',
        name: 'In stock - not enough',
      },
      {
        id: 6,
        stockTypeId: 'gin',
        name: 'Out of stock',
      },
      {
        id: 7,
        stockTypeId: 'gin',
        name: 'Archived BarStock',
      },
      {
        id: 8,
        stockTypeId: 'gin',
        name: 'Different barId',
      },
    ],
    StockType: [
      {
        id: 'dark rum',
      },
      {
        id: 'gin',
      },
    ],
  };


  it('create fixtures', (done) => {

    Async.eachOf(fixtures, (value, key, callback) => {
      Db[key].create(auth, value, callback);
    }, (err) => {
      expect(err).to.be.null();
      done();
    });
  });

  it('minCost, maxCost based on non-archived, in stock options of sufficient quantity', (done) => {

    Db.Recipe.read(auth, {}, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(fixtures.Recipe.length);

      const recipes = helpers.objectArrayToDict(result);
      expect(recipes[0].costMin).to.equal(5);
      expect(recipes[0].costMax).to.equal(50);

      done();
    });
  });

  it('sets inStock correctly', (done) => {

    Db.Recipe.read(auth, {}, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(fixtures.Recipe.length);

      const recipes = helpers.objectArrayToDict(result);
      expect(recipes[0].inStock).to.equal(true);
      expect(recipes[1].inStock).to.equal(false);

      done();
    });
  });

  it('searches for inStock correctly', (done) => {

    Db.Recipe.read(auth, { inStock: true }, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(1);
      expect(result[0].id).to.equal(0);
      done();
    });
  });

  it('searches for outOfStock correctly', (done) => {

    Db.Recipe.read(auth, { inStock: false }, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(1);
      expect(result[0].id).to.equal(1);
      done();
    });
  });

  it('based on current bar stock only', (done) => {

    auth.barId = 1;

    Db.Recipe.read(auth, {}, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(fixtures.Recipe.length);

      const recipes = helpers.objectArrayToDict(result);
      expect(recipes[0].inStock).to.equal(false);
      expect(recipes[1].inStock).to.equal(false);

      auth.barId = 0;

      done();
    });
  });
});

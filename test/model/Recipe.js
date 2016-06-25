// Recipe-specific DB test cases

'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const Config = require('../../config-testing');
const Db = require('../../db');
const helpers = require('../helpers');

const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const after = lab.after;
const expect = Code.expect;


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


  const recipeFixtures = [
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
  ];

  const stockFixtures = [
    {
      id: 0,
      stockTypeId: 'dark rum',
      name: 'In stock - cheap',
      initialQuantity: 10,
      initialCost: 1,
      remainingQuantity: 10,
    },
    {
      id: 1,
      stockTypeId: 'dark rum',
      name: 'In stock - expensive',
      initialQuantity: 10,
      initialCost: 10,
      remainingQuantity: 10,
    },
    {
      id: 2,
      stockTypeId: 'dark rum',
      name: 'In stock - not enough',
      initialQuantity: 10,
      initialCost: 999,
      remainingQuantity: 2,
    },
    {
      id: 3,
      stockTypeId: 'dark rum',
      name: 'Out of stock',
      initialQuantity: 10,
      initialCost: 999,
      remainingQuantity: 0,
    },
    {
      id: 4,
      stockTypeId: 'dark rum',
      name: 'Archived',
      initialQuantity: 10,
      initialCost: 999,
      remainingQuantity: 10,
      archived: true,
    },
    {
      id: 5,
      stockTypeId: 'gin',
      name: 'In stock - not enough',
      initialQuantity: 10,
      initialCost: 999,
      remainingQuantity: 2,
    },
    {
      id: 6,
      stockTypeId: 'gin',
      name: 'Out of stock',
      initialQuantity: 10,
      initialCost: 999,
      remainingQuantity: 0,
    },
    {
      id: 7,
      stockTypeId: 'gin',
      name: 'Archived',
      initialQuantity: 10,
      initialCost: 999,
      remainingQuantity: 10,
      archived: true,
    },
  ];

  it('create fixtures', (done) => {

    Db.Recipe.create(recipeFixtures, (err) => {

      expect(err).to.be.null();

      Db.Stock.create(stockFixtures, (err) => {

        expect(err).to.be.null();
        done();
      });
    });
  });

  it('minCost, maxCost based on non-archived, in stock options of sufficient quantity', (done) => {

    Db.Recipe.read({}, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(recipeFixtures.length);

      const recipes = helpers.objectArrayToDict(result);
      expect(recipes[0].costMin).to.equal(0.5);
      expect(recipes[0].costMax).to.equal(5);

      done();
    });
  });

  it('sets inStock correctly', (done) => {

    Db.Recipe.read({}, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(recipeFixtures.length);

      const recipes = helpers.objectArrayToDict(result);
      expect(recipes[0].inStock).to.equal(true);
      expect(recipes[1].inStock).to.equal(false);

      done();
    });
  });

  it('searches for inStock correctly', (done) => {

    Db.Recipe.read({ inStock: true }, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(1);
      expect(result[0].id).to.equal(0);
      done();
    });
  });

  it('searches for outOfStock correctly', (done) => {

    Db.Recipe.read({ inStock: false }, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(1);
      expect(result[0].id).to.equal(1);
      done();
    });
  });
});

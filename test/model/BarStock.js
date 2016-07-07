// Stock-specific DB test cases

'use strict';

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


describe('BarStock:', () => {

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


  const fixtures = [
    { // out of stock
      barId: 0,
      stockModelId: 0,
      remainingUnits: [],
      residualVolume: 0,
    },
    { // in stock - remaining unit
      barId: 0,
      stockModelId: 1,
      remainingUnits: [10],
      residualVolume: 0,
    },
    { // in stock - residual
      barId: 0,
      stockModelId: 2,
      residualVolume: 100,
    },
  ];

  it('create fixtures', (done) => {

    Db.BarStock.create(fixtures, (err) => {

      expect(err).to.be.null();
      done();
    });
  });

  it('assigns inStock and volumeAvailable correctly', (done) => {

    Db.BarStock.read({}, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(fixtures.length);

      const stock = helpers.objectArrayToDict(result);
      expect(stock[0].inStock).to.equal(false);
      expect(stock[1].inStock).to.equal(true);
      expect(stock[2].inStock).to.equal(true);
      expect(stock[0].volumeAvailable).to.equal(0);
      expect(stock[1].volumeAvailable).to.equal(10);
      expect(stock[2].volumeAvailable).to.equal(100);

      done();
    });
  });

  it('searching for inStock: true returns expected results', (done) => {

    Db.BarStock.read({ inStock: true }, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(2);
      const ids = result.map((element) => { return element.id; });
      expect(ids).to.contain([1, 2]);
      done();
    });
  });

  it('searching for inStock: false returns expected results', (done) => {

    Db.BarStock.read({ inStock: false }, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(1);
      expect(result[0].id).to.equal(0);
      done();
    });
  });

  // it('update updates preSave fields', (done) => {

  //   Config.taxRate = 0.1;

  //   Db.BarStock.updateOne(1, { initialCost: 20 }, (err) => {

  //     expect(err).to.be.null();

  //     Db.BarStock.readOne(1, (err, result) => {

  //       expect(err).to.be.null();
  //       expect(result.initialCost).to.equal(20);
  //       expect(result.afterTaxCost).to.equal(22);
  //       expect(result.unitCost).to.equal(2.2);
  //       Config.taxRate = 0;
  //       done();
  //     });
  //   });
  // });

  // it('update does not trigger preSave if fields not present', (done) => {

  //   Db.BarStock.updateOne(1, { initialCost: null }, (err) => {

  //     expect(err).to.be.null();

  //     Db.BarStock.readOne(1, (err, result) => {

  //       expect(err).to.be.null();
  //       expect(result.initialCost).to.be.null();
  //       expect(result.afterTaxCost).to.equal(22);
  //       expect(result.unitCost).to.equal(2.2);
  //       done();
  //     });
  //   });
  // });
});

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

      const stock = helpers.objectArrayToDict(result, _compoundKey);
      expect(stock['0-0'].inStock).to.equal(false);
      expect(stock['0-1'].inStock).to.equal(true);
      expect(stock['0-2'].inStock).to.equal(true);
      expect(stock['0-0'].volumeAvailable).to.equal(0);
      expect(stock['0-1'].volumeAvailable).to.equal(10);
      expect(stock['0-2'].volumeAvailable).to.equal(100);

      done();
    });
  });

  it('searching for inStock: true returns expected results', (done) => {

    Db.BarStock.read({ inStock: true }, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(2);
      const ids = result.map(_compoundKey);
      expect(ids).to.contain(['0-1', '0-2']);
      done();
    });
  });

  it('searching for inStock: false returns expected results', (done) => {

    Db.BarStock.read({ inStock: false }, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(1);
      const ids = result.map(_compoundKey);
      expect(ids).to.contain(['0-0']);
      done();
    });
  });
});

function _compoundKey (element) {
  return element.barId + '-' + element.stockModelId;
}
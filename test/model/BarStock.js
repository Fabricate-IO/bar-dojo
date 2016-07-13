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


  const fixtures = {
    BarStock: [
      {
        barId: 0,
        stockModelId: 0,
        remainingUnits: [],
        residualVolume: 0,
      },
      {
        barId: 0,
        stockModelId: 1,
        remainingUnits: [10],
        residualVolume: 0,
      },
      {
        barId: 0,
        stockModelId: 2,
        residualVolume: 100,
      },
    ],
    StockModel: [
      {
        id: 0,
        stockTypeId: 'dark rum',
        name: 'out of stock',
      },
      {
        id: 1,
        stockTypeId: 'dark rum',
        name: 'in stock - remaining unit',
      },
      {
        id: 2,
        stockTypeId: 'dark rum',
        name: 'in stock - residual',
      },
    ],
    StockType: [
      {
        id: 'dark rum',
        category: 'spirit',
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

  it('assigns inStock and volumeAvailable correctly', (done) => {

    Db.BarStock.read({}, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(fixtures.BarStock.length);

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

  it('filtering on inStock: true returns expected results', (done) => {

    Db.BarStock.read({ inStock: true }, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(2);
      const ids = result.map(_compoundKey);
      expect(ids).to.contain(['0-1', '0-2']);
      done();
    });
  });

  it('filtering on inStock: false returns expected results', (done) => {

    Db.BarStock.read({ inStock: false }, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(1);
      const ids = result.map(_compoundKey);
      expect(ids).to.contain(['0-0']);
      done();
    });
  });

  it('read returns object with joined properties', (done) => {

    Db.BarStock.read({ barId: 0, stockModelId: 0 }, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(1);
      expect(result[0].stockTypeId).to.equal('dark rum');
      expect(result[0].name).to.equal('out of stock');
      expect(result[0].unitType).to.equal('ml');
      done();
    });
  });

  it('subtracts negative residualVolumeDelta from residualVolume', (done) => {

    Db.BarStock.updateOne('0-2', { residualVolumeDelta: -10 }, (err, result) => {

      expect(err).to.be.null();

      Db.BarStock.readOne('0-2', (err, result) => {

        expect(err).to.be.null();
        expect(result.residualVolume).to.equal(90);
        done();
      });
    });
  });

  it('pulls from remainingUnits when residualVolume goes below zero', (done) => {

    Db.BarStock.updateOne('0-1', { residualVolumeDelta: -5 }, (err, result) => {

      expect(err).to.be.null();

      Db.BarStock.readOne('0-1', (err, result) => {

        expect(err).to.be.null();
        expect(result.residualVolume).to.equal(5);
        expect(result.remainingUnits.length).to.equal(0);
        done();
      });
    });
  });

  it('residualVolume cannot go below zero', (done) => {

    Db.BarStock.updateOne('0-0', { residualVolumeDelta: -5 }, (err, result) => {

      expect(err).to.be.null();

      Db.BarStock.readOne('0-0', (err, result) => {

        expect(err).to.be.null();
        expect(result.residualVolume).to.equal(0);
        done();
      });
    });
  });
});


describe('BarStock category search:', () => {

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
        remainingUnits: [],
        residualVolume: 0,
      },
      {
        barId: 0,
        stockModelId: 1,
        residualVolume: 0,
      },
    ],
    StockModel: [
      {
        id: 0,
        stockTypeId: 'dark rum',
        name: 'spirit',
      },
      {
        id: 1,
        stockTypeId: 'ginger beer',
        name: 'beer',
      },
    ],
    StockType: [
      {
        id: 'dark rum',
        category: 'spirit',
      },
      {
        id: 'ginger beer',
        category: 'beer',
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

  it('filtering on category returns expected results', (done) => {

    Db.BarStock.read({ category: 'beer' }, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(1);
      const ids = result.map(_compoundKey);
      expect(ids).to.contain(['0-1']);
      done();
    });
  });
});


function _compoundKey (element) {
  return element.barId + '-' + element.stockModelId;
}
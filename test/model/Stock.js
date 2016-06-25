// Stock-specific DB test cases

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


describe('Stock:', () => {

  before((done) => {

    Db.init(Config, (err) => {

      expect(err).to.be.null();

      Db.Stock.nuke({}, (err) => {

        expect(err).to.be.null();
        done();
      });
    });
  });

  after(Db.exit);


  const fixtures = [
    {
      id: 0,
      stockTypeId: 'dark rum',
      name: 'Out of stock',
      initialQuantity: 10,
      initialCost: 0,
      remainingQuantity: 0,
    },
    {
      id: 1,
      stockTypeId: 'dark rum',
      name: 'In stock',
      initialQuantity: 10,
      initialCost: 10,
      remainingQuantity: 10,
    },
  ];

  it('create fixtures', (done) => {

    Db.Stock.create(fixtures, (err) => {

      expect(err).to.be.null();
      done();
    });
  });

  it('assigns inStock and costs correctly', (done) => {

    Db.Stock.read({}, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(fixtures.length);

      const stock = helpers.objectArrayToDict(result);
      expect(stock[0].inStock).to.equal(false);
      expect(stock[1].inStock).to.equal(true);
      expect(stock[0].afterTaxCost).to.equal(fixtures[0].initialCost);
      expect(stock[1].afterTaxCost).to.equal(fixtures[1].initialCost);
      expect(stock[0].unitCost).to.equal(0);
      expect(stock[1].unitCost).to.equal(1);

      done();
    });
  });

  it('searching for inStock: true returns expected results', (done) => {

    Db.Stock.read({ inStock: true }, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(1);
      expect(result[0].id).to.equal(1);
      done();
    });
  });

  it('searching for inStock: false returns expected results', (done) => {

    Db.Stock.read({ inStock: false }, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(1);
      expect(result[0].id).to.equal(0);
      done();
    });
  });
});



// it('createOne (preSave triggers)', (done) => {

//     Db.Stock.createOne({ id: 1, initialCost: 10, initialQuantity: 5 }, (err) => {

//       expect(err).to.be.null();

//       Db.Stock.readOne(1, (err, result) => {

//         expect(err).to.be.null();
//         expect(result.initialCost).to.equal(10);
//         expect(result.afterTaxCost).to.be.at.least(10);
//         expect(result.unitCost).to.be.at.least(2);
//         done();
//       });
//     });
//   });

//   it('updateOne (preSave triggers)', (done) => {

//     Db.Stock.updateOne(1, { initialCost: 20 }, (err) => {

//       expect(err).to.be.null();

//       Db.Stock.readOne(1, (err, result) => {

//         expect(err).to.be.null();
//         expect(result.initialCost).to.equal(20);
//         expect(result.afterTaxCost).to.be.at.least(20);
//         expect(result.unitCost).to.be.at.least(4);
//         done();
//       });
//     });
//   });

//   it('createOne (preSave does not trigger if fields not present)', (done) => {

//     Db.Stock.createOne({ id: 2 }, (err) => {

//       expect(err).to.be.null();

//       Db.Stock.readOne(2, (err, result) => {

//         expect(err).to.be.null();
//         expect(result.initialCost).to.be.undefined();
//         expect(result.afterTaxCost).to.be.undefined();
//         expect(result.unitCost).to.be.undefined();
//         done();
//       });
//     });
//   });
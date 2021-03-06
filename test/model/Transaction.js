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


const auth = {
  id: 0,
  barId: 0,
};


describe('Transaction (order):', () => {

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
        remainingUnits: [10],
        residualVolume: 1,
      },
    ],
    User: [
      {
        id: 1,
        name: 'Tester',
        tab: 0,
      },
    ],
    Recipe: [
      {
        id: 0,
        name: 'Rum drink',
        ingredients: [
          {
            stockTypeId: 'rum',
            quantity: 1,
          },
        ],
      },
    ],
    StockModel: [
      {
        id: 0,
        stockTypeId: 'rum',
        name: 'Test Rum',
        abv: 40,
      },
    ],
    StockType: [
      {
        id: 'rum',
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

  it('order', (done) => {

    Db.Transaction.createOne(auth, {
      type: 'order',
      barId: 0,
      userId: 1,
      recipeId: 1,
      monetaryValue: 1,
      ingredients: [
        {
          barStockId: '0-0',
          quantity: 1,
        },
      ],
      barStockId: '0-0',
    }, (err) => {

      expect(err).to.be.null();

      Db.BarStock.readOne(auth, '0-0', (err, result) => {

        expect(err).to.be.null();
        expect(result).to.not.be.null();
        expect(result.remainingUnits.length).to.equal(1);
        expect(result.volumeAvailable).to.equal(10);

        Db.User.readOne(auth, 1, (err, result) => {

          expect(err).to.be.null();
          expect(result.tab).to.equal(1);
          done();
        });
      });
    });
  });
});


describe('Transaction (restock):', () => {

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
        volumeCost: 0,
        remainingUnits: [],
        residualVolume: 0,
      },
    ],
    StockModel: [
      {
        id: 0,
        stockTypeId: 'rum',
        name: 'Test Rum 0',
        abv: 40,
      },
      {
        id: 1,
        stockTypeId: 'rum',
        name: 'Test Rum 1',
        abv: 40,
      },
    ],
    StockType: [
      {
        id: 'rum',
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

  it('known barStockId', (done) => {

    Db.Transaction.createOne(auth, {
      type: 'restock',
      barId: 0,
      barStockId: '0-0',
      monetaryValue: 10,
      unitsStocked: [100],
    }, (err) => {

      expect(err).to.be.null();

      Db.BarStock.readOne(auth, '0-0', (err, result) => {

        expect(err).to.be.null();
        expect(result).to.not.be.null();
        expect(result.remainingUnits).to.equal([100]);
        expect(result.volumeCost).to.equal(0.1);
        expect(result.volumeAvailable).to.equal(100);
        done();
      });
    });
  });

  it('creates a new BarStock', (done) => {

    Db.Transaction.createOne(auth, {
      type: 'restock',
      barId: 0,
      stockModelId: 1,
      monetaryValue: 10,
      unitsStocked: [100],
    }, (err) => {

      expect(err).to.be.null();

      Db.BarStock.readOne(auth, '0-1', (err, result) => {

        expect(err).to.be.null();
        expect(result).to.not.be.null();
        expect(result.remainingUnits).to.equal([100]);
        expect(result.volumeCost).to.equal(0.1);
        expect(result.volumeAvailable).to.equal(100);
        done();
      });
    });
  });

  it('creates a new StockModel and BarStock', (done) => {

    Db.Transaction.createOne(auth, {
      type: 'restock',
      barId: 0,
      stockTypeId: 'rum',
      name: 'Test rum 2',
      abv: 50,
      monetaryValue: 10,
      unitsStocked: [100],
    }, (err) => {

      expect(err).to.be.null();

      Db.StockModel.readOne(auth, 2, (err, result) => {

        expect(err).to.be.null();
        expect(result).to.not.be.null();
        expect(result.abv).to.equal(50);
        expect(result.name).to.equal('Test rum 2');

        Db.BarStock.readOne(auth, '0-2', (err, result) => {

          expect(err).to.be.null();
          expect(result).to.not.be.null();
          expect(result.remainingUnits).to.equal([100]);
          expect(result.volumeCost).to.equal(0.1);
          expect(result.volumeAvailable).to.equal(100);
          done();
        });
      });
    });
  });
});


describe('Transaction (settle):', () => {

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
    User: [
      {
        id: 1,
        name: 'Tester',
        tab: 10,
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

  it('settles correctly using cash', (done) => {

    Db.User.settle(auth, 1, 'cash', (err) => {

      expect(err).to.be.null();

      Db.User.readOne(auth, 1, (err, result) => {

        expect(err).to.be.null();
        expect(result.tab).to.equal(0);

        Db.Transaction.read(auth, {}, (err, result) => {

          expect(err).to.be.null();
          expect(result.length).to.equal(1);
          expect(result[0].monetaryValue).to.equal(-10);
          done();
        });
      });
    });
  });
});


describe('Transaction (auth):', () => {

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
    User: [
      {
        id: 1,
        name: 'Tester',
        tab: 10,
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

  it('transactions only visible to the bar created on', (done) => {

    Db.User.settle(auth, 1, 'cash', (err) => {

      expect(err).to.be.null();

      Db.User.readOne(auth, 1, (err, result) => {

        expect(err).to.be.null();
        expect(result.tab).to.equal(0);

        Db.Transaction.read(auth, {}, (err, result) => {

          expect(err).to.be.null();
          expect(result.length).to.equal(1);

          auth.barId = 1;

          Db.Transaction.read(auth, {}, (err, result) => {

            expect(err).to.be.null();
            expect(result.length).to.equal(0);

            auth.barId = 0;

            done();
          });
        });
      });
    });
  });
});

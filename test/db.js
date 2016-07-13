// General DB CRUD test cases
// Using StockType model
// Model-specific test cases go in /test/model

'use strict';

const Async = require('async');
const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const Config = require('../config');
const Db = require('../db');
const helpers = require('./helpers');

const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const after = lab.after;
const expect = Code.expect;


describe('CRUD:', () => {

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


  it('read (empty)', (done) => {

    Db.StockType.read({}, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(0);
      done();
    });
  });

  it('readOne (empty)', (done) => {

    Db.StockType.readOne(0, (err, result) => {

      expect(err).to.be.null();
      expect(result).to.be.null();
      done();
    });
  });

  it('createOne', (done) => {

    Db.StockType.createOne({ id: 'test' }, (err, result) => {

      expect(err).to.be.null();
      done();
    });
  });

  it('readOne', (done) => {

    Db.StockType.readOne('test', (err, result) => {

      expect(err).to.be.null();
      expect(result).to.not.be.null();
      expect(result.id).to.equal('test');
      done();
    });
  });

  it('read', (done) => {

    Db.StockType.read({}, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(1);
      done();
    });
  });

  it('updateOne', (done) => {

    Db.StockType.updateOne('test', { unitType: 'cats' }, (err, result) => {

      expect(err).to.be.null();

      Db.StockType.read({}, (err, result) => {

        expect(err).to.be.null();
        expect(result.length).to.equal(1);
        helpers.checkArrayEquality(result, [{ id: 'test', unitType: 'cats' }]);
        done();
      });
    });
  });

  it('update', (done) => {

    Db.StockType.update({}, { unitType: 'bottle' }, (err, result) => {

      expect(err).to.be.null();

      Db.StockType.read({}, (err, result) => {

        expect(err).to.be.null();
        expect(result.length).to.equal(1);
        helpers.checkArrayEquality(result, [{ id: 'test', unitType: 'bottle' }]);
        done();
      });
    });
  });

  it('create', (done) => {

    Db.StockType.create([{ id: 'test2' }, { id: 'test3' }], (err) => {

      expect(err).to.be.null();
      done();
    });
  });

  it('read', (done) => {

    Db.StockType.read({}, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(3);
      helpers.checkArrayEquality(result, [{ id: 'test3' }, { id: 'test2' }, { id: 'test' }]);
      done();
    });
  });

  it('read (sorted)', (done) => {

    Db.StockType.read({ orderBy: 'id', order: 'asc' }, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(3);
      helpers.checkArrayEquality(result, [{ id: 'test' }, { id: 'test2' }, { id: 'test3' }]);
      done();
    });
  });

  it('delete', (done) => {

    Db.StockType.delete({ id: 'test3' }, (err) => {

      expect(err).to.be.null();

      Db.StockType.read({}, (err, result) => {

        expect(err).to.be.null();
        expect(result.length).to.equal(2);
        helpers.checkArrayEquality(result, [{ id: 'test2' }, { id: 'test' }]);

        Db.StockType.read({ archived: true }, (err, result) => {

          expect(err).to.be.null();
          expect(result.length).to.equal(1);
          helpers.checkArrayEquality(result, [{ id: 'test3' }]);
          done();
        });
      });
    });
  });

  it('deleteOne', (done) => {

    Db.StockType.deleteOne('test2', (err) => {

      expect(err).to.be.null();

      Db.StockType.read({}, (err, result) => {

        expect(err).to.be.null();
        expect(result.length).to.equal(1);
        helpers.checkArrayEquality(result, [{ id: 'test' }]);

        Db.StockType.read({ archived: true }, (err, result) => {

          expect(err).to.be.null();
          expect(result.length).to.equal(2);
          helpers.checkArrayEquality(result, [{ id: 'test3' }, { id: 'test2' }]);
          done();
        });
      });
    });
  });

  it('updateOne (upsert if it does not exist)', (done) => {

    Db.StockType.updateOne('test5', { unitType: 'bottle' }, (err, result) => {

      expect(err).to.be.null();

      Db.StockType.readOne('test5', (err, result) => {

        expect(err).to.be.null();
        expect(result.id).to.equal('test5');
        expect(result.unitType).to.equal('bottle');
        done();
      });
    });
  });

  it('createOne (id specified)', (done) => {

    Db.StockType.createOne({ id: 'test6' }, (err) => {

      expect(err).to.be.null();

      Db.StockType.readOne('test6', (err, result) => {

        expect(err).to.be.null();
        expect(result.id).to.equal('test6');
        done();
      });
    });
  });
});


describe('CRUD egde cases:', () => {

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


  it('createOne (errors on validation)', (done) => {

    Db.StockType.createOne({ id: 123 }, (err) => {

      expect(err).to.not.be.null();
      done();
    });
  });

  it('create (errors on validation and does not create an object)', (done) => {

    Db.StockType.create([{ id: 1 }, { id: 2 }], (err) => {

      expect(err).to.not.be.null();

      Db.StockType.read({}, (err, result) => {

        expect(err).to.be.null();
        expect(result.length).to.equal(0);
        done();
      });
    });
  });

  it('createOne (errors on duplicate id and does not create an object)', (done) => {

    Db.StockType.createOne({ id: 'test' }, (err) => {

      expect(err).to.be.null();

      Db.StockType.createOne({ id: 'test' }, (err) => {

        expect(err).to.not.be.null();

        Db.StockType.read({}, (err, result) => {

          expect(err).to.be.null();
          expect(result.length).to.equal(1);
          done();
        });
      });
    });
  });

  it('createOne (errors on duplicate compound id and does not create an object)', (done) => {

    const fixtures = {
      BarStock: [{
        barId: 1,
        stockModelId: 1,
      }],
      StockModel: [{
        id: 1,
        stockTypeId: 'dark rum',
      }],
      StockType: [{
        id: 'dark rum',
      }]
    }

    Async.eachOf(fixtures, (value, key, callback) => {
      Db[key].create(value, callback);
    }, (err) => {

      expect(err).to.be.null();

      Db.BarStock.createOne({ barId: 1, stockModelId: 1 }, (err) => {

        expect(err).to.not.be.null();

        Db.BarStock.read({}, (err, result) => {

          expect(err).to.be.null();
          expect(result.length).to.equal(1);
          done();
        });
      });
    });
  });
});
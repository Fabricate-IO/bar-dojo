'use strict';

const Code = require('code');
const Db = require('../db');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const Config = {
  mongoUrl: 'mongodb://localhost:27017/test',
};

const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const after = lab.after;
const expect = Code.expect;


describe('CRUD', () => {

  before((done) => {

    Db.init(Config, (err) => {

      expect(err).to.be.null();

      Db.StockType.nuke({}, (err) => {

        expect(err).to.be.null();
        done();
      });
    });
  });

  after(Db.exit);


  it('read - empty', (done) => {

    Db.StockType.read({}, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(0);
      done();
    });
  });

  it('readOne - empty', (done) => {

    Db.StockType.readOne({}, (err, result) => {

      expect(err).to.be.null();
      expect(result).to.be.null();
      done();
    });
  });

  it('createOne', (done) => {

    Db.StockType.createOne({ id: 'test' }, (err) => {

      expect(err).to.be.null();
      done();
    });
  });

  it('readOne', (done) => {

    Db.StockType.readOne({ id: 'test' }, (err, result) => {

      expect(err).to.be.null();
      expect(result.id).to.equal('test');
      done();
    });
  });

  it('updateOne', (done) => {

    Db.StockType.updateOne({ id: 'test' }, { id: 'test4' }, (err, result) => {

      expect(err).to.be.null();
      done();
    });
  });

  it('read - confirm update', (done) => {

    Db.StockType.read({}, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(1);
      _checkArrayEquality([{ id: 'test4' }], result);
      done();
    });
  });

  it('update', (done) => {

    Db.StockType.update({}, { id: 'test' }, (err, result) => {

      expect(err).to.be.null();
      done();
    });
  });

  it('read - confirm update', (done) => {

    Db.StockType.read({}, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(1);
      _checkArrayEquality([{ id: 'test' }], result);
      done();
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
      _checkArrayEquality([{ id: 'test' }, { id: 'test2' }, { id: 'test3' }], result);
      done();
    });
  });

  it('delete', (done) => {

    Db.StockType.delete({ id: 'test3' }, (err) => {

      expect(err).to.be.null();
      done();
    });
  });

  it('read - confirm delete', (done) => {

    Db.StockType.read({}, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(2);
      _checkArrayEquality([{ id: 'test' }, { id: 'test2' }], result);
      done();
    });
  });

  it('deleteOne', (done) => {

    Db.StockType.deleteOne({ id: 'test2' }, (err) => {

      expect(err).to.be.null();
      done();
    });
  });

  it('read - confirm delete', (done) => {

    Db.StockType.read({}, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(1);
      _checkArrayEquality([{ id: 'test' }], result);
      done();
    });
  });

  it('read - confirm archived', (done) => {

    Db.StockType.read({ archived: true }, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(2);
      _checkArrayEquality([{ id: 'test2' }, { id: 'test3' }], result);
      done();
    });
  });
});


describe('CRUD - egde cases', () => {

  before((done) => {

    Db.init(Config, (err) => {

      expect(err).to.be.null();

      Db.StockType.nuke({}, (err) => {

        expect(err).to.be.null();
        done();
      });
    });
  });

  after(Db.exit);


  it('createOne - fails validation, errors', (done) => {

    Db.StockType.createOne({ id: 123 }, (err) => {

      expect(err).to.not.be.null();
      done();
    });
  });

  it('create - fails validation, errors', (done) => {

    Db.StockType.create([{ id: 1 }, { id: 2 }], (err) => {

      expect(err).to.not.be.null();
      done();
    });
  });

  it('read - confirm no objects created', (done) => {

    Db.StockType.read({}, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(0);
      done();
    });
  });

  it('updateOne - does not exist, should not error', (done) => {

    Db.StockType.updateOne({ id: 'test' }, { id: 'test4' }, (err, result) => {

      expect(err).to.be.null();
      done();
    });
  });

  it('update - does not exist, should not error', (done) => {

    Db.StockType.update({}, { id: 'test' }, (err, result) => {

      expect(err).to.be.null();
      done();
    });
  });

  it('createOne - prep', (done) => {

    Db.StockType.createOne({ id: 'test' }, (err) => {

      expect(err).to.be.null();
      done();
    });
  });

  it('createOne - duplicate id, errors', (done) => {

    Db.StockType.createOne({ id: 'test' }, (err) => {

      expect(err).to.not.be.null();
      done();
    });
  });
});


/* ===== Helpers ===== */

// checks for equality, skipping mongo properties like _id
function _checkArrayEquality (a, b) {

  expect(a.length).to.equal(b.length);
  for (let i = 0; i < a.length; i++) {
    _checkEquality(a[i], b[i]);
  }
}


// checks for equality, skipping mongo properties like _id
function _checkEquality (a, b) {

  Object.keys(a).forEach((property) => {
  // for (let property in a) {
    if (property !== '_id') {
      expect(a[property]).to.equal(b[property], { prototype: false });
    }
  });
}
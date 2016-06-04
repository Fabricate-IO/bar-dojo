'use strict';

const Code = require('code');
const Db = require('../db');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const Config = {
  mongoUrl: 'mongodb://localhost:27017/test',
  nuke: true,
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

    Db.StockType.createOne({ name: 'test' }, (err) => {

      expect(err).to.be.null();
      done();
    });
  });

  it('readOne', (done) => {

    Db.StockType.readOne(0, (err, result) => {

      expect(err).to.be.null();
      expect(result.name).to.equal('test');
      done();
    });
  });

  it('updateOne', (done) => {

    Db.StockType.updateOne(0, { name: 'test4' }, (err, result) => {

      expect(err).to.be.null();
      done();
    });
  });

  it('read - confirm update', (done) => {

    Db.StockType.read({}, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(1);
      _checkArrayEquality(result, [{ id: 0, name: 'test4' }]);
      done();
    });
  });

  it('update', (done) => {

    Db.StockType.update({}, { name: 'test' }, (err, result) => {

      expect(err).to.be.null();
      done();
    });
  });

  it('read - confirm update', (done) => {

    Db.StockType.read({}, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(1);
      _checkArrayEquality(result, [{ id: 0, name: 'test' }]);
      done();
    });
  });

  it('create', (done) => {

    Db.StockType.create([{ name: 'test2' }, { name: 'test3' }], (err) => {

      expect(err).to.be.null();
      done();
    });
  });

  it('read', (done) => {

    Db.StockType.read({}, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(3);
      _checkArrayEquality(result, [{ id: 2, name: 'test3' }, { id: 1, name: 'test2' }, { id: 0, name: 'test' }]);
      done();
    });
  });

  it('delete', (done) => {

    Db.StockType.delete({ name: 'test3' }, (err) => {

      expect(err).to.be.null();
      done();
    });
  });

  it('read - confirm delete', (done) => {

    Db.StockType.read({}, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(2);
      _checkArrayEquality(result, [{ id: 1, name: 'test2' }, { id: 0, name: 'test' }]);
      done();
    });
  });

  it('deleteOne', (done) => {

    Db.StockType.deleteOne(1, (err) => {

      expect(err).to.be.null();
      done();
    });
  });

  it('read - confirm delete', (done) => {

    Db.StockType.read({}, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(1);
      _checkArrayEquality(result, [{ name: 'test' }]);
      done();
    });
  });

  it('read - confirm archived', (done) => {

    Db.StockType.read({ archived: true }, (err, result) => {

      expect(err).to.be.null();
      expect(result.length).to.equal(2);
      _checkArrayEquality(result, [{ id: 2, name: 'test3' }, { id: 1, name: 'test2' }]);
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


  it('createOne - fails name validation, errors', (done) => {

    Db.StockType.createOne({ name: 123 }, (err) => {

      expect(err).to.not.be.null();
      done();
    });
  });

  it('create - fails name validation, errors', (done) => {

    Db.StockType.create([{ name: 1 }, { name: 2 }], (err) => {

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

    Db.StockType.updateOne(10, { name: 'test4' }, (err, result) => {

      expect(err).to.be.null();
      done();
    });
  });

  it('update - does not exist, should not error', (done) => {

    Db.StockType.update({}, { name: 'test' }, (err, result) => {

      expect(err).to.be.null();
      done();
    });
  });

  it('createOne - prep', (done) => {

    Db.StockType.createOne({ name: 'test' }, (err) => {

      expect(err).to.be.null();
      done();
    });
  });

  it('createOne - duplicate name, errors', (done) => {

    Db.StockType.createOne({ name: 'test' }, (err) => {

      expect(err).to.not.be.null();
      done();
    });
  });
});


/* ===== Helpers ===== */

// checks that a contains b
function _checkArrayEquality (a, b) {
  expect(a.length).to.equal(b.length);
  for (let i = 0; i < a.length; i++) {
    _checkEquality(a[i], b[i]);
  }
}


// checks for equality (that a contains b)
function _checkEquality (a, b) {
  Object.keys(b).forEach((property) => {
    expect(a[property]).to.equal(b[property], { prototype: false });
  });
}
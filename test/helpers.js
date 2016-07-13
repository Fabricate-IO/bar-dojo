'use strict';

const Code = require('code');

const expect = Code.expect;


// checks for equality (that a contains b)
exports.checkEquality = function (a, b) {

  Object.keys(b).forEach((property) => {
    expect(a[property]).to.equal(b[property], { prototype: false });
  });
};


// for each object, checks that a[i] contains b[i]
exports.checkArrayEquality = function (a, b) {

  expect(a.length).to.equal(b.length);
  a.forEach((element, index) => {
    exports.checkEquality(element, b[index]);
  });
};


// given an array of objects, returns a dictionary of id: object
// id [optional]: string of field, or function to contstruct key from element. Defaults to 'id'
exports.objectArrayToDict = function (array, id) {

  let idFunc = id;
  if (typeof id === 'string' || id == null) {
    idFunc = ((el) => { return el[id || 'id']; });
  }

  const output = {};
  array.forEach((element) => {
    const key = idFunc(element);
    output[key] = element;
  });
  return output;
};
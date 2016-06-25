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
exports.objectArrayToDict = function (array) {

  const output = {};
  array.forEach((element) => {
    output[element.id] = element;
  });
  return output;
};
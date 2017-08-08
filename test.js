const fs = require('fs');
const path = require('path');
const genHash = require('./');

genHash({
  c: './test.config.json',
});

const hashFile = require('./test/test-hash.js');

test('gen hash file', () => {
  const hashFile = fs.statSync(path.relative(__dirname, './test/test-hash.js'));
  expect(hashFile).toBeDefined;
});

test('contain all file hash value', () => {
  expect(typeof hashFile.testIndex).toBe('string');
  expect(hashFile.testIndex.length).toBe(8);
});

test('create a copy of original file with hash in filename', () => {
  const fileCopy = fs.statSync(path.relative(__dirname, `./test/index.${hashFile.testIndex}.js`));
  expect(fileCopy).toBeDefined;
});

genHash({
  config: './test-2.config.json',
});

test('gen hash file', () => {
  const hashFile = fs.statSync(path.relative(__dirname, './test/test-hash-2.js'));
  expect(hashFile).toBeDefined;
});

const hashFile2 = require('./test/test-hash-2.js');

test('contain all file hash value', () => {
  expect(typeof hashFile2['index-2']).toBe('string');
  expect(hashFile2['index-2'].length).toBe(32);
});

test('create a copy of original file with hash in filename', () => {
  const fileCopy = fs.statSync(path.relative(__dirname, `./test/index-2.${hashFile2['index-2']}.css`));
  expect(fileCopy).toBeDefined;
});

test('passing config object directly', () => {
  genHash({
    files: [{
      file: "test/index.js",
      name: "testIndex"
    }],
    output: {
      file: "test/test-hash.js"
    },
    len: 8,
    rename: false,
    copy: true
  });
});

const fs = require('fs');
const path = require('path');
const genHash = require('./');

genHash({
  config: './test.config.json',
});

const hashFile = require('./test/test-hash.js');

test('gen hash file', () => {
  fs.stat(path.relative(__dirname, './test/test-hash.js'), (err, stats) => {
    expect(err).toBeUndefined;
  });
});

test('contain all file hash value', () => {
  expect(typeof hashFile.testIndex).toBe('string');
  expect(hashFile.testIndex.length).toBe(8);
});

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const util = require('util');

let config = {};

function fileMD5(buffer) {
  const fsHash = crypto.createHash('md5');
  fsHash.update(buffer);
  let hash = fsHash.digest('hex');
  if (config.len) {
    hash = hash.substr(0, config.len);
  }
  return hash;
}

function genHash(argv) {
  if (require.main === module) {
    argv = require('minimist')(process.argv.slice(2));
  }
  const configFilePath = argv.c || argv.config || './auto-hash.config.json';
  const configFile = path.resolve(__dirname, configFilePath);
  config = JSON.parse(fs.readFileSync(configFile));
  if (!(Array.isArray(config.files) && config.files.length)) {
    throw new Error('Missing files list');
  }
  if (!(config.output && config.output.file)) {
    throw new Error('Missing output file path');
  }
  const hashes = {};
  config.files.forEach(fileObj => {
    if (typeof fileObj === 'object') {
      if (!fileObj.file) {
        return;
      }
      const file = fs.readFileSync(fileObj.file);
      if (fileObj.name) {
        hashes[fileObj.name] = fileMD5(file);
      } else {
        const fileInfo = path.parse(fileObj.file);
        hashes[fileInfo.name] = fileMD5(file);
      }
    } else if (typeof fileObj === 'string') {
      const fileInfo = path.parse(fileObj);
      const file = fs.readFileSync(fileObj);
      hashes[fileInfo.name] = fileMD5(file);
    }
  });
  const fileContent = `module.exports = ${util.inspect(hashes)};`;
  fs.writeFileSync(config.output.file, fileContent);
}

module.exports = genHash;

if (require.main === module) {
  genHash();
}

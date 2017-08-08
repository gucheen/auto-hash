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

function cpFilePath(filePath, hash) {
  const pathObj = path.parse(filePath);
  if (pathObj.base) {
    const base = pathObj.base.split('.');
    base.splice(-1, 0, hash);
    pathObj.base = base.join('.');
  } else {
    pathObj.name += `.${hash}`;
  }
  return path.format(pathObj);
}

function renameFile(filePath, hash) {
  const newPath = cpFilePath(filePath, hash);
  fs.renameSync(filePath, newPath);
}

function copyFile(filePath, hash) {
  const newPath = cpFilePath(filePath, hash);
  fs.createReadStream(filePath).pipe(fs.createWriteStream(newPath));
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
    let filePath;
    let fileHash;
    if (typeof fileObj === 'object') {
      if (!fileObj.file) {
        return;
      }
      filePath = fileObj.file;
      const file = fs.readFileSync(filePath);
      fileHash = fileMD5(file);
      if (fileObj.name) {
        hashes[fileObj.name] = fileHash;
      } else {
        const fileInfo = path.parse(filePath);
        hashes[fileInfo.name] = fileHash;
      }
    } else if (typeof fileObj === 'string') {
      filePath = fileObj;
      const file = fs.readFileSync(filePath);
      fileHash = fileMD5(file);
      const fileInfo = path.parse(filePath);
      hashes[fileInfo.name] = fileHash;
    }
    if (config.rename) {
      renameFile(filePath, fileHash);
    } else if (config.copy) {
      copyFile(filePath, fileHash);
    }
  });
  const fileContent = `module.exports = ${util.inspect(hashes)};`;
  fs.writeFileSync(config.output.file, fileContent);
}

module.exports = genHash;

if (require.main === module) {
  genHash();
}

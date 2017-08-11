const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const util = require('util');

const workingDir = process.cwd();
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

function loadConfig(configPath) {
  config = JSON.parse(fs.readFileSync(path.resolve(workingDir, configPath)));
}

function genHash(argv) {
  if (argv.c || argv.config) {
    const configFilePath = argv.c || argv.config;
    loadConfig(configFilePath);
  } else if (Array.isArray(argv.files)) {
    config = argv;
  } else {
    loadConfig('./auto-hash.config.json');
  }
  if (!(Array.isArray(config.files) && config.files.length)) {
    throw new Error('Missing file list');
  }
  const hashes = {};
  config.files.forEach(fileObj => {
    let filePath;
    let fileHash;
    if (typeof fileObj === 'object') {
      if (!fileObj.file) {
        return;
      }
      filePath = path.resolve(workingDir, fileObj.file);
      const file = fs.readFileSync(filePath);
      fileHash = fileMD5(file);
      if (fileObj.name) {
        hashes[fileObj.name] = fileHash;
      } else {
        const fileInfo = path.parse(filePath);
        hashes[fileInfo.name] = fileHash;
      }
    } else if (typeof fileObj === 'string') {
      filePath = path.resolve(workingDir, fileObj);
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
  if (config.output && config.output.file) {
    const fileContent = `module.exports = ${util.inspect(hashes)};`;
    fs.writeFileSync(config.output.file, fileContent);
  }
  return hashes;
}

module.exports = genHash;

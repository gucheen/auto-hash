# auto-hash

[![npm](https://img.shields.io/npm/v/auto-hash.svg?style=flat-square)](https://www.npmjs.com/package/auto-hash)
[![README_CHINESE](https://img.shields.io/badge/README-%E4%B8%AD%E6%96%87-blue.svg)](README.zh_CN.md)
[![Coverage Status](https://coveralls.io/repos/github/gucheen/auto-hash/badge.svg?branch=master)](https://coveralls.io/github/gucheen/auto-hash?branch=master)


automatically create hash info for files

## Version 1.0

auto-hash export an asynchronous function now. Asynchronously file reading and writing should be more useful in real projects.

## Features

- automatically generate MD5 for all files in list
- output all heshes as an Object to the target file
- add hash value to filename originalFilename.hash.ext（rename or create a copy of the original file）

## Install

```
npm install auto-hash
```

## Usage

### run as Node.js script directly

```js
autohash -c auto-hash.config.json
// add -c or -config to set configuration file
```

### import autoHash as a module

```js
const autoHash = require('auto-hash');
const result = await autoHash({
  config: './auto-hash.config.json',
});
// add 'c' or 'config' to set configuration file
// or you can pass configuration directly
await autoHash({
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
})
.then(anotherResult => {
  
})
```

### output example

- return as an object in Promise when call `autoHash()`
```js
// in Promise
{ testIndex: '5745abcc' }
```

- output as a file when `output.file` is provided (the object will still be returned in `autoHash()`)
```js
module.exports = { testIndex: '5745abcc' };
```

## About file path

**! All file paths shoud be relative to working directory**

## Configuration example

configuration file is in `.json`

```
{
  // 'files' is the list that contains all files to be hashing
  "files": [
    {
      "file": "src/index.js", // (required) set file path in 'file' property
      "name": "index" // (optional) set 'name' property to change the property of hash in output object, default to filename
    }
  ],
  "output": {
    "file": "src/auto-hash.js" // (optional) path of output file
  },
  "len": 10, // (optional) the length of hash string to be used, default to full string.
  "rename": false, // (optional, false) rename the original file to originalFilename.hash.ext
  "copy": true // (optional, false) create a copy in originalFilename.hash.ext
}
```

## LICENSE

MIT License

Copyright (c) 2023 Cheng Gu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


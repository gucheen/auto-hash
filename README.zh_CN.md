# auto-hash

[![npm](https://img.shields.io/npm/v/auto-hash.svg?style=flat-square)](https://www.npmjs.com/package/auto-hash)
[![README_EN](https://img.shields.io/badge/README-EN-blue.svg)](README.md)
[![Coverage Status](https://coveralls.io/repos/github/gucheen/auto-hash/badge.svg?branch=master)](https://coveralls.io/github/gucheen/auto-hash?branch=master)

自动计算文件 hash 值

## Version 1.0

auto-hash 现在提供一个异步的方法，异步的文件读取和写入在真实项目中会更有用。

## Features

- 自动计算列表中文件的 MD5 值
- 输出结果到指定文件
- 附加 hash 到文件名中 originalFilename.hash.ext（重命名原文件或者创建一个新的副本）

## Install

```
npm install auto-hash
```

## Usage

### 作为 Node.js 脚本直接调用

```js
autohash -c auto-hash.config.json
// 指定配置文件的参数可以是 -c 或者 -config
```

### 作为模块引入调用

```js
const autoHash = require('auto-hash');
const result = await autoHash({
  config: './auto-hash.config.json',
});
// 指定配置文件的参数名可以是 c 或者 config
// 或者你也可以直接传递 config 配置对象
autoHash({
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

### 输出样例

- 当调用 `autoHash()` 时，会异步返回包含 hash 信息的对象
```js
// in Promise
{ testIndex: '5745abcc' }
```

- 当设置了 `output.file` 时，会输出到这个文件中（如果是调用 autoHash() 的方式，一样会返回 hash 对象）
```js
module.exports = { testIndex: '5745abcc' };
```

## 关于文件路径

**! 注意，所有的文件路径都应该是相对于当前工作目录**

## 配置说明

配置文件格式为 `.json`

```
{
  // files 是需要进行 hash 计算的文件列表
  "files": [
    {
      "file": "src/index.js", // file 属性设置相对位置(必须)
      "name": "index" // name 属性设置输出对象中对应的属性名（默认文件名，可选）
    }
  ],
  "output": {
    "file": "src/auto-hash.js" // 输出文件（可选）
  },
  "len": 10, // hash 取值长度，默认全部（可选）
  "rename": false, // 重命名原文件，把 hash 附加到文件名中 originalFilename.hash.ext (可选，默认为 false)
  "copy": true // 创建一个原文件的拷贝，把 hash 附加到文件名中 originalFilename.hash.ext (可选，默认为 false)
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


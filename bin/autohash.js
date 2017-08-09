#!/usr/bin/env node
const autoHash = require('../index');

const argv = require('minimist')(process.argv.slice(2));

autoHash({
  config: argv.c || argv.config,
});

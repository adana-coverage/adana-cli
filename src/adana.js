#!/usr/bin/env node

/* eslint no-console: 0 */

import yargs from 'yargs';
import bl from 'bl';
import { createReadStream } from 'fs';
import resolve from 'resolve';

function _formatter(name) {
  const module = require(resolve.sync(name, {
    basedir: process.cwd(),
  }));
  if (module.__esModule && module.default) {
    return module.default;
  }
  return module;
}

function formatter(name) {
  try {
    return _formatter(`adana-format-${name}`);
  } catch (err) {
    return _formatter(name);
  }
}

function read({ file }, cb) {
  const stream = file === '-' ? process.stdin : createReadStream(file);
  stream.pipe(bl((err, input) => {
    // Bail if input fails.
    let data;
    if (err) {
      cb(err);
      return;
    }
    try {
      data = JSON.parse(input.toString('utf8'));
    } catch (err) {
      cb(err);
      return;
    }
    cb(null, data);
  }));
}

const argv = yargs
  .option('file', {
    alias: 'f',
    describe: 'path to coverage data file or `-` for stdin',
    default: '-',
    type: 'string',
  })
  .option('format', {
    alias: 'F',
    describe: 'name of formatter module',
    default: 'pretty',
    type: 'string',
  })
  .help('help')
  .argv;

const format = formatter(argv.format);
read(argv, (err, coverage) => {
  if (err) {
    throw err;
  }
  console.log(format(coverage, argv));
});

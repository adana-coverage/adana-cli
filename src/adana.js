#!/usr/bin/env node

import yargs from 'yargs';
import { readFileSync } from 'fs';
import chalk from 'chalk';
import frame from 'babel-code-frame';

const argv = yargs
  .option('check', {
    alias: 'c',
    describe: 'output failure exit code if coverage requirements not met',
    default: false,
    type: 'boolean',
  })
  .option('file', {
    alias: 'f',
    describe: 'path to coverage data file or `-` for stdin',
    default: './coverage/coverage.json',
    type: 'string',
  })
  .option('require', {
    alias: 'r',
    describe: 'minimum coverage threshold for a tag',
    default: 70,
    nargs: 2,
    type: 'number',
  })
  .argv;

const colors = {
  ignored: chalk.dim,
  failed: chalk.red,
  optimal: chalk.green,
};
const data = JSON.parse(readFileSync(argv.file));
const files = Object.keys(data);

let failed = false;

files.forEach(file => {
  const coverage = files[file];
  const code = readFileSync(file, 'utf8');

  frame(code, loc.line, loc.column, { highlightCode: true });
});


if (failed && argv.check) {
  throw new Error('Coverage requirements not met.');
}

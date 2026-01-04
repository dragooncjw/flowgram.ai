/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

const path = require('path');

const { main } = require('./package.json');

const { defineFlatConfig } = require(path.resolve(__dirname, main));

module.exports = defineFlatConfig({
  packageRoot: __dirname,
  preset: 'node',
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignore: [
    'node_modules',
    'dist',
    'package.json',
    '.rush'
  ]
});

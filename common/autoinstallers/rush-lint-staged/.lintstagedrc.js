/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

const { excludeIgnoredFiles } = require('./utils');
const micromatch = require('micromatch');
const path = require('path');
const fs = require('fs');

module.exports = {
  '**/*.{ts,tsx,js,jsx,mjs}': async files => {
    const match = micromatch.not(files, [
      '**/common/_templates/!(_*)/**/(.)?*',
      '**/apps/plugin-llms/**'
    ]);
    const filesToLint = await excludeIgnoredFiles(match);
    return [
      `eslint --fix --cache ${filesToLint} --no-error-on-unmatched-pattern`,
    ];
  },
  '**/package.json': async files => {
    const match = micromatch.not(files, [
      '**/common/_templates/!(_*)/**/(.)?*',
      '**/plugin-llms/*'
    ]);
    const filesToLint = await excludeIgnoredFiles(match);
    return [`eslint --cache ${filesToLint}`];
  },
};

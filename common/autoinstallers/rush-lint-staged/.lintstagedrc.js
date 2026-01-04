/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

const { excludeIgnoredFiles } = require('./utils');
const micromatch = require('micromatch');

const ESLINT_FLAGS = '--no-error-on-unmatched-pattern';

module.exports = {
  // 所有类型文件都加 license header
  '**/*.{js,ts,tsx,jsx,mjs,cjs,scss,less,css,sh}': async files => {
    if (!files.length) return [];
    return [
      'rush license-header',
      `git add ${files.join(' ')}`,
    ];
  },

  // JS / TS / JSX / TSX / MJS 文件 lint
  '**/*.{ts,tsx,js,jsx,mjs}': async files => {
    if (!files.length) return [];

    // 排除模板文件
    const match = micromatch.not(files, [
      '**/common/_templates/!(_*)/**/(.)?*',
    ]);

    // 使用 excludeIgnoredFiles 判断 ESLint ignore
    const filesToLint = await excludeIgnoredFiles(match);

    if (!filesToLint) return [];

    return [
      `eslint --fix --cache ${filesToLint} ${ESLINT_FLAGS}`,
    ];
  },

  // package.json 单独 lint
  '**/package.json': async files => {
    if (!files.length) return [];

    const match = micromatch.not(files, [
      '**/common/_templates/!(_*)/**/(.)?*',
    ]);

    const filesToLint = await excludeIgnoredFiles(match);

    if (!filesToLint) return [];

    return [
      `eslint --cache ${filesToLint} ${ESLINT_FLAGS}`,
    ];
  },
};

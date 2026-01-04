/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

const baseConfig = require('./eslint.base.config.js');

module.exports = {
  ignorePatterns: baseConfig.ignorePatterns || [],

  globals: {
    NodeJS: true,
  },

  settings: {
    ...(baseConfig.settings || {}),
  },

  rules: {
    ...(baseConfig.rules || {}),
  },

  overrides: [
    {
      files: ['**/*.js', '**/*.ts'],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    ...(baseConfig.overrides || []),
  ],
};

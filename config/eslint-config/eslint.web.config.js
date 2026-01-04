/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

const baseConfig = require('./eslint.base.config.js');

module.exports = {
  ignorePatterns: baseConfig.ignorePatterns || [],

  globals: {
    React: true,
    jsdom: true,
    JSX: true,
  },

  settings: {
    ...(baseConfig.settings || {}),
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },

  rules: {
    ...(baseConfig.rules || {}),
    'import/no-cycle': 'off',
  },

  overrides: baseConfig.overrides || [],
};

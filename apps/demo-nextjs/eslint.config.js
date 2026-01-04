/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

const { defineFlatConfig } = require('@flowgram.ai/eslint-config');

module.exports = defineFlatConfig({
  preset: 'web',
  packageRoot: __dirname,
  ignore: ['eslint.config.js'],
  rules: {
    'no-console': 'off',
    'react/prop-types': 'off',
  },
  plugins: [],
  settings: {
    react: {
      version: 'detect',
    },
  },
});

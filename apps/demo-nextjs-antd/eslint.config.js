/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

const { defineFlatConfig } = require('@flowgram.ai/eslint-config');

module.exports = defineFlatConfig({
  preset: 'web',
  packageRoot: __dirname,
  ignore: ['eslint.config.js', 'src/editor/plugins/context-menu-plugin/context-menu-layer.tsx'],
  rules: {
    'no-console': 'off',
    'react/prop-types': 'off',
    'react-hooks/exhaustive-deps': 'off',
    '@next/next/no-img-element': 'off',
    'jsx-a11y/alt-text': 'off',
  },
  plugins: [],
  settings: {
    react: {
      version: 'detect',
    },
  },
});

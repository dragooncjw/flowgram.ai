/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { defineFlatConfig } from '@flowgram.ai/eslint-config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineFlatConfig({
  parser: '@typescript-eslint/parser',
  preset: 'node',
  packageRoot: __dirname,
  ignore: ['.eslintrc.cjs'],
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
  },
  rules: {
    'no-console': 'off',
  },
  plugins: ['json', '@typescript-eslint'],
  settings: {
    react: {
      version: '18',
    },
  },
});

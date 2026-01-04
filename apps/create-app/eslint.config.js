/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { defineFlatConfig } from '@flowgram.ai/eslint-config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineFlatConfig({
  preset: 'node',
  packageRoot: __dirname,
  ignore: [
    '**/*.d.ts',
    '**/__mocks__',
    '**/node_modules',
    '**/build',
    '**/dist',
    '**/es',
    '**/lib',
    '**/.codebase',
    '**/.changeset',
    '**/config',
    '**/common/scripts',
    '**/output',
    'error-log-str.js',
    '*.bundle.js',
    '*.min.js',
    '*.js.map',
    '**/*.log',
    '**/tsconfig.tsbuildinfo',
    '**/vitest.config.ts',
    'package.json',
    '*.json',
  ],
  rules: {
    'no-console': 'off',
    'import/prefer-default-export': 'off',
    'lines-between-class-members': 'warn',
    'no-unused-vars': 'off',
    'no-redeclare': 'off',
    'no-empty-function': 'off',
    'prefer-destructuring': 'off',
    'no-underscore-dangle': 'off',
    'no-multi-assign': 'off',
    'arrow-body-style': 'warn',
    'no-useless-constructor': 'off',
    'no-param-reassign': 'off',
    'max-classes-per-file': 'off',
    'grouped-accessor-pairs': 'off',
    'no-plusplus': 'off',
    'no-restricted-syntax': 'off',
    'import/extensions': 'off',
    'consistent-return': 'off',
    'no-use-before-define': 'off',
    'no-bitwise': 'off',
    'no-case-declarations': 'off',
    'no-dupe-class-members': 'off',
    'class-methods-use-this': 'off',
    'default-param-last': 'off',
  },
});

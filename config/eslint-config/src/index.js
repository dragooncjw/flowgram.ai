/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

const { FlatCompat } = require('@eslint/eslintrc');

const { defineConfig } = require('./defineConfig.js');
const { defineFlatConfig } = require('./defineFlatConfig.js');

module.exports = { defineConfig, defineFlatConfig, FlatCompat };

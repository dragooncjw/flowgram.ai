/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

const baseConfig = require('./.eslintrc.base.js');

module.exports = {
  ignorePatterns: baseConfig.ignorePatterns || [],
  globals: {
    NodeJS: true,
  },
  settings: baseConfig.settings || {},
  rules: baseConfig.rules || {},
  overrides: baseConfig.overrides || [],
};

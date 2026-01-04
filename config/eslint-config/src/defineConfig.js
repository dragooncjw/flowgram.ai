/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

const path = require('path')

function defineConfig(config) {
  const {
    packageRoot,
    preset,
    settings,
    extends: _extends = [],
    rules = {},
    ...userConfig
  } = config

  const defaultRules = {}

  return {
    extends: [path.resolve(__dirname, `../.eslintrc.${preset}.js`), ..._extends],
    settings: {
      ...settings,
      'import/resolver': {
        typescript: {
          project: packageRoot,
        },
      },
    },
    rules: {
      ...defaultRules,
      ...rules,
    },
    ...userConfig,
  }
}

module.exports = { defineConfig }

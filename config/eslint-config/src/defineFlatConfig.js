/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

const path = require('path');

function defineFlatConfig(config) {
  const { packageRoot, preset, settings = {}, rules = {}, ignore } = config;

  const basePreset = require(path.resolve(__dirname, `../eslint.${preset}.config.js`));

  let prettierPlugin;
  let reactPlugin;
  let a11yPlugin;
  let tsPlugin;
  let importPlugin;
  let tsParser;

  try {
    const requireFromCwd = require('module').createRequire(process.cwd() + '/');
    prettierPlugin = requireFromCwd('eslint-plugin-prettier');
  } catch (e1) {
    try {
      prettierPlugin = require('eslint-plugin-prettier');
    } catch (e2) {
      prettierPlugin = undefined;
    }
  }

  try {
    reactPlugin = require('eslint-plugin-react');
  } catch (e) {
    reactPlugin = undefined;
  }
  try {
    a11yPlugin = require('eslint-plugin-jsx-a11y');
  } catch (e) {
    a11yPlugin = undefined;
  }
  try {
    tsPlugin = require('@typescript-eslint/eslint-plugin');
  } catch (e) {
    tsPlugin = undefined;
  }
  try {
    importPlugin = require('eslint-plugin-import');
  } catch (e) {
    importPlugin = undefined;
  }
  try {
    tsParser = require('@typescript-eslint/parser');
  } catch (e) {
    tsParser = undefined;
  }

  const ignorePatterns = basePreset.ignorePatterns || [];

  const flatConfig = [];

  if (ignore && Array.isArray(ignore) && ignore.length > 0) {
    flatConfig.push({ ignores: ignore });
  } else if (typeof ignore === 'string' && ignore.length > 0) {
    flatConfig.push({ ignores: [ignore] });
  }

  if (ignorePatterns.length > 0) {
    flatConfig.push({ ignores: ignorePatterns });
  }

  const plugins = {};
  if (prettierPlugin) plugins.prettier = prettierPlugin;
  if (tsPlugin) plugins['@typescript-eslint'] = tsPlugin;
  if (importPlugin) plugins.import = importPlugin;
  if (reactPlugin) plugins.react = reactPlugin;
  if (a11yPlugin) plugins['jsx-a11y'] = a11yPlugin;

  const mergedSettings = {
    ...(basePreset.settings || {}),
    ...settings,
    'import/resolver': {
      ...(basePreset.settings?.['import/resolver'] || {}),
      ...(settings['import/resolver'] || {}),
      typescript: {
        project: packageRoot,
      },
    },
  };

  const mergedRules = {
    ...(basePreset.rules || {}),
    ...rules,
  };

  if (basePreset.overrides && basePreset.overrides.length > 0) {
    basePreset.overrides.forEach((override) => {
      const overrideConfig = {
        files: override.files || ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
      };

      if (tsParser) {
        overrideConfig.languageOptions = {
          parser: tsParser,
          parserOptions: override.parserOptions || {
            ecmaFeatures: {
              jsx: true,
            },
            ecmaVersion: 'latest',
            sourceType: 'module',
          },
        };
      }

      if (Object.keys(plugins).length > 0) {
        overrideConfig.plugins = plugins;
      }

      overrideConfig.settings = {
        ...mergedSettings,
        ...(override.settings || {}),
      };

      overrideConfig.rules = {
        ...mergedRules,
        ...(override.rules || {}),
      };

      flatConfig.push(overrideConfig);
    });
  } else {
    const mainConfig = {
      files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    };

    if (tsParser) {
      mainConfig.languageOptions = {
        parser: tsParser,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          ecmaVersion: 'latest',
          sourceType: 'module',
        },
      };
    }

    if (Object.keys(plugins).length > 0) {
      mainConfig.plugins = plugins;
    }

    mainConfig.settings = mergedSettings;
    mainConfig.rules = mergedRules;

    flatConfig.push(mainConfig);
  }

  return flatConfig;
}

module.exports = { defineFlatConfig };

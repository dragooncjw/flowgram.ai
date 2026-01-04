/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import path from 'path';
import { FlatCompat } from '@eslint/eslintrc';
import type { ESLintConfig, Rules } from 'eslint-define-config';

type ESLintConfigMode = 'web' | 'node' | 'base';

export interface EnhanceESLintConfig extends ESLintConfig {
  packageRoot?: string;
  preset: ESLintConfigMode;
  ignore?: string | string[];
}

/**
 * 定义 ESLint v9 Flat Config
 */
export const defineFlatConfig = (config: EnhanceESLintConfig): any[] => {
  const { packageRoot, preset, settings = {}, rules = {}, ignore } = config;

  // 兼容旧式 eslintrc
  const basePresetPath = path.resolve(__dirname, `../.eslintrc.${preset}.js`);
  const compat = new FlatCompat({ baseDirectory: path.dirname(basePresetPath) });
  const basePreset = require(basePresetPath);

  const flatConfig: any[] = [];

  // 合并 ignore
  const mergedIgnore = [
    ...(Array.isArray(ignore) ? ignore : typeof ignore === 'string' ? [ignore] : []),
    ...(basePreset.ignorePatterns || []),
  ];
  if (mergedIgnore.length > 0) {
    flatConfig.push({ ignores: mergedIgnore });
  }

  // 扩展旧 eslintrc
  flatConfig.push(...compat.extends(basePresetPath));

  // 合并 settings & rules
  const mergedSettings: Record<string, any> = {
    ...(basePreset.settings || {}),
    ...(settings as Record<string, any>),
    'import/resolver': {
      ...(basePreset.settings?.['import/resolver'] || {}),
      ...((settings as Record<string, any>)['import/resolver'] || {}),
      typescript: { project: packageRoot },
    },
  };
  const mergedRules = { ...(basePreset.rules || {}), ...(rules as Rules) };

  // 如果有 overrides，保留 override 自己的 rules/settings
  if (basePreset.overrides && basePreset.overrides.length > 0) {
    basePreset.overrides.forEach((override: any) => {
      const overrideConfig: any = {
        files: override.files || ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        rules: { ...mergedRules, ...(override.rules || {}) },
        settings: { ...mergedSettings, ...(override.settings || {}) },
      };

      if (override.parser || override.parserOptions) {
        overrideConfig.languageOptions = {
          parser: require('@typescript-eslint/parser'),
          parserOptions: override.parserOptions || {
            ecmaFeatures: { jsx: true },
            ecmaVersion: 'latest',
            sourceType: 'module',
          },
        };
      }

      flatConfig.push(overrideConfig);
    });
  } else {
    const mainConfig: any = {
      files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
      rules: mergedRules,
      settings: mergedSettings,
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        parserOptions: { ecmaFeatures: { jsx: true }, ecmaVersion: 'latest', sourceType: 'module' },
      },
    };
    flatConfig.push(mainConfig);
  }

  return flatConfig;
};

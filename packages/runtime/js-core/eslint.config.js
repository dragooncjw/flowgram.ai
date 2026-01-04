/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { defineFlatConfig } from '@flowgram.ai/eslint-config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineFlatConfig({
  preset: 'base',
  packageRoot: __dirname,
});

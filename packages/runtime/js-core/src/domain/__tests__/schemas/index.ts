/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { twoLLMSchema } from './two-llm';
import { loopSchema } from './loop';
import { branchSchema } from './branch';
import { basicLLMSchema } from './basic-llm';
import { basicSchema } from './basic';

export const TestSchemas = {
  twoLLMSchema,
  basicSchema,
  branchSchema,
  basicLLMSchema,
  loopSchema,
};

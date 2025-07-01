/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { WorkflowSchema } from '@schema/index';

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

export interface IValidation {
  validate(schema: WorkflowSchema): ValidationResult;
}

export const IValidation = Symbol.for('Validation');

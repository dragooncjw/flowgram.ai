/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

export enum FlowGramNode {
  Root = 'root',
  Start = 'start',
  End = 'end',
  LLM = 'llm',
  code = 'code',
  Condition = 'condition',
  Loop = 'loop',
  Comment = 'comment',
  Group = 'group',
}

/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { FlowNodeEntity } from '@flowgram.ai/document';

import { type ScopeChainNode } from './types';
import { IScopeTransformer } from './services/scope-chain-transform-service';

export interface VariableLayoutConfig {
  /**
   * 节点的子节点输出变量，不能被后续节点所访问，用于固定布局场景
   * @param node
   * @returns
   */
  isNodeChildrenPrivate?: (node: ScopeChainNode) => boolean;

  /**
   * 用于固定布局场景时：父子中间存在大量无用节点（如 inlineBlocks 等，需要配置化略过）
   * 用于自由画布场景时：部分场景通过连线或者其他交互形式来表达节点之间的父子关系，需可配置化
   */
  getNodeChildren?: (node: FlowNodeEntity) => FlowNodeEntity[];
  getNodeParent?: (node: FlowNodeEntity) => FlowNodeEntity | undefined;

  /**
   * 对依赖作用域进行微调
   */
  transformDeps?: IScopeTransformer;

  /**
   * 对依赖作用域进行微调
   */
  transformCovers?: IScopeTransformer;
}

export const VariableLayoutConfig = Symbol('VariableLayoutConfig');

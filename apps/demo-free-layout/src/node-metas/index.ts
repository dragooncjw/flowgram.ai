import { WorkflowNodeRegistry } from '@flowgram.ai/free-layout-editor';

import { StartNodeRegistry } from './start';
import { LoopNodeRegistry } from './loop';
import { ErrorNodeRegistry } from './error';
import { EndNodeRegistry } from './end';
import { ConditionNodeRegistry } from './condition';

export const nodeRegistries: WorkflowNodeRegistry[] = [
  ConditionNodeRegistry,
  StartNodeRegistry,
  EndNodeRegistry,
  ErrorNodeRegistry,
  LoopNodeRegistry,
];

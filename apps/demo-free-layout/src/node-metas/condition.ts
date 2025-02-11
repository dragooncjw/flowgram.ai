import { WorkflowNodeRegistry } from '@flowgram.ai/free-layout-editor';

import { CommonFormMeta } from './common-form-meta';

export const ConditionNodeRegistry: WorkflowNodeRegistry = {
  type: 'condition',
  meta: {
    defaultPorts: [{ type: 'input' }],
    renderKey: 'condition-render',
    useDynamicPort: true,
  },
  formMeta: CommonFormMeta,
};

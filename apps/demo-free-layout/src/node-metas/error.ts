import { WorkflowNodeRegistry } from '@flowgram.ai/free-layout-editor';

import { CommonFormMeta } from './common-form-meta';

export const ErrorNodeRegistry: WorkflowNodeRegistry = {
  type: 'error',
  meta: {
    defaultPorts: [{ type: 'input' }],
    renderKey: 'error-render',
    useDynamicPort: true,
  },
  formMeta: CommonFormMeta,
};

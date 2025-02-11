import { WorkflowNodeRegistry } from '@flowgram.ai/free-layout-editor';

import { CommonFormMeta } from './common-form-meta';

export const StartNodeRegistry: WorkflowNodeRegistry = {
  type: 'start',
  meta: {
    isStart: true,
    deleteDisable: true,
    copyDisable: true,
    defaultPorts: [{ type: 'output' }],
  },
  formMeta: CommonFormMeta,
};

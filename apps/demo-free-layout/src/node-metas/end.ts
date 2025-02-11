import { WorkflowNodeRegistry } from '@flowgram.ai/free-layout-editor';

import { CommonFormMeta } from './common-form-meta';

export const EndNodeRegistry: WorkflowNodeRegistry = {
  type: 'end',
  meta: {
    deleteDisable: true,
    copyDisable: true,
    defaultPorts: [{ type: 'input' }],
  },
  formMeta: CommonFormMeta,
};

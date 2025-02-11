import {
  WorkflowNodeRegistry,
  WorkflowSubCanvas,
  WorkflowNodeEntity,
  WorkflowNodeJSON,
} from '@flowgram.ai/free-layout-editor';

import { formMeta } from './loop-form';
import { createLoopFunction, getLoopFunctionID } from './create-loop-function';

export const LoopNodeRegistry: WorkflowNodeRegistry = {
  type: 'loop',
  meta: {
    useDynamicPort: true,
    size: { width: 300, height: 209 },
    defaultPorts: [
      { type: 'input' },
      { type: 'output', portID: 'loop-output' },
      { type: 'output', portID: 'loop-output-to-function', disabled: true },
    ],
    subCanvas: (node: WorkflowNodeEntity): WorkflowSubCanvas | undefined => {
      const parentNode = node;
      const canvasNodeID = getLoopFunctionID(parentNode.id);
      const canvasNode = node.document.getNode(canvasNodeID);
      if (!canvasNode) {
        return undefined;
      }
      const subCanvas: WorkflowSubCanvas = {
        isCanvas: false,
        parentNode,
        canvasNode,
      };
      return subCanvas;
    },
  },
  formMeta,
  onCreate: (node, json) => {
    createLoopFunction(node, json as WorkflowNodeJSON);
  },
};

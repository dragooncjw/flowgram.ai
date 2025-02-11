import {
  PaddingSchema,
  FlowNodeTransformData,
  FlowNodeEntity,
  PositionSchema,
  WorkflowSubCanvas,
  WorkflowNodeEntity,
  FlowRendererKey,
  FlowNodeBaseType,
  WorkflowNodeJSON,
  IPoint,
} from '@flowgram.ai/free-layout-editor';

import { getLoopID } from './create-loop-function';

export const createLoopFunctionNodeJSON = (id: string, position: IPoint): WorkflowNodeJSON => ({
  id,
  type: FlowNodeBaseType.SUB_CANVAS,
  meta: {
    position,
    useDynamicPort: true,
    renderKey: FlowRendererKey.SUB_CANVAS,
    defaultPorts: [
      { type: 'input', portID: 'loop-function-input', disabled: true },
      { type: 'input', portID: 'loop-function-inline-input' },
      { type: 'output', portID: 'loop-function-inline-output' },
    ],
    padding: (transform: FlowNodeTransformData): PaddingSchema => ({
      top: 100,
      bottom: 100,
      left: 100,
      right: 100,
    }),
    selectable(node: FlowNodeEntity, mousePos?: PositionSchema): boolean {
      if (!mousePos) {
        return true;
      }
      const transform = node.getData<FlowNodeTransformData>(FlowNodeTransformData);
      // start when not include current node
      return !transform.bounds.contains(mousePos.x, mousePos.y);
    },
    renderSubCanvas: () => ({
      title: 'LoopFunction',
      renderPorts: [
        {
          id: 'loop-function-input',
          type: 'input',
          style: {
            position: 'absolute',
            left: '50%',
            top: '0',
          },
        },
        {
          id: 'loop-function-inline-input',
          type: 'input',
          style: {
            position: 'absolute',
            right: '0',
            top: '50%',
          },
        },
        {
          id: 'loop-function-inline-output',
          type: 'output',
          style: {
            position: 'absolute',
            left: '0',
            top: '50%',
          },
        },
      ],
    }),
    subCanvas: (node: WorkflowNodeEntity): WorkflowSubCanvas | undefined => {
      const canvasNode = node;
      const parentNodeID = getLoopID(canvasNode.id);
      const parentNode = node.document.getNode(parentNodeID);
      if (!parentNode) {
        return undefined;
      }
      const subCanvas: WorkflowSubCanvas = {
        isCanvas: true,
        parentNode,
        canvasNode,
      };
      return subCanvas;
    },
  },
});

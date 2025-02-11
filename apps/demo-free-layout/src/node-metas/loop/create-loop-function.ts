import {
  delay,
  IPoint,
  WorkflowDocument,
  WorkflowNodeEntity,
  WorkflowNodeJSON,
} from '@flowgram.ai/free-layout-editor';

import { createLoopFunctionNodeJSON } from './loop-function-json';

const LoopFunctionIDPrefix = 'LoopFunction_';
export const getLoopFunctionID = (loopID: string) => LoopFunctionIDPrefix + loopID;
export const getLoopID = (loopFunctionID: string) =>
  loopFunctionID.replace(LoopFunctionIDPrefix, '');

const createLoopFunctionLines = async (params: {
  document: WorkflowDocument;
  loopId: string;
  loopFunctionId: string;
}) => {
  await delay(30); // delay for node created
  const { document, loopId, loopFunctionId } = params;
  document.linesManager.createLine({
    from: loopId,
    to: loopFunctionId,
    fromPort: 'loop-output-to-function',
    toPort: 'loop-function-input',
  });
};

/** create Loop node */
export const createLoopFunction: any = async (
  loopNode: WorkflowNodeEntity,
  loopJson: WorkflowNodeJSON
) => {
  const document = loopNode.document as WorkflowDocument;
  const id = getLoopFunctionID(loopNode.id);
  const position: IPoint = {
    x: loopJson.meta?.position?.x || 0,
    y: (loopJson.meta?.position?.y || 0) + 300,
  };
  const loopFunctionJSON = createLoopFunctionNodeJSON(id, position);
  const loopFunctionNode = await document.createWorkflowNode(loopFunctionJSON);
  createLoopFunctionLines({
    document,
    loopId: loopNode.id,
    loopFunctionId: id,
  });
  return loopFunctionNode;
};

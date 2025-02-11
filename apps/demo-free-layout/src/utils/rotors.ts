import { FlowNodeEntity } from '@flowgram.ai/free-layout-editor';

export function getNodeTitle(node?: FlowNodeEntity) {
  return `${node?.flowNodeType}_${node?.index}`;
}

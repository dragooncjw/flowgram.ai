import { FlowNodeBaseType, type FlowNodeEntity } from '@flowgram.ai/free-layout-editor';

import iconStart from '../../assets/icon-start.jpg';
import iconEnd from '../../assets/icon-end.jpg';
import { Icon } from './styles';

export const getIcon = (node: FlowNodeEntity) => {
  if (node.flowNodeType === FlowNodeBaseType.START) {
    return <Icon src={iconStart} />;
  } else if (node.flowNodeType === FlowNodeBaseType.END) {
    return <Icon src={iconEnd} />;
  }
  return null;
};

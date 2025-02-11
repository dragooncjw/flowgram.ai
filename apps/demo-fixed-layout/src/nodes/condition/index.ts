import { nanoid } from 'nanoid';
import { FlowNodeSplitType } from '@flowgram.ai/fixed-layout-editor';

import { FlowNodeRegistry } from '../../typings';
import { CustomNodeType } from '../../typings';
import iconCondition from '../../assets/icon-condition.svg';

export const ConditionNodeRegistry: FlowNodeRegistry = {
  extend: FlowNodeSplitType.DYNAMIC_SPLIT,
  type: CustomNodeType.CONDITION,
  definition: {
    info: {
      icon: iconCondition,
      description:
        'Connect multiple downstream branches. Only the corresponding branch will be executed if the set conditions are met.',
    },
  },
  onAdd() {
    return {
      id: `condition_${nanoid()}`,
      type: 'condition',
      data: {
        title: 'Condition',
      },
      blocks: [
        {
          id: nanoid(5),
          data: {
            title: 'Branch',
          },
        },
        {
          id: nanoid(5),
          data: {
            title: 'Branch',
          },
        },
      ],
    };
  },
};

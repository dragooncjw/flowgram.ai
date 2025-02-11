import { FlowNodeRegistry } from '../../typings';
import iconIf from '../../assets/icon-if.png';

export const BlockNodeRegistry: FlowNodeRegistry = {
  type: 'block',
  definition: {
    info: {
      icon: iconIf,
      description: 'Execute the branch when the condition is met.',
    },
    inputs: {
      type: 'object',
      required: ['condition'],
      properties: {
        condition: {
          type: 'string',
        },
      },
    },
  },
  canAdd: () => false,
};

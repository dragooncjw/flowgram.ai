import { nanoid } from 'nanoid';

import { FlowNodeRegistry } from '../../typings';
import { CustomNodeType } from '../../typings';
import iconLLM from '../../assets/icon-llm.jpg';

export const LLMNodeRegistry: FlowNodeRegistry = {
  type: CustomNodeType.LLM,
  definition: {
    info: {
      icon: iconLLM,
      description:
        'Call the large language model and use variables and prompt words to generate responses.',
    },
    inputs: {
      type: 'object',
      required: ['modelType', 'temperature', 'prompt'],
      properties: {
        modelType: {
          type: 'string',
        },
        temperature: {
          type: 'number',
        },
        systemPrompt: {
          type: 'string',
        },
        prompt: {
          type: 'string',
        },
      },
    },
    outputs: {
      type: 'object',
      properties: {
        result: { type: 'string' },
      },
    },
  },
  onAdd() {
    return {
      id: `llm_${nanoid()}`,
      type: 'llm',
      data: {
        title: 'LLM',
        values: {},
        outputs: {
          type: 'object',
          title: 'llm-outputs',
          properties: {
            x: {
              type: 'string',
              title: 'x',
            },
          },
        },
      },
    };
  },
};

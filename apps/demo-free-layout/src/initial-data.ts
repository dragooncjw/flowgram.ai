import { FlowDocumentJSON } from './typings';

export const initialData: FlowDocumentJSON = {
  nodes: [
    {
      id: 'start_0',
      type: 'start',
      meta: {
        position: {
          x: 180,
          y: 313.25,
        },
      },
      data: {
        title: 'Start',
        outputs: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              default: 'Hello Flow.',
            },
          },
        },
      },
    },
    {
      id: 'condition_0',
      type: 'condition',
      meta: {
        position: {
          x: 640,
          y: 298.75,
        },
      },
      data: {
        title: 'Condition',
        inputsValues: {
          conditions: [
            {
              key: 'if_0',
              value: {
                type: 'expression',
                content: '',
              },
            },
            {
              key: 'if_f0rOAt',
              value: {
                type: 'expression',
                content: '',
              },
            },
          ],
        },
        inputs: {
          type: 'object',
          properties: {
            conditions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  key: {
                    type: 'string',
                  },
                  value: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      id: 'llm_0',
      type: 'llm',
      meta: {
        position: {
          x: 1430,
          y: 0,
        },
      },
      data: {
        title: 'LLM_0',
        inputsValues: {
          modelType: 'gpt-3.5-turbo',
          temperature: 0.5,
          systemPrompt: 'You are an AI assistant.',
          prompt: '',
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
            result: {
              type: 'string',
            },
          },
        },
      },
    },
    {
      id: 'end_0',
      type: 'end',
      meta: {
        position: {
          x: 2220,
          y: 313.25,
        },
      },
      data: {
        title: 'End',
        outputs: {
          type: 'object',
          properties: {
            result: {
              type: 'string',
            },
          },
        },
      },
    },
    {
      id: 'loop_H8M3U',
      type: 'loop',
      meta: {
        position: {
          x: 1020,
          y: 532.5,
        },
      },
      data: {
        title: 'Loop_2',
        inputsValues: {},
        inputs: {
          type: 'object',
          required: ['loopTimes'],
          properties: {
            loopTimes: {
              type: 'number',
            },
          },
        },
        outputs: {
          type: 'object',
          properties: {
            result: {
              type: 'string',
            },
          },
        },
      },
      blocks: [
        {
          id: 'llm_CBdCg',
          type: 'llm',
          meta: {
            position: {
              x: 180,
              y: 0,
            },
          },
          data: {
            title: 'LLM_4',
            inputsValues: {},
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
                result: {
                  type: 'string',
                },
              },
            },
          },
        },
        {
          id: 'llm_gZafu',
          type: 'llm',
          meta: {
            position: {
              x: 640,
              y: 0,
            },
          },
          data: {
            title: 'LLM_5',
            inputsValues: {},
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
                result: {
                  type: 'string',
                },
              },
            },
          },
        },
      ],
      edges: [
        {
          sourceNodeID: 'llm_CBdCg',
          targetNodeID: 'llm_gZafu',
        },
      ],
    },
  ],
  edges: [
    {
      sourceNodeID: 'start_0',
      targetNodeID: 'condition_0',
    },
    {
      sourceNodeID: 'condition_0',
      targetNodeID: 'llm_0',
      sourcePortID: 'if_0',
    },
    {
      sourceNodeID: 'condition_0',
      targetNodeID: 'loop_H8M3U',
      sourcePortID: 'if_f0rOAt',
    },
    {
      sourceNodeID: 'llm_0',
      targetNodeID: 'end_0',
    },
    {
      sourceNodeID: 'loop_H8M3U',
      targetNodeID: 'end_0',
    },
  ],
};

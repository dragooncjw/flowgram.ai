import { FlowDocumentJSON } from '@flowgram.ai/fixed-layout-editor';

export const initialData: FlowDocumentJSON = {
  nodes: [
    {
      id: 'start_0',
      type: 'start',
      blocks: [],
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
      id: 'llm_0',
      type: 'llm',
      blocks: [],
      data: {
        title: 'LLM',
        values: {
          modelType: 'gpt-3.5-turbo',
          temperature: 0.5,
          systemPrompt: 'You are an AI assistant.',
          prompt: 'Hello.',
        },
      },
    },
    {
      id: 'condition_0',
      type: 'condition',
      data: {
        title: 'Condition',
      },
      blocks: [
        {
          id: 'branch_0',
          type: 'block',
          data: {
            title: 'If_0',
          },
          blocks: [],
        },
        {
          id: 'branch_1',
          type: 'block',
          data: {
            title: 'If_1',
          },
          meta: {},
          blocks: [],
        },
      ],
    },
    {
      id: 'loop_0',
      type: 'loop',
      data: {
        title: 'Loop',
      },
    },
    {
      id: 'end_0',
      type: 'end',
      blocks: [],
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
  ],
};

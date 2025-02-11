import { WorkflowJSON } from '@flowgram.ai/free-layout-editor';

const basic: WorkflowJSON = {
  nodes: [
    {
      id: 'start_0',
      type: 'start',
      meta: {
        position: {
          x: 0,
          y: 0,
        },
      },
      data: {
        outputs: {
          type: 'object',
          title: 'start-outputs',
          properties: {
            a: {
              type: 'string',
              title: 'a',
            },
            b: {
              type: 'number',
              title: 'a',
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
          x: 500,
          y: 0,
        },
      },
    },
  ],
  edges: [],
};

export { basic };

import { createOutputFormItem } from './create-output-form-item';
import { createBatchFormItem } from './create-batch-form-item';

export const formMeta: any = {
  root: {
    name: 'root',
    type: 'object',
    children: [
      {
        name: 'nodeDescription',
        type: 'form-void',
        title: '',
        abilities: [
          {
            type: 'setter',
            options: {
              key: 'Text',
              text: 'loop node',
            },
          },
        ],
      },
      createBatchFormItem(),
      createOutputFormItem(),
      {
        name: 'portOutputToFunction',
        type: 'form-void',
        title: '',
        abilities: [
          {
            type: 'setter',
            options: {
              key: 'Port',
              portID: 'loop-output-to-function',
              portType: 'output',
              styles: {
                position: 'absolute',
                right: '50%',
                bottom: '0',
              },
            },
          },
        ],
      },
      {
        name: 'portOutput',
        type: 'form-void',
        title: '',
        abilities: [
          {
            type: 'setter',
            options: {
              key: 'Port',
              portID: 'loop-output',
              portType: 'output',
              styles: {
                position: 'absolute',
                right: '0',
                top: '50%',
              },
            },
          },
        ],
      },
    ],
  },
};

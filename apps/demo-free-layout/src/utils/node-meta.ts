import { IFormItemMeta, ValidatorProps } from '@flowgram.ai/form-core';

export function createVariableInputMeta(): IFormItemMeta {
  return {
    name: 'variable-inputs',
    type: 'array',
    title: 'variable-input',
    default: [{}],
    abilities: [
      {
        type: 'setter',
        options: {
          key: 'ArrayRenderRehaje',
        },
      },
      {
        type: 'decorator',
        options: {
          key: 'ArrayWrapperRehaje',
        },
      },
    ],
    items: {
      type: 'object',
      name: '',
      children: [
        {
          name: 'expression',
          type: 'string',
          abilities: [
            {
              type: 'setter',
              options: {
                key: 'Input',
              },
            },
            {
              type: 'decorator',
              options: {
                key: 'ArrayItemWrapperRehaje',
              },
            },
            {
              type: 'validation',
              options: {
                validator: ({ value, context }: ValidatorProps) => {
                  if (value !== 'a') {
                    return 'value should be a';
                  }
                },
              },
            },
          ],
        },
      ],
    },
  };
}

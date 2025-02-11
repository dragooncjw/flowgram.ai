import { IFormItemMeta } from '@flowgram.ai/form-core';

export const createOutputFormItem = (): IFormItemMeta => ({
  name: 'target',
  type: 'boolean',
  title: 'generate variable config',
  default: { meta: { name: 'loop_output_' }, type: 'Boolean' },
  required: true,
  abilities: [
    {
      type: 'setter',
      options: {
        key: 'VariableOutput',
      },
    },
    {
      type: 'variable-provider',
      options: {
        parse(v?: any) {
          if (!v) {
            return [];
          }
          return [v];
        },
      },
    },
    {
      type: 'decorator',
      options: {
        key: 'FormItem',
      },
    },
  ],
});

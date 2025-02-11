import { ASTKind } from '@flowgram.ai/free-layout-editor';
import { IFormItemMeta } from '@flowgram.ai/form-core';

export const createBatchFormItem = (): IFormItemMeta => ({
  name: 'batch',
  type: 'boolean',
  title: 'Loop Batch',
  required: true,
  abilities: [
    {
      type: 'setter',
      options: {
        key: 'VariableSelector',
      },
    },
    {
      type: 'variable-provider',
      options: {
        scope: 'private',
        parse(keyPath?: string[]) {
          if (!keyPath?.length) {
            return [];
          }
          return [
            {
              kind: ASTKind.VariableDeclaration,
              meta: {
                name: `Loop Item variable test`,
              },
              initializer: {
                kind: ASTKind.EnumerateExpression,
                enumerateFor: {
                  kind: ASTKind.KeyPathExpression,
                  keyPath,
                },
              },
            },
          ];
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

import {
  ASTKind,
  definePluginCreator,
  FlowDocument,
  FlowNodeVariableData,
  getNodeForm,
  PluginCreator,
} from '@flowgram.ai/fixed-layout-editor';

import { createASTFromJSONSchema } from './utils';

export interface VariablePluginOptions {}

export const createVariablePlugin: PluginCreator<VariablePluginOptions> =
  definePluginCreator<VariablePluginOptions>({
    onInit(ctx, options) {
      const flowDocument = ctx.get<FlowDocument>(FlowDocument);

      flowDocument.onNodeCreate(({ node }) => {
        const form = getNodeForm(node);
        const variableData = node.getData<FlowNodeVariableData>(FlowNodeVariableData);

        const syncOutputs = (value: any) => {
          if (!value) {
            variableData.public.ast.remove('outputs');
            return;
          }

          const typeAST = createASTFromJSONSchema(value);

          if (typeAST) {
            variableData.public.ast.set('outputs', {
              kind: ASTKind.VariableDeclaration,
              meta: {
                title: `${node.id}.outputs`,
              },
              key: `${node.id}.outputs`,
              type: typeAST,
            });
            return;
          } else {
            variableData.public.ast.remove('outputs');
          }
        };

        if (form) {
          // Listen outputs change
          syncOutputs(form.getValueIn('outputs'));
          form.onFormValuesChange((props) => {
            if (props.name === 'outputs') {
              syncOutputs(form.getValueIn('outputs'));
            }
          });
        }
      });
    },
  });

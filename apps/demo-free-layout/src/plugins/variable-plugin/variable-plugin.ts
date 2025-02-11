import {
  ASTKind,
  definePluginCreator,
  FlowNodeEntity,
  FlowNodeVariableData,
  getNodeForm,
  WorkflowDocument,
  PluginCreator,
} from '@flowgram.ai/free-layout-editor';

import { createASTFromJSONSchema } from './utils';

export interface VariablePluginOptions {}

export const createVariablePlugin: PluginCreator<VariablePluginOptions> =
  definePluginCreator<VariablePluginOptions>({
    onInit(ctx, options) {
      const flowDocument = ctx.get<WorkflowDocument>(WorkflowDocument);

      flowDocument.onNodeCreate(({ node }) => {
        const form = getNodeForm(node as FlowNodeEntity);
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

        syncOutputs(node.toJSON()?.data?.outputs);

        if (form) {
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

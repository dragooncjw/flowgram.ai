import { FormRenderProps, FormMeta, ValidateTrigger } from '@flowgram.ai/fixed-layout-editor';

import { FlowNodeJSON, FlowNodeRegistry } from '../typings';
import { FormHeader, FormContent, FormInputs, FormOutputs } from '../form-components';

export const renderForm = ({ form }: FormRenderProps<FlowNodeJSON>) => (
  <>
    <FormHeader />
    <FormContent>
      <FormInputs />
      <FormOutputs />
    </FormContent>
  </>
);

export const defaultFormMeta: FormMeta<FlowNodeJSON> = {
  render: renderForm,
  validateTrigger: ValidateTrigger.onChange,
  validate: {
    title: ({ value }) => (value ? undefined : 'Title is required'),
    'values.*': ({ value, context, name }) => {
      const valuePropetyKey = name.replace(/^values\./, '');
      const registry = context.node.getNodeRegistry<FlowNodeRegistry>();
      const required = registry.definition.inputs?.required || [];
      if (required.includes(valuePropetyKey) && (value === '' || value === undefined)) {
        return `${valuePropetyKey} is required`;
      }
      return undefined;
    },
  },
};

import { useContext } from 'react';

import { Field } from '@flowgram.ai/fixed-layout-editor';
import { Input } from '@douyinfe/semi-ui';

import { FormItem } from '../form-item';
import { Feedback } from '../feedback';
import { FlowNodeRegistry } from '../../typings';
import { NodeRenderContext } from '../../context';

export function FormInputs() {
  const { expanded, node, readonly } = useContext(NodeRenderContext);
  const registry = node.getNodeRegistry<FlowNodeRegistry>();
  if (!expanded) return null;
  const properties = registry.definition.inputs?.properties;
  if (properties) {
    const required = registry.definition.inputs!.required || [];
    const content = Object.keys(properties).map((key) => {
      const property = properties[key];
      return (
        <Field key={key} name={`values.${key}`} defaultValue={property.default}>
          {({ field, fieldState }) => (
            <FormItem name={key} type={property.type as string} required={required.includes(key)}>
              <Input value={field.value} onChange={field.onChange} disabled={readonly} />
              <Feedback errors={fieldState?.errors} />
            </FormItem>
          )}
        </Field>
      );
    });
    return <>{content}</>;
  }
  return <></>;
}

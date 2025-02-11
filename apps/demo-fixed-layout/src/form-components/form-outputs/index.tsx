import { useContext } from 'react';

import { FlowNodeRegistry, Field } from '@flowgram.ai/fixed-layout-editor';

import { TypeTag } from '../type-tag';
import { NodeRenderContext } from '../../context';
import { FormOutputsContainer } from './styles';

export function FormOutputs() {
  const { expanded, node } = useContext(NodeRenderContext);
  if (!expanded) return null;
  const registry = node.getNodeRegistry<FlowNodeRegistry>();
  return (
    <Field name={'outputs'}>
      {({ field }) => {
        const properties =
          registry.definition.outputs?.properties || (field.value as any)?.properties;
        if (properties) {
          const content = Object.keys(properties).map((key) => {
            const property = properties[key];
            return <TypeTag key={key} name={key} type={property.type} />;
          });
          return <FormOutputsContainer>{content}</FormOutputsContainer>;
        }
        return <></>;
      }}
    </Field>
  );
}

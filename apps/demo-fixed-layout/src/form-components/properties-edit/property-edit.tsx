import React, { useState, useLayoutEffect } from 'react';

import { Input, Button } from '@douyinfe/semi-ui';
import { IconCrossCircleStroked } from '@douyinfe/semi-icons';

import { TypeSelector } from '../type-selector';
import { JsonSchema } from '../../typings';
import { LeftColumn, Row } from './styles';

export interface PropertyEditProps {
  propertyKey: string;
  value: JsonSchema;
  onChange: (value: JsonSchema, propertyKey: string, newPropertyKey?: string) => void;
  onDelete?: () => void;
}

export const PropertyEdit: React.FC<PropertyEditProps> = (props) => {
  const { value } = props;
  const [inputKey, updateKey] = useState(props.propertyKey);
  const updateProperty = (key: keyof JsonSchema, val: any) => {
    value[key] = val;
    props.onChange(value, props.propertyKey);
  };
  useLayoutEffect(() => {
    updateKey(props.propertyKey);
  }, [props.propertyKey]);
  return (
    <Row>
      <LeftColumn>
        <TypeSelector
          value={value.type}
          style={{ position: 'absolute', top: 6, left: 4, zIndex: 1 }}
          onChange={(val) => updateProperty('type', val)}
        />
        <Input
          value={inputKey}
          onChange={(v) => updateKey(v.trim())}
          onBlur={() => {
            console.log('onBlur');
            if (inputKey !== '') {
              props.onChange(value, props.propertyKey, inputKey);
            } else {
              updateKey(props.propertyKey);
            }
          }}
          style={{ paddingLeft: 26 }}
        />
      </LeftColumn>
      <Input value={value.default} onChange={(val) => updateProperty('default', val)} />
      {props.onDelete && (
        <Button theme="borderless" icon={<IconCrossCircleStroked />} onClick={props.onDelete} />
      )}
    </Row>
  );
};

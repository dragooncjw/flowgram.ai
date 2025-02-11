import React, { useCallback } from 'react';

import { Typography, Tooltip } from '@douyinfe/semi-ui';

import { TypeTag } from '../type-tag';
import './index.css';

const { Text } = Typography;

const WRAPPER_STYLE = {
  fontSize: 12,
  marginBottom: 6,
  width: '100%',
};

interface FormItemProps {
  children: React.ReactNode;
  name: string;
  type: string;
  required?: boolean;
  description?: string;
}
export function FormItem({
  children,
  name,
  required,
  description,
  type,
}: FormItemProps): JSX.Element {
  const renderTitle = useCallback(
    (showTooltip?: boolean) => (
      <div style={{ width: '0', display: 'flex', flex: '1' }}>
        <Text style={{ width: '100%' }} ellipsis={{ showTooltip: !!showTooltip }}>
          {name}
        </Text>
        {required && <span style={{ color: '#f93920', paddingLeft: '2px' }}>*</span>}
      </div>
    ),
    []
  );
  return (
    <div style={WRAPPER_STYLE}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          gap: 8,
        }}
      >
        <div
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            color: 'var(--semi-color-text-0)',
            width: 118,
            position: 'relative',
            display: 'flex',
            columnGap: 4,
            flexShrink: 0,
          }}
        >
          <TypeTag className="form-item-type-tag" type={type} />
          {description ? (
            <Tooltip content={description}>{renderTitle()}</Tooltip>
          ) : (
            renderTitle(true)
          )}
        </div>

        <div
          style={{
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

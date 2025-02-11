import React from 'react';

import { type TreeNodeData } from '@douyinfe/semi-ui/lib/es/tree';
import { TreeSelect } from '@douyinfe/semi-ui';

import { JsonSchema } from '../json-schema';
import { useVariableTree } from './use-variable-tree';

export interface VariableSelectorProps {
  value?: string;
  onChange: (value?: string) => void;
  options?: {
    size?: 'small' | 'large' | 'default';
    style?: React.CSSProperties;
    emptyContent?: JSX.Element;
    targetSchemas?: JsonSchema[];
    strongEqualToTargetSchema?: boolean;
  };
  readonly?: boolean;
}

export const VariableSelector = ({ value, onChange, options, readonly }: VariableSelectorProps) => {
  const {
    size = 'small',
    style = {},
    emptyContent,
    targetSchemas,
    strongEqualToTargetSchema,
  } = options || {};

  const treeData = useVariableTree<TreeNodeData>({
    targetSchemas,
    strongEqual: strongEqualToTargetSchema,
    ignoreReadonly: true,
    getTreeData: ({ variable, key, icon, children, disabled, parentFields }) => ({
      key,
      value: key,
      icon: (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 4,
          }}
        >
          {icon}
        </span>
      ),
      label: variable.meta?.expressionTitle || variable.key || '',
      disabled,
      labelPath: [...parentFields, variable]
        .map((_field) => _field.meta?.expressionTitle || _field.key || '')
        .join('.'),
      children,
    }),
  });

  const renderEmpty = () => {
    if (emptyContent) {
      return emptyContent;
    }

    // if (targetSchemas?.length) {
    //   return (
    //     <div>
    //       No Variable With:
    //       <VariableTypeTag className={s['prefix-icon']} typeSchema={targetSchemas[0]} />
    //     </div>
    //   );
    // }

    return 'nodata';
  };
  if (readonly) {
    return <>Variable Selector Preview Mode is Under Construction</>;
  }

  return (
    <>
      <TreeSelect
        dropdownMatchSelectWidth={false}
        // getPopupContainer={() => nodeElement}
        treeData={treeData}
        size={size}
        value={value}
        style={{ width: '100%', ...style }}
        onChange={(option) => {
          onChange(option as string);
        }}
        showClear
        // renderSelectedItem={(item: TreeNodeData) => {
        //   let label = item?.labelPath ?? value?.replace('$.', '') ?? '';
        //   return (
        //     <div className={s['option-select-item-container']}>
        //       <div className={item?.labelPath ? s.text : s['error-text']}>{label}</div>
        //     </div>
        //   );
        // }}
        placeholder="Select Variable..."
        emptyContent={renderEmpty()}
      />
    </>
  );
};

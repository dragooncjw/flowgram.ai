/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

import { Button, Input } from '@douyinfe/semi-ui';
import { IconDelete, IconPlus } from '@douyinfe/semi-icons';

import { useList } from './use-list';
import { PropsType } from './types';
import { VariableSelector } from '../variable-selector';
import { UIRow, UIRows } from './styles';

export function BatchOutputs(props: PropsType) {
  const { readonly, style } = props;

  const { list, add, update, remove } = useList(props);

  return (
    <div>
      <UIRows style={style}>
        {list.map((item) => (
          <UIRow key={item.id}>
            <Input
              style={{ width: 100 }}
              disabled={readonly}
              size="small"
              value={item.key}
              onChange={(v) => update({ ...item, key: v })}
            />
            <VariableSelector
              style={{ flexGrow: 1 }}
              readonly={readonly}
              value={item.value?.content}
              onChange={(v) =>
                update({
                  ...item,
                  value: {
                    type: 'ref',
                    content: v,
                  },
                })
              }
            />
            <Button
              disabled={readonly}
              icon={<IconDelete />}
              size="small"
              onClick={() => remove(item.id)}
            />
          </UIRow>
        ))}
      </UIRows>
      <Button disabled={readonly} icon={<IconPlus />} size="small" onClick={add}>
        Add
      </Button>
    </div>
  );
}

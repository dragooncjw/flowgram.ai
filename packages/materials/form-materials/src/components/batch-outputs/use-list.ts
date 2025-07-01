/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { useEffect, useState } from 'react';

import { difference } from 'lodash';

import { OutputItem, PropsType } from './types';

let _id = 0;
function genId() {
  return _id++;
}

export function useList({ value, onChange }: PropsType) {
  const [list, setList] = useState<OutputItem[]>([]);

  useEffect(() => {
    setList((_prevList) => {
      const newKeys = Object.keys(value || {});
      const oldKeys = _prevList.map((item) => item.key).filter(Boolean) as string[];
      const addKeys = difference(newKeys, oldKeys);

      return _prevList
        .filter((item) => !item.key || newKeys.includes(item.key))
        .map((item) => ({
          id: item.id,
          key: item.key,
          value: item.key ? value?.[item.key!] : undefined,
        }))
        .concat(
          addKeys.map((_key) => ({
            id: genId(),
            key: _key,
            value: value?.[_key],
          }))
        );
    });
  }, [value]);

  const add = () => {
    setList((prevList) => [
      ...prevList,
      {
        id: genId(),
      },
    ]);
  };

  const update = (item: OutputItem) => {
    setList((prevList) => {
      const nextList = prevList.map((_item) => {
        if (_item.id === item.id) {
          return item;
        }
        return _item;
      });

      onChange(
        Object.fromEntries(
          nextList.filter((item) => item.key).map((item) => [item.key!, item.value])
        )
      );

      return nextList;
    });
  };

  const remove = (itemId: number) => {
    setList((prevList) => {
      const nextList = prevList.filter((_item) => _item.id !== itemId);

      onChange(
        Object.fromEntries(
          nextList.filter((item) => item.key).map((item) => [item.key!, item.value])
        )
      );

      return nextList;
    });
  };

  return { list, add, update, remove };
}

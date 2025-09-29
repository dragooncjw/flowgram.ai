/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

import { useStartDragNode } from '@flowgram.ai/fixed-layout-editor';

import { nodeRegistries } from '../node-registries';
import { useAddNode } from '../hooks/use-add-node';

export const NodeAddPanel: React.FC = (props) => {
  const { startDrag } = useStartDragNode();
  const { handleAdd } = useAddNode();

  return (
    <div className="demo-fixed-sidebar">
      {nodeRegistries.map((registry) => {
        const nodeType = registry.type;
        return (
          <div
            key={nodeType}
            className="demo-fixed-card"
            onMouseDown={(e) => {
              e.stopPropagation();
              const nodeAddData = registry.onAdd();
              return startDrag(
                e,
                {
                  dragJSON: nodeAddData,
                  onCreateNode: async (json, dropNode) => handleAdd(json, dropNode),
                },
                {
                  disableDragScroll: true,
                }
              );
            }}
          >
            {nodeType}
          </div>
        );
      })}
    </div>
  );
};

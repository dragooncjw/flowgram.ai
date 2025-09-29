/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

import { useStartDragNode } from '@flowgram.ai/fixed-layout-editor';

import { nodeRegistries } from '../node-registries';

export const NodeAddPanel: React.FC = (props) => {
  const { startDrag } = useStartDragNode();

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
              startDrag(
                e,
                {
                  dragStartEntityProps: nodeAddData,
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

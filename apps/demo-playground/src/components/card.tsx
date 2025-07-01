/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import React, { useCallback, useState } from 'react';

import { usePlayground, usePlaygroundDrag } from '@flowgram.ai/playground-react';

export function Card() {
  return (
    <div
      style={{
        width: 200,
        height: 100,
        position: 'absolute',
        color: 'white',
        backgroundColor: 'red',
        left: 500,
        top: 500,
      }}
    ></div>
  );
}

export function DragableCard() {
  const [pos, setPos] = useState({ x: 200, y: 100 });
  // 用于拖拽，拖拽到边缘时候会自动滚动画布
  const dragger = usePlaygroundDrag();
  const playground = usePlayground();
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const startPos = { x: pos.x, y: pos.y };
      dragger.start(e, {
        onDragStart() {
          playground.config.grabDisable = true;
          // start drag
        },
        onDrag(dragEvent) {
          // 需要 除去当前的缩放比例
          setPos({
            x: startPos.x + (dragEvent.endPos.x - dragEvent.startPos.x) / dragEvent.scale,
            y: startPos.y + (dragEvent.endPos.y - dragEvent.startPos.y) / dragEvent.scale,
          });
        },
        onDragEnd() {
          playground.config.grabDisable = false;
          // end drag
        },
      });
      // e.stopPropagation();
      // e.preventDefault();
    },
    [pos]
  );
  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        cursor: 'move',
        width: 200,
        height: 100,
        position: 'absolute',
        color: 'white',
        backgroundColor: 'blue',
        left: pos.x,
        top: pos.y,
      }}
    ></div>
  );
}

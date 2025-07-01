/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

import { usePlaygroundTools } from '@flowgram.ai/playground-react';

export const PlaygroundTools: React.FC<{ minZoom?: number; maxZoom?: number }> = (props) => {
  const tools = usePlaygroundTools(props);
  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 100,
        right: 100,
        bottom: 100,
        padding: 13,
        border: '1px solid #ccc',
        backgroundColor: 'white',
        borderRadius: 8,
        userSelect: 'none',
        cursor: 'pointer',
      }}
    >
      <button onClick={() => tools.toggleIneractiveType()}>{tools.interactiveType}</button>
      <button onClick={() => tools.zoomout()}>Zoom Out</button>
      <button onClick={() => tools.zoomin()}>Zoom In</button>
      <span>{Math.floor(tools.zoom * 100)}%</span>
    </div>
  );
};

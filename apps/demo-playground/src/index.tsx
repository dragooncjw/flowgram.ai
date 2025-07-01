/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { useMemo } from 'react';

import { createRoot } from 'react-dom/client';
import {
  Command,
  PlaygroundReact,
  PlaygroundReactContent,
  PlaygroundReactProps,
} from '@flowgram.ai/playground-react';

import { PlaygroundTools } from './components/playground-tools';
import { Card, DragableCard } from './components/card';

// 加载画布样式
import '@flowgram.ai/playground-react/index.css';

/**
 * 用于提供纯画布缩放能力
 */
export function App() {
  const playgroundProps = useMemo<PlaygroundReactProps>(
    () => ({
      // 是否增加背景
      background: true,
      playground: {
        ineractiveType: 'MOUSE', // 鼠标模式, MOUSE | PAD
      },
      // 自定义快捷键
      shortcuts(registry, ctx) {
        registry.addHandlers(
          /**
           * 放大
           */
          {
            commandId: Command.Default.ZOOM_IN,
            shortcuts: ['meta =', 'ctrl ='],
            execute: () => {
              ctx.playground.config.zoomin();
            },
          },
          /**
           * 缩小
           */
          {
            commandId: Command.Default.ZOOM_OUT,
            shortcuts: ['meta -', 'ctrl -'],
            execute: () => {
              ctx.playground.config.zoomout();
            },
          }
        );
      },
    }),
    []
  );
  /*
   * PlaygroundReact 画布 react 容器, background 属性可以关闭背景的点点点
   * PlaygroundReactContent 画布内容，会跟着缩放
   */
  return (
    <PlaygroundReact {...playgroundProps}>
      <PlaygroundReactContent>
        <Card />
        <DragableCard />
      </PlaygroundReactContent>
      <PlaygroundTools />
    </PlaygroundReact>
  );
}

const app = createRoot(document.getElementById('root')!);

app.render(<App />);

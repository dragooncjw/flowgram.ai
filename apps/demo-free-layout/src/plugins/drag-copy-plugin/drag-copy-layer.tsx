/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

import {
  Layer,
  injectable,
  inject,
  PipelineLayerPriority,
  observeEntity,
  EditorStateConfigEntity,
  SelectionService,
  FlowNodeEntity,
} from '@flowgram.ai/free-layout-editor';

import { BaseNode } from '../../components';

@injectable()
export class DragCopyLayer extends Layer {
  @observeEntity(EditorStateConfigEntity)
  protected editorStateConfig: EditorStateConfigEntity;

  @inject(SelectionService)
  private selection: SelectionService;

  private isAltKeyPressed: boolean = false;

  containerRef = React.createRef<HTMLDivElement>();

  private startEntity?: FlowNodeEntity;

  private isMouseMode() {
    return this.editorStateConfig.isMouseFriendlyMode();
  }

  // 在 BaseNode 里加一下，mousedown 的时候使用这个 startDrag 方法。
  startDrag(entity: FlowNodeEntity) {
    this.startEntity = entity;
  }

  onReady() {
    this.listenGlobalEvent(
      'keydown',
      (e: KeyboardEvent) => {
        if (e.altKey) {
          this.isAltKeyPressed = true;
          console.log('debugger key', this.selection.selection);
          // 如果是鼠标优先，按住 alt 键需要更新鼠标为默认
          if (this.isMouseMode()) {
            this.config.updateCursor('');
          }
        }
      },
      PipelineLayerPriority.BASE_LAYER
    );
    this.listenGlobalEvent('mousemove', (e) => {
      if (this.isAltKeyPressed && this.startEntity) {
        // 设置元素的 x、y
      }
    });
    this.listenGlobalEvent('keyup', (e) => {
      console.log('debugger e', e);
      this.isAltKeyPressed = false;
      this.startEntity = undefined;
    });
  }

  render() {
    // 这里参考 packages/canvas-engine/renderer/src/layers/flow-drag-layer.tsx 写一下样式，根据 containerRef 更改位置
    if (!this.startEntity) return <></>;
    return (
      <div
        ref={this.containerRef}
        style={{ position: 'absolute', zIndex: 99999, visibility: 'hidden' }}
        onMouseEnter={(e) => e.stopPropagation()}
      >
        <BaseNode node={this.startEntity!} />
      </div>
    );
  }
}

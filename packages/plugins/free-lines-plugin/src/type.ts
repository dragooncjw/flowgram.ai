import { FC, ReactNode } from 'react';

import type { PluginContext } from '@flowgram.ai/core';
import type { LineType, WorkflowLineEntity } from '@flowgram.ai/free-layout-core';

export interface LineRenderProps {
  key: string;
  fromColor?: string;
  toColor?: string;
  color?: string; // 高亮颜色，优先级最高
  selected?: boolean;
  showControlPoints?: boolean;
  line: WorkflowLineEntity;
  lineType: LineType;
  version: string; // 用于控制 memo 刷新
  children?: ReactNode;
  strokePrefix?: string;
}

export interface LinesLayerOptions {
  renderElement?: HTMLElement | (() => HTMLElement | undefined);
  renderInsideLine?: FC<LineRenderProps>;
}

export interface FreeLinesPluginOptions extends Omit<LinesLayerOptions, 'renderElement'> {
  renderElement?: HTMLElement | ((ctx: PluginContext) => HTMLElement | undefined);
}

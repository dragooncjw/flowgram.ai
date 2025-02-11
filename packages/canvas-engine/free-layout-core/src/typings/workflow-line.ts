import { type IPoint } from '@flowgram.ai/utils';

export enum LineType {
  BEZIER, // 贝塞尔曲线
  LINE_CHART, // 折叠线
}

export interface LinePosition {
  from: IPoint;
  to: IPoint;
}

export interface LineColor {
  hidden: string;
  default: string;
  drawing: string;
  hovered: string;
  selected: string;
  error: string;
}

export enum LineColors {
  HIDDEN = 'transparent', // 隐藏线条
  DEFUALT = '#4d53e8',
  DRAWING = '#5DD6E3', // '#b5bbf8', // '#9197F1',
  HOVER = '#37d0ff',
  ERROR = 'red',
}

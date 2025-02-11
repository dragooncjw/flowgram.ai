import React from 'react';

import { type IPoint } from '@flowgram.ai/utils';
import { POINT_RADIUS } from '@flowgram.ai/free-layout-core';

import { LineStyle } from '../index.style';
import ArrowRenderer from '../arrow';
import { LineRenderProps } from '../../../type';
import { STROKE_WIDTH_SLECTED, STROKE_WIDTH } from '../../../constants/points';
import { LINE_OFFSET } from '../../../constants/lines';

const PADDING = 12;

// eslint-disable-next-line react/display-name
export const BezierLineRender = (props: LineRenderProps) => {
  const { line, color, fromColor, toColor, selected, children, strokePrefix } = props;
  const { bbox } = line.bezier;
  const { position, reverse, vertical, hideArrow } = line;

  // 相对位置转换函数
  const toRelative = (p: IPoint): IPoint => ({
    x: p.x - bbox.x + PADDING,
    y: p.y - bbox.y + PADDING,
  });

  const fromPos = toRelative(position.from);
  const toPos = toRelative(position.to);

  // 箭头位置计算
  const arrowToPos: IPoint = vertical
    ? { x: toPos.x, y: toPos.y - POINT_RADIUS }
    : { x: toPos.x - POINT_RADIUS, y: toPos.y };
  const arrowFromPos: IPoint = vertical
    ? { x: fromPos.x, y: fromPos.y + POINT_RADIUS + LINE_OFFSET }
    : { x: fromPos.x + POINT_RADIUS + LINE_OFFSET, y: fromPos.y };

  const controls = line.bezier.controls.map((c) => toRelative(c));

  const getLinearStartColor = (): string | undefined => {
    if (vertical) {
      return fromPos.y < arrowToPos.y ? fromColor : toColor;
    }
    return fromPos.x < arrowToPos.x ? fromColor : toColor;
  };

  const getLinearEndColor = (): string | undefined => {
    if (vertical) {
      return fromPos.y < arrowToPos.y ? toColor : fromColor;
    }
    return fromPos.x < arrowToPos.x ? toColor : fromColor;
  };

  const linearStartColor = getLinearStartColor();
  const linearEndColor = getLinearEndColor();

  const getPathData = (): string => {
    const controlPoints = controls.map((s) => `${s.x} ${s.y}`).join(',');
    const curveType = controls.length === 1 ? 'S' : 'C';

    if (vertical) {
      return `M${fromPos.x} ${fromPos.y + POINT_RADIUS} ${curveType} ${controlPoints}, ${
        arrowToPos.x
      } ${arrowToPos.y}`;
    }
    return `M${fromPos.x + POINT_RADIUS} ${fromPos.y} ${curveType} ${controlPoints}, ${
      arrowToPos.x
    } ${arrowToPos.y}`;
  };
  const pathData = getPathData();

  const strokeWidth = selected ? STROKE_WIDTH_SLECTED : STROKE_WIDTH;

  const strokeID = strokePrefix ? `${strokePrefix}-${line.id}` : line.id;

  const path = (
    <path
      d={pathData}
      fill="none"
      stroke={`url(#${strokeID})`}
      strokeWidth={strokeWidth}
      className={line.processing || line.flowing ? 'flowing-line' : ''}
    />
  );

  return (
    <LineStyle
      style={{
        left: bbox.x - PADDING,
        top: bbox.y - PADDING,
        position: 'absolute',
      }}
    >
      {children}
      <svg width={bbox.width + PADDING * 2} height={bbox.height + PADDING * 2}>
        <defs>
          <linearGradient
            x1={vertical ? '100%' : '0%'}
            y1={vertical ? '0%' : '100%'}
            x2="100%"
            y2="100%"
            id={strokeID}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={color || linearStartColor} offset="0%" />
            <stop stopColor={color || linearEndColor} offset="100%" />
          </linearGradient>
        </defs>
        <g>
          {path}
          <ArrowRenderer
            id={strokeID}
            reverseArrow={reverse}
            pos={reverse ? arrowFromPos : arrowToPos}
            strokeWidth={strokeWidth}
            vertical={vertical}
            hide={hideArrow}
          />
          {props.showControlPoints
            ? controls.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r="4" fill="#ccc" />)
            : undefined}
        </g>
      </svg>
    </LineStyle>
  );
};

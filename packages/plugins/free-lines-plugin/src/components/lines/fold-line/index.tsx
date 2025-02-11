import React from 'react';

import { POINT_RADIUS } from '@flowgram.ai/free-layout-core';

import { LineStyle } from '../index.style';
import ArrowRenderer from '../arrow';
import { LineRenderProps } from '../../../type';
import { STROKE_WIDTH, STROKE_WIDTH_SLECTED } from '../../../constants/points';
import { LINE_OFFSET } from '../../../constants/lines';

/**
 * 折叠线
 */
// eslint-disable-next-line react/display-name
export const FoldLineRender = (props: LineRenderProps) => {
  const { selected, color, line, children } = props;
  const { to, from } = line.position;
  const strokeWidth = selected ? STROKE_WIDTH_SLECTED : STROKE_WIDTH;

  // 真正连接线需要到的点的位置
  const arrowToPos = {
    x: to.x - POINT_RADIUS,
    y: to.y,
  };
  const arrowFromPos = {
    x: from.x + POINT_RADIUS + LINE_OFFSET,
    y: from.y,
  };

  return (
    <LineStyle>
      {children}
      <svg overflow="visible">
        <defs>
          <linearGradient
            x1="0%"
            y1="100%"
            x2="100%"
            y2="100%"
            id={line.id}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={color} offset="0%" />
            <stop stopColor={color} offset="100%" />
          </linearGradient>
        </defs>
        <g>
          <path
            d={line.bezier.foldPath}
            fill="none"
            strokeLinecap="round"
            stroke={color}
            strokeWidth={strokeWidth}
            className={line.flowing || line.processing ? 'flowing-line' : ''}
          />
          <ArrowRenderer
            id={line.id}
            reverseArrow={line.reverse}
            pos={line.reverse ? arrowFromPos : arrowToPos}
            strokeWidth={strokeWidth}
            hide={line.hideArrow}
          />
        </g>
      </svg>
    </LineStyle>
  );
};

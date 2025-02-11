import React, { memo } from 'react';

import { LineType } from '@flowgram.ai/free-layout-core';

import type { LineRenderProps } from '../../type';
import { FoldLineRender } from './fold-line';
import { BezierLineRender } from './bezier-line';

const LineTypeRender = (props: LineRenderProps) => {
  if (props.lineType === LineType.LINE_CHART) {
    return <FoldLineRender {...props} />;
  }
  return <BezierLineRender {...props} />;
};

export const LineRender = memo(
  LineTypeRender,
  (prevProps, nextProps) => prevProps.version === nextProps.version
);

/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import {
  FlowNodeEntity,
  FlowNodeJSON,
  FlowOperationService,
  usePlayground,
  useService,
} from '@flowgram.ai/fixed-layout-editor';

export const useAddNode = () => {
  const playground = usePlayground();
  const flowOperationService = useService(FlowOperationService) as FlowOperationService;

  const handleAdd = (addProps: FlowNodeJSON, dropNode: FlowNodeEntity) => {
    const blocks = addProps.blocks ? addProps.blocks : undefined;
    const entity = flowOperationService.addFromNode(dropNode, {
      ...addProps,
      blocks,
    });
    setTimeout(() => {
      playground.scrollToView({
        bounds: entity.bounds,
        scrollToCenter: true,
      });
    }, 10);
    return entity;
  };

  return {
    handleAdd,
  };
};

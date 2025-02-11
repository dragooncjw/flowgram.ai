import { type IPoint } from '@flowgram.ai/utils';

import { WorkflowResetLayoutService } from '../service';
import { WorkflowNodeLinesData } from '../entity-datas';
import type { WorkflowLineEntity, WorkflowNodeEntity } from '../entities';
import { layoutToPositions } from './layout-to-positions';
import { autoLayout, AutoLayoutConfig } from './auto-layout';

export const autoLayoutNode = async (params: {
  node: WorkflowNodeEntity;
  resetLayoutService: WorkflowResetLayoutService;
  layoutConfig?: AutoLayoutConfig;
}): Promise<() => Promise<void>> => {
  const { node, resetLayoutService, layoutConfig } = params;
  const nodes = node.collapsedChildren;
  if (!nodes?.length) {
    return async () => {};
  }
  const edges = node.collapsedChildren
    .map(child => {
      const childLinesData = child.getData<WorkflowNodeLinesData>(WorkflowNodeLinesData);
      return childLinesData.outputLines.filter(Boolean);
    })
    .flat();

  // 处理竖线
  const horizontalEdges = edges
    .map(edge => {
      if (!edge.vertical) {
        return edge;
      }
      const prev = edge.info.from;
      const prevOfPrev = edges.find(edge => edge.info.to === prev);
      if (!prevOfPrev) {
        return;
      }
      // 伪装竖线
      return {
        info: {
          ...edge.info,
          from: prevOfPrev.info.from,
        },
      } as WorkflowLineEntity;
    })
    .filter(Boolean) as WorkflowLineEntity[];

  // 先执行子节点 autoLayout
  const resets = await Promise.all(
    nodes.map(async child =>
      autoLayoutNode({
        node: child,
        resetLayoutService,
        layoutConfig,
      }),
    ),
  );

  // 执行自身 autoLayout
  const nodePositionMap: Record<string, IPoint> = autoLayout(
    nodes,
    horizontalEdges,
    ['false'],
    layoutConfig,
  );
  const newNodePositionMap: Record<string, IPoint> = await layoutToPositions(
    nodes,
    nodePositionMap,
  );

  // 写入历史记录
  const nodeIds = nodes.map(node => node.id);
  resetLayoutService.fireResetLayout(nodeIds, nodePositionMap, newNodePositionMap);

  const reset = async () => {
    // 先 reset 子节点，再 reset 自身
    await Promise.all(resets.map(reset => reset()));
    await layoutToPositions(nodes, newNodePositionMap);
  };
  return reset;
};

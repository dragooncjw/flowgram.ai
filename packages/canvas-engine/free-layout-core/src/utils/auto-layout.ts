import { type IPoint } from '@flowgram.ai/utils';
import { FlowNodeTransformData } from '@flowgram.ai/document';
// https://github.com/dagrejs/dagre/wiki
import dagre from '@dagrejs/dagre';

import { type WorkflowLineEntity, type WorkflowNodeEntity } from '../entities';

export interface AutoLayoutConfig {
  rankdir?: 'LR' | 'TB' | 'BT' | 'RL';
  nodesep?: number;
  ranksep?: number;
  ranker?: 'network-simplex' | 'tight-tree' | 'longest-path';
}

const defaultConfig: AutoLayoutConfig = {
  rankdir: 'LR',
  nodesep: 100,
  ranksep: 100,
  ranker: 'network-simplex',
};

export function autoLayout(
  nodes: WorkflowNodeEntity[],
  edges: WorkflowLineEntity[],
  ports?: (string | number)[],
  config?: AutoLayoutConfig
): Record<string, IPoint> {
  const dagreGraph = new dagre.graphlib.Graph({ multigraph: true });
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    ...defaultConfig,
    ...config,
  });

  const dNodes = nodes.map((node) => {
    const nodeTransformData = node.getData(FlowNodeTransformData);
    return {
      id: node.id,
      bounds: nodeTransformData.bounds,
    };
  });
  const infos = edges.filter((edge) => edge.info.to).map((edge) => edge.info);

  // 确保 id 排序跟 node 添加顺序相关，且让 ports 中匹配到的端口对应的 to 节点排序靠后
  const newIDMaps: Record<string, string> = {};
  dNodes.forEach((node, i) => {
    // dagreGraph 需要string 作为id，为了保证字符串排序的正确 加上100000
    const newId = 100000 + i;
    newIDMaps[node.id] = String(newId);
  });
  infos.forEach((info) => {
    if (info.fromPort && ports!.indexOf(info.fromPort) > -1) {
      let newId = newIDMaps[info.to!];
      newId = String(Number(newId) + dNodes.length);
      newIDMaps[info.to!] = newId;
    }
  });

  dNodes.forEach((node, i) => {
    const { bounds } = node;
    dagreGraph.setNode(newIDMaps[node.id], {
      originID: node.id,
      width: bounds.width,
      height: bounds.height,
    });
  });

  const dEdges = infos.map((info) => ({
    ...info,
    from: newIDMaps[info.from],
    to: newIDMaps[info.to!],
  }));

  dEdges.sort((next, prev) => {
    if (next.from === prev.from) {
      return next.to! < prev.to! ? -1 : 1;
    }
    return next.from < prev.from ? -1 : 1;
  });

  dEdges.forEach((edge) => {
    const e: {
      v: string;
      w: string;
      name?: string;
      weight?: number;
    } = {
      v: edge.from,
      w: edge.to!,
    };
    if (edge.fromPort) {
      e.name = String(edge.fromPort);
    }
    dagreGraph.setEdge(e);
  });

  dagre.layout(dagreGraph);

  const nodePositionMap: Record<string, IPoint> = {};
  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(newIDMaps[node.id]);
    if (node.collapsedChildren?.length > 0) {
      // 存在子节点才需计算padding带来的偏移
      const nodeTransform = node.getData(FlowNodeTransformData);
      const paddingLeftOffset = -nodeTransform.bounds.width / 2 + nodeTransform.padding.left;
      nodePositionMap[node.id] = {
        x: nodeWithPosition.x + paddingLeftOffset,
        y: nodeWithPosition.y,
      };
    } else {
      nodePositionMap[node.id] = {
        x: nodeWithPosition.x,
        y: nodeWithPosition.y,
      };
    }
  });

  return nodePositionMap;
}

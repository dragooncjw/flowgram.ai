import { WorkflowJSON, WorkflowNodeRegistry } from '@flowgram.ai/free-layout-editor';

export const initialData: WorkflowJSON = {
  nodes: [
    {
      id: 'start_0', // 节点 id
      type: 'start', // 类型
      meta: {
        position: { x: 0, y: 0 }, //  初始化的位置
      },
      data: {
        title: '开始节点',
      }, // 业务扩展数据
    },
    {
      id: 'node_0',
      type: 'custom',
      meta: {
        position: { x: 400, y: 0 },
      },
      data: {
        title: '普通节点',
      },
    },
    {
      id: 'end_0',
      type: 'end',
      meta: {
        position: { x: 800, y: 0 },
      },
      data: {
        title: '结束节点',
      },
    },
  ],
  edges: [
    {
      sourceNodeID: 'start_0', // 用于控制连线
      targetNodeID: 'node_0',
    },
    {
      sourceNodeID: 'node_0',
      targetNodeID: 'end_0',
    },
  ],
};

/**
 * 节点类型定义
 */
export const nodeRegistries: WorkflowNodeRegistry[] = [
  {
    type: 'start',
    meta: {
      isStart: true, // 标记为开始
      deleteDisable: true, // 开始节点不能删除
      copyDisable: true, // 不能 copy, 只有一个
      defaultPorts: [{ type: 'output' }], // 用于定义输入和输出端口，开始节点只有输出端口
    },
  },
  {
    type: 'end',
    meta: {
      deleteDisable: true,
      copyDisable: true,
      defaultPorts: [{ type: 'input' }],
    },
  },
  {
    type: 'custom',
    meta: {
      // 这里补充配置
    },
    defaultPorts: [{ type: 'output' }, { type: 'input' }], // 普通节点有两个端口
  },
];

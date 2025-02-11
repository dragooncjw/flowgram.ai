import { FlowDocumentJSON, FlowNodeRegistry } from '@flowgram.ai/fixed-layout-editor';

/**
 * 配置流程数据，数据为 blocks 嵌套的格式
 */
export const initialData: FlowDocumentJSON = {
  nodes: [
    // 开始节点
    {
      id: 'start_0',
      type: 'start',
      blocks: [],
    },
    // 分支节点
    {
      id: 'split0',
      type: 'dynamicSplit',
      blocks: [
        {
          id: 'branch_0',
          type: 'block',
          blocks: [
            {
              id: 'custom_0',
              type: 'customType',
            },
          ],
        },
        {
          id: 'branch_1',
          type: 'block',
          blocks: [],
        },
      ],
    },
    // 结束节点
    {
      id: 'end_0',
      type: 'end',
    },
  ],
};

/**
 * 自定义节点注册
 */
export const nodeRegistries: FlowNodeRegistry[] = [
  {
    /**
     * 自定义节点类型
     */
    type: 'customType',
    /**
     * 自定义节点扩展:
     *  - loop: 扩展为循环节点
     *  - start: 扩展为开始节点
     *  - dynamicSplit: 扩展为分支节点
     *  - end: 扩展为结束节点
     *  - tryCatch: 扩展为 tryCatch 节点
     *  - default: 扩展为普通节点 (默认)
     */
    extend: 'default',
    /**
     * 节点配置信息
     */
    meta: {
      // isStart: false, // 是否为开始节点
      // isNodeEnd: false, // 是否为结束节点，结束节点后边无法再添加节点
      // draggable: false, // 是否可拖拽，如开始节点和结束节点无法拖拽
      // selectable: false, // 触发器等开始节点不能被框选
      // deleteDisable: true, // 禁止删除
      // copyDisable: true, // 禁止copy
      // addDisable: true, // 禁止添加
    },
  },
];

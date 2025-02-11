import { PreviewEditor } from '../preview-editor';
import { FreeLayoutDemo } from '.';

const indexCode = {
  code: `import {
  EditorRenderer,
  FreeLayoutEditorProvider,
  FreeLayoutProps,
} from '@flowgram.ai/free-layout-editor';

import { NodeAddPanel } from './node-add-panel';
import '@flowgram.ai/free-layout-editor/index.css';
import './index.css';

export const FreeLayoutDemo = (editorProps: FreeLayoutProps) => (
  <FreeLayoutEditorProvider {...editorProps}>
    <div className="demo-container">
      <div className="demo-layout">
        <NodeAddPanel />
        <EditorRenderer className="demo-editor" />
      </div>
    </div>
  </FreeLayoutEditorProvider>
);
`,
  active: true,
};

const dataCode = `
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
];`;

const nodeAddPanelCode = `
import React from 'react';

import { WorkflowDragService, useService } from '@flowgram.ai/free-layout-editor';

const cardkeys = ['custom', 'any-node'];

export const NodeAddPanel: React.FC = props => {
  const startDragSerivce = useService<WorkflowDragService>(WorkflowDragService);

  return (
    <div className="demo-sidebar">
      {cardkeys.map(key => (
        <div
          key={key}
          className="demo-card"
          onMouseDown={e => startDragSerivce.startDragCard(key, e, {})}
        >
          {key}
        </div>
      ))}
    </div>
  );
};
`;

const useEditorPropsCode = `
import { useMemo } from 'react';

import {
  FreeLayoutProps,
  WorkflowNodeProps,
  WorkflowNodeRenderer,
} from '@flowgram.ai/free-layout-editor';

import { initialData, nodeRegistries } from './data';

export const useEditorProps = () => {
  const editorProps = useMemo<FreeLayoutProps>(
    () => ({
      /**
       * 初始化数据
       */
      initialData,
      /**
       * 节点类型
       */
      nodeRegistries,
      /**
       * 物料注册
       */
      materials: {
        /**
         * 渲染节点内容
         * @param props
         */
        renderDefaultNode: (props: WorkflowNodeProps) => (
          <WorkflowNodeRenderer className="demo-node" node={props.node}>
            <div className="demo-node-title">{props.node.getExtInfo().title}</div>
            <div className="demo-node-content flow-canvas-not-draggable">
              <input
                onChange={e => props.node.updateExtInfo({ title: e.currentTarget.value })}
                placeholder="重新编辑标题"
              />
            </div>
          </WorkflowNodeRenderer>
        ),
      },
      onInit: ctx => {},
      /**
       * 画布数据加载完成
       */
      onLoad(ctx) {
        // 将元素滚动到中间
        ctx.document.fitView(false);
        // eslint-disable-next-line no-console
        console.log('--- 画布渲染 ---');
      },
      /**
       * 画布销毁
       */
      onDispose() {
        // eslint-disable-next-line no-console
        console.log('--- 画布销毁 ---');
      },
    }),
    [],
  );
  return editorProps;
};
`;

export const FreeLayoutPreview = () => {
  const files = {
    'index.tsx': indexCode,
    'data.ts': dataCode,
    'node-add-panel.tsx': nodeAddPanelCode,
    'use-editor-props.tsx': useEditorPropsCode,
  };
  return (
    <PreviewEditor files={files} previewStyle={{ height: 500 }} editorStyle={{ height: 500 }}>
      <FreeLayoutDemo />
    </PreviewEditor>
  );
};

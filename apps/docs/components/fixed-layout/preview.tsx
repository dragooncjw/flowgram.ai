import { PreviewEditor } from '../preview-editor';
import { FixedLayout } from './index';

const indexCode = {
  code: `
// 加载样式文件
import '@flowgram.ai/fixed-layout-editor/index.css';
import { PlaygroundTools } from '@flowgram.ai/fixed-semi-materials';
import { FixedLayoutEditorProvider, EditorRenderer } from '@flowgram.ai/fixed-layout-editor';

import { useEditorProps } from './use-editor-props';
import { nodeRegistries, initialData } from './data';

export const FixedLayout = () => {
  const editorProps = useEditorProps(initialData, nodeRegistries);
  return (
    <FixedLayoutEditorProvider {...editorProps}>
      <div className="demo-container">
        <EditorRenderer>{/* add child panel here */}</EditorRenderer>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 10,
          top: 10,
          zIndex: 10,
        }}
      >
        <PlaygroundTools layoutText={'isHorizontal'} />
      </div>
    </FixedLayoutEditorProvider>
  );
}`,
  active: true,
};

const dataTsCode = `import { FlowDocumentJSONV2, FlowNodeRegistry } from '@flowgram.ai/fixed-layout-editor';

/**
 * 配置流程数据，数据为 blocks 嵌套的格式
 */
export const initialData: FlowDocumentJSONV2 = {
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
`;

const useEditorPropsCode = `
import { useMemo } from 'react';

import { defaultFixedSemiMaterials } from '@flowgram.ai/fixed-semi-materials';
import {
  type FixedLayoutProps,
  FlowDocumentJSONV2,
  FlowNodeRegistry,
  FlowTextKey,
} from '@flowgram.ai/fixed-layout-editor';

import { NodeRenderer } from './node-render';

export function useEditorProps(
  initialData: FlowDocumentJSONV2, // 初始化数据
  nodeRegistries: FlowNodeRegistry[], // 节点定义
): FixedLayoutProps {
  return useMemo<FixedLayoutProps>(
    () => ({
      /** 是否只读，只读模式将无法拖拽节点 */
      readonly: false,
      /**
       * 画布节点定义
       */
      nodeRegistries,
      /**
       * 画布物料
       */
      materials: {
        renderNodes: {
          ...defaultFixedSemiMaterials,
          /* 这里可以根据 key 业务侧定制组件 */
        },
        renderDefaultNode: NodeRenderer, // 节点渲染
        renderTexts: {
          [FlowTextKey.LOOP_END_TEXT]: 'loop end',
          [FlowTextKey.LOOP_TRAVERSE_TEXT]: 'looping',
        },
      },
      // 使用 defaultFixedUDMaterials 需开启 history 功能。
      history: {
        enable: true,
      },
      plugins: () => [],
      /**
       * 画布初始化
       */
      onInit: ctx => {
        // 加载数据
        ctx.document.fromJSON(initialData);
      },
      /**
       * 画布销毁
       */
      onDispose: () => {},
    }),
    [],
  );
}
`;

const nodeRenderCode = `import { useRef } from 'react';

import {
  FlowNodeRenderData,
  type FlowNodeEntity,
  useStartDragNode,
} from '@flowgram.ai/fixed-layout-editor';

export const NodeRenderer = ({ node }: {
  node: FlowNodeEntity;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const renderData = node.getData(FlowNodeRenderData);
  const { dragging } = renderData;

  const nodeRegistry = node.getNodeRegister();
  const { startDrag } = useStartDragNode();

  return (
    <div
      className="demo-node"
      ref={containerRef}
      style={{
        minWidth: 300,
        opacity: dragging ? 0.3 : 1,
        border: '1px solid blue',
        display: 'flex',
        minHeight: 100,
        flexDirection: 'column',
        alignItems: 'flex-start',
        boxSizing: 'border-box',
        borderRadius: 8,
        background: '#fff',
        boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.1)',
        padding: 12,
        ...(nodeRegistry.containerStyle || {}),
      }}
      onMouseDown={e => {
        e.stopPropagation();
        startDrag(e, { dragStartEntity: node });
      }}
      onMouseEnter={() => {
        renderData.toggleMouseEnter();
      }}
      onMouseLeave={e => {
        const { clientX, clientY } = e || {};
        const boundingRect = containerRef?.current?.getBoundingClientRect();

        // 移动到表达式弹层上不触发 leave
        const isInside =
          clientX > (boundingRect?.left || 0) &&
          clientX < (boundingRect?.right || 0) &&
          clientY > (boundingRect?.top || 0) &&
          clientY < (boundingRect?.bottom || 0);

        // 离开时鼠标依旧在区域
        if (!isInside) {
          renderData.toggleMouseLeave();
        }
      }}
    >
      {/* popover 透传问题的话，类似 semi、ud 都会有 ConfigProvider，可以在这里包裹 */}
      {/* <ConfigProvider getPopupContainer={() => containerRef.current || document.body}> */}
      <div>{node.id}</div>
      {/* </ConfigProvider> */}
    </div>
  );
};`;

export const FixedLayoutPreview = () => (
  <PreviewEditor
    files={{
      'index.tsx': indexCode,
      'data.ts': dataTsCode,
      'use-editor-props.tsx': useEditorPropsCode,
      'node-render.tsx': nodeRenderCode,
    }}
    previewStyle={{
      height: 500,
    }}
    editorStyle={{
      height: 500,
    }}
  >
    <FixedLayout />
  </PreviewEditor>
);

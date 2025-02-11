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
                onChange={(e) => props.node.updateExtInfo({ title: e.currentTarget.value })}
                placeholder="重新编辑标题"
              />
            </div>
          </WorkflowNodeRenderer>
        ),
      },
      onInit: (ctx) => {},
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
    []
  );
  return editorProps;
};

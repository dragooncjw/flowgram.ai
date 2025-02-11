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
  nodeRegistries: FlowNodeRegistry[] // 节点定义
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
      onInit: (ctx) => {
        // 加载数据
        ctx.document.fromJSON(initialData);
      },
      /**
       * 画布销毁
       */
      onDispose: () => {},
    }),
    []
  );
}

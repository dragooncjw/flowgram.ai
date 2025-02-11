import { useRef } from 'react';

import {
  FlowNodeRenderData,
  type FlowNodeEntity,
  useStartDragNode,
} from '@flowgram.ai/fixed-layout-editor';

export const NodeRenderer = ({ node }: { node: FlowNodeEntity }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const renderData = node.getData(FlowNodeRenderData);
  const { dragging } = renderData;

  const nodeRegistry = node.getNodeRegistry();
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
      onMouseDown={(e) => {
        e.stopPropagation();
        startDrag(e, { dragStartEntity: node });
      }}
      onMouseEnter={() => {
        renderData.toggleMouseEnter();
      }}
      onMouseLeave={(e) => {
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
};

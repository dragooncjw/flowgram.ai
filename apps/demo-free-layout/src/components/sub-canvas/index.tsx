import React, { useState, useEffect } from 'react';

import {
  FlowNodeTransformData,
  useNodeRender,
  WorkflowNodeEntity,
  WorkflowNodePortsData,
  WorkflowPortRender,
} from '@flowgram.ai/free-layout-editor';

import './index.less';

interface SubCanvasRenderProps {
  title: string;
  renderPorts: {
    id: string;
    type: 'input' | 'output';
    style: React.CSSProperties;
  }[];
}

export const SubCanvasRender: React.FC<{
  node: WorkflowNodeEntity;
}> = (props) => {
  const { node } = props;
  const { selected, startDrag, ports, selectNode, nodeRef, onFocus, onBlur } = useNodeRender();

  const { title = '', renderPorts = [] } = (node?.getNodeMeta()?.renderSubCanvas?.() ??
    {}) as SubCanvasRenderProps;
  const transform = node.getData<FlowNodeTransformData>(FlowNodeTransformData);
  const [width, setWidth] = useState(transform.bounds.width);
  const [height, setHeight] = useState(transform.bounds.height);

  useEffect(() => {
    const dispose = transform.onDataChange(() => {
      if (width !== transform.bounds.width) {
        setWidth(transform.bounds.width);
      }
      if (height !== transform.bounds.height) {
        setHeight(transform.bounds.height);
      }
    });
    return () => dispose.dispose();
  }, [transform]);

  useEffect(() => {
    const portsData = node.getData<WorkflowNodePortsData>(WorkflowNodePortsData);
    portsData.updateDynamicPorts();
  }, []);

  return (
    <div
      style={{
        width,
        height,
        outline: selected ? '2px solid #4d53e8' : 'none',
      }}
      className="sub-canvas"
      ref={nodeRef}
      data-node-selected={String(selected)}
      onClick={selectNode}
    >
      <div className="sub-canvas-border"></div>
      <div className="sub-canvas-background" data-flow-editor-selectable="true">
        <svg width="100%" height="100%">
          <pattern id="sub-canvas-dot-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" stroke="#eceeef" fillOpacity="0.5" />
          </pattern>
          <rect
            width="100%"
            height="100%"
            fill="url(#sub-canvas-dot-pattern)"
            data-node-panel-container={node.id}
          />
        </svg>
      </div>
      <div
        className="sub-canvas-header"
        draggable={true}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          startDrag(e);
        }}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <p className="sub-canvas-title">{title}</p>
      </div>
      {renderPorts.map((p) => (
        <div
          key={'canvas-port' + p.id}
          className="sub-canvas-port"
          data-port-id={p.id}
          data-port-type={p.type}
          style={p.style}
        />
      ))}
      {ports.map((p) => (
        <WorkflowPortRender key={p.id} entity={p} />
      ))}
    </div>
  );
};

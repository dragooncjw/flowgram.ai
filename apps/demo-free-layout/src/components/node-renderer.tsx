import React from 'react';

import {
  WorkflowNodeProps,
  WorkflowNodeRenderer,
  useNodeRender,
} from '@flowgram.ai/free-layout-editor';

import { NodeTitle } from './node-title';

export interface NodeRendererProps extends WorkflowNodeProps {}
/**
 * Default Node
 * @param props
 * @constructor
 */
export const NodeRenderer: React.FC<NodeRendererProps> = (props) => (
  <WorkflowNodeRenderer className="demo-node" node={props.node}>
    <NodeTitle node={props.node} />
    <div style={{ padding: '0 10px 10px' }}>{props.children}</div>
  </WorkflowNodeRenderer>
);

/**
 * Multi Ports
 * @param props
 * @constructor
 */
export const ConditionNodeRenderer: React.FC<NodeRendererProps> = (props) => {
  const nodeRender = useNodeRender();
  const nodeForm = nodeRender.form;
  return (
    <WorkflowNodeRenderer className="demo-node" node={props.node}>
      <NodeTitle node={props.node} />
      <div className="port-if" data-port-id="if" data-port-type="output" />
      <div className="port-else" data-port-id="else" data-port-type="output" />
      <div style={{ padding: '0 10px 10px' }}>{props.children}</div>
      {nodeForm?.render?.()}
    </WorkflowNodeRenderer>
  );
};

/**
 * Error Node
 * @param props
 * @constructor
 */
export const ErrorNodeRenderer: React.FC<NodeRendererProps> = (props) => (
  <WorkflowNodeRenderer className="demo-node" node={props.node}>
    <NodeTitle node={props.node} />
    <div className="port-error-a" data-port-id="a" data-port-type="output" />
    <div className="port-error-b" data-port-id="b" data-port-type="output" />
    <div style={{ padding: '0 10px 10px' }}>{props.children}</div>
  </WorkflowNodeRenderer>
);

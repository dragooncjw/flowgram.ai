import React from 'react';

import {
  Command,
  CommandRegistry,
  FlowNodeEntity,
  FlowSelectConfigEntity,
  Rectangle,
} from '@flowgram.ai/free-layout-editor';
import { IconDelete } from '@douyinfe/semi-icons';

export const SelectBoxPopover: React.FunctionComponent<{
  children: JSX.Element;
  bounds: Rectangle;
  flowSelectConfig: FlowSelectConfigEntity;
  commandRegistry: CommandRegistry;
}> = ({ bounds, children, flowSelectConfig, commandRegistry }) => {
  const selectNodes = flowSelectConfig.selectedNodes;

  if (selectNodes.length === 1 && (selectNodes[0] as FlowNodeEntity).childrenLength <= 1) {
    return <></>;
  }

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: bounds.right,
          top: bounds.top,
          transform: 'translate(-100%, -100%)',
        }}
      >
        <div
          style={{ cursor: 'pointer' }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => {
            commandRegistry.executeCommand(Command.Default.DELETE);
          }}
        >
          <IconDelete />
        </div>
      </div>
      {children}
    </>
  );
};

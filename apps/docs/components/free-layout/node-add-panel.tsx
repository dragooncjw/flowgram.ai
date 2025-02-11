import React from 'react';

import { WorkflowDragService, useService } from '@flowgram.ai/free-layout-editor';

const cardkeys = ['custom', 'any-node'];

export const NodeAddPanel: React.FC = (props) => {
  const startDragSerivce = useService<WorkflowDragService>(WorkflowDragService);

  return (
    <div className="demo-sidebar">
      {cardkeys.map((key) => (
        <div
          key={key}
          className="demo-card"
          onMouseDown={(e) => startDragSerivce.startDragCard(key, e, {})}
        >
          {key}
        </div>
      ))}
    </div>
  );
};

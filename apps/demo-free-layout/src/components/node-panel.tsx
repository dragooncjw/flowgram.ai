import { FC } from 'react';

import type { NodePanelRenderProps } from '@flowgram.ai/free-node-panel-plugin';
import { usePlayground } from '@flowgram.ai/free-layout-editor';
import { Popover } from '@douyinfe/semi-ui';

const nodeTypes = ['base', 'condition', 'error', 'loop'];

export const NodePanel: FC<NodePanelRenderProps> = (props) => {
  const { onSelect, position, onClose, panelProps } = props;
  const isFixed = panelProps?.isFixed;
  const playground = usePlayground();

  return (
    <Popover
      style={{ opacity: 1 }}
      hideArrow
      placement="bottom"
      onClickOutSide={() => onClose()}
      content={
        <div
          className="node-panel-render"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#fff',
            borderRadius: 8,
            boxShadow: '0 6px 8px 0 rgba(28, 31, 35, 0.03)',
            padding: 12,
            fontSize: 16,
            gap: 6,
          }}
        >
          {nodeTypes.map((nodeType) => (
            <div
              className={`type-option-${nodeType}`}
              key={nodeType}
              onClick={(event) => {
                const scrollX = playground.config.config.scrollX;
                const scrollY = playground.config.config.scrollY;
                onSelect({
                  nodeType,
                  selectEvent: {
                    ...event,
                    clientX: isFixed ? event.clientX + scrollX : event.clientX,
                    clientY: isFixed ? event.clientY + scrollY : event.clientY,
                  },
                });
              }}
              style={{
                width: '100%',
                cursor: 'pointer',
                padding: 6,
              }}
            >
              {nodeType}
            </div>
          ))}
        </div>
      }
      trigger="click"
      visible={true}
    >
      <div
        style={{
          position: isFixed ? 'fixed' : 'absolute',
          top: position.y,
          left: position.x,
          width: 0,
          height: 0,
        }}
      ></div>
    </Popover>
  );
};

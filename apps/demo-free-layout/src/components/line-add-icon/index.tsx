import { WorkflowNodePanelService } from '@flowgram.ai/free-node-panel-plugin';
import { LineRenderProps } from '@flowgram.ai/free-lines-plugin';
import { IPoint, LineColors, LineType, useService } from '@flowgram.ai/free-layout-editor';

import { AddIcon } from './icon';

export const LineAddIcon = (props: LineRenderProps) => {
  const { line, selected, color, lineType } = props;
  const { fromPort, toPort } = line;
  const { to, from } = line.position;

  const nodePanelService = useService(WorkflowNodePanelService);

  const activate: boolean = selected || color === LineColors.HOVER;
  const isBezierLine: boolean = lineType === LineType.BEZIER;
  const mid: IPoint = {
    x: (to.x + from.x) / 2,
    y: (to.y + from.y) / 2,
  };

  if (!activate) {
    return <></>;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: isBezierLine ? '50%' : mid.x,
        top: isBezierLine ? '50%' : mid.y,
        width: 26,
        height: 26,
        transform: 'translate(-50%, -60%)',
        borderRadius: '50%',
        backgroundColor: 'var(--g-editor-background, #f2f3f5)',
        cursor: 'pointer',
      }}
      onClick={async () => {
        const node = await nodePanelService.call({
          panelPosition: {
            x: (line.position.from.x + line.position.to.x) / 2,
            y: (line.position.from.y + line.position.to.y) / 2,
          },
          fromPort: fromPort,
          toPort: toPort,
          enableBuildLine: true,
          enableAutoOffset: true,
        });
        if (!node) {
          return;
        }
        line.dispose();
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'translate(1px, 1px)',
          color: color,
        }}
      >
        <AddIcon
          style={{
            width: 24,
            height: 24,
          }}
        />
      </div>
    </div>
  );
};

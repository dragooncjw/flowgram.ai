import { useState } from 'react';

import { HistoryService } from '@flowgram.ai/history';
import { useService } from '@flowgram.ai/free-layout-editor';
import { Tooltip, IconButton, Divider } from '@douyinfe/semi-ui';
import { IconUndo, IconRedo } from '@douyinfe/semi-icons';

import { AddNode } from '../components/add-node';
import { ZoomSelect } from './zoom-select';
import { ToolContainer, ToolSection } from './styles';
import { MinimapSwitch } from './minimap-switch';
import { Minimap } from './minimap';
import { Interactive } from './interactive';
import { AutoLayout } from './auto-layout';

export const DemoTools = () => {
  const historyService = useService<HistoryService>(HistoryService);
  const [minimapVisible, setMinimapVisible] = useState(false);

  return (
    <ToolContainer className="demo-free-layout-tools">
      <ToolSection>
        <Interactive />
        <AutoLayout />
        <ZoomSelect />
        <MinimapSwitch minimapVisible={minimapVisible} setMinimapVisible={setMinimapVisible} />
        <Minimap visible={minimapVisible} />
        <Tooltip content="Undo">
          <IconButton
            icon={<IconUndo />}
            disabled={!historyService.canUndo}
            onClick={() => historyService.undo()}
          />
        </Tooltip>
        <Tooltip content="Redo">
          <IconButton
            icon={<IconRedo />}
            disabled={!historyService.canRedo}
            onClick={() => historyService.redo()}
          />
        </Tooltip>
        <Divider layout="vertical" style={{ height: '16px' }} margin={3} />
        <AddNode />
      </ToolSection>
    </ToolContainer>
  );
};

import { useRef } from 'react';

import { debounce } from 'lodash-es';
import { WorkflowNodePanelService } from '@flowgram.ai/free-node-panel-plugin';
import {
  FlowNodeEntity,
  FlowNodeTransformData,
  usePlayground,
  useService,
} from '@flowgram.ai/free-layout-editor';
import { Button } from '@douyinfe/semi-ui';
import { IconPlus } from '@douyinfe/semi-icons';

export const AddNode = () => {
  const nodePanelService = useService(WorkflowNodePanelService);
  const buttonRef = useRef<Button>(null);
  const playground = usePlayground();

  const handleAddNode = async (rect: DOMRect) => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const node = await nodePanelService.call({
      panelPosition: {
        x: screenWidth / 2 + 90,
        y: screenHeight - 250,
      },
      panelProps: {
        isFixed: true,
      },
    });
    if (!node) {
      return;
    }
    playground.scrollToView({
      bounds: (node as FlowNodeEntity).getData<FlowNodeTransformData>(FlowNodeTransformData)!
        .bounds,
      scrollToCenter: true,
    });
  };
  const debounceAddNode = debounce(handleAddNode, 100);
  return (
    <>
      <Button
        ref={buttonRef}
        icon={<IconPlus />}
        color="highlight"
        onClick={(event) => {
          debounceAddNode.cancel();
          handleAddNode(event.currentTarget.getBoundingClientRect());
        }}
      >
        Add Node
      </Button>
    </>
  );
};

import { useCallback } from 'react';

import { FlowNodeEntity, useNodeRender } from '@flowgram.ai/fixed-layout-editor';
import { ConfigProvider } from '@douyinfe/semi-ui';

import { NodeRenderContext } from '../../context';
import { Container } from './styles';

export const BaseNode = ({ node }: { node: FlowNodeEntity }) => {
  /**
   * Provides methods related to node rendering
   */
  const nodeRender = useNodeRender();
  /**
   * It can only be used when nodeEngine is enabled
   */
  const form = nodeRender.form;

  /**
   * Tooltip scales with the node
   */
  const getPopupContainer = useCallback(() => node.renderData.node || document.body, []);

  return (
    <ConfigProvider getPopupContainer={getPopupContainer}>
      <Container
        onMouseEnter={nodeRender.onMouseEnter}
        onMouseLeave={nodeRender.onMouseLeave}
        style={{
          ...(nodeRender.isBlockOrderIcon || nodeRender.isBlockIcon ? { width: 260 } : {}),
        }}
      >
        <NodeRenderContext.Provider value={nodeRender}>{form?.render()}</NodeRenderContext.Provider>
      </Container>
    </ConfigProvider>
  );
};

import { useCallback } from 'react';

import { usePlayground, usePlaygroundTools } from '@flowgram.ai/free-layout-editor';
import { IconButton, Tooltip } from '@douyinfe/semi-ui';
import { IconGridView } from '@douyinfe/semi-icons';

export const AutoLayout = () => {
  const tools = usePlaygroundTools();
  const playground = usePlayground();
  const autoLayout = useCallback(async () => {
    await tools.autoLayout();
  }, [tools]);

  if (playground.config.readonly) {
    return <></>;
  }

  return (
    <Tooltip content={'Optimize Layout'}>
      <IconButton onClick={autoLayout} icon={<IconGridView />} />
    </Tooltip>
  );
};

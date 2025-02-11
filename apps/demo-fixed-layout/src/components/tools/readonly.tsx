import { useCallback, useEffect } from 'react';

import { usePlayground, useRefresh } from '@flowgram.ai/fixed-layout-editor';
import { IconButton } from '@douyinfe/semi-ui';
import { IconUnlock, IconLock } from '@douyinfe/semi-icons';

export const Readonly = () => {
  const playground = usePlayground();
  const toggleReadonly = useCallback(() => {
    playground.config.readonly = !playground.config.readonly;
  }, [playground]);
  const refresh = useRefresh();

  useEffect(() => {
    const disposable = playground.config.onReadonlyOrDisabledChange(() => refresh());
    return () => disposable.dispose();
  }, [playground]);

  return playground.config.readonly ? (
    <IconButton theme="borderless" type="tertiary" icon={<IconLock />} onClick={toggleReadonly} />
  ) : (
    <IconButton theme="borderless" type="tertiary" icon={<IconUnlock />} onClick={toggleReadonly} />
  );
};

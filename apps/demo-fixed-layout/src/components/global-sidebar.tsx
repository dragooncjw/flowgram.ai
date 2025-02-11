import { useCallback, useContext } from 'react';

import { getNodeForm } from '@flowgram.ai/fixed-layout-editor';
import { Input, SideSheet } from '@douyinfe/semi-ui';

import { GlobalSidebarContext } from '../context';

export const GlobalSidebar = () => {
  const { node, setNode } = useContext(GlobalSidebarContext);
  if (!node) {
    return null;
  }
  const form = getNodeForm(node);
  const handleClose = useCallback(() => {
    setNode(undefined);
  }, []);
  return (
    <SideSheet title={node?.id} visible={Boolean(node)} onCancel={handleClose}>
      <Input
        defaultValue={form!.getValueIn('title') || ''}
        onChange={(v) => {
          form?.setValueIn('title', v);
        }}
      />
      {}
    </SideSheet>
  );
};

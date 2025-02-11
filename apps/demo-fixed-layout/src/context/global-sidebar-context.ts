import React from 'react';

import { FlowNodeEntity } from '@flowgram.ai/fixed-layout-editor';

export const GlobalSidebarContext = React.createContext<{
  node?: FlowNodeEntity;
  setNode: (_node?: FlowNodeEntity) => void;
}>({
  node: undefined,
  setNode: () => {},
});

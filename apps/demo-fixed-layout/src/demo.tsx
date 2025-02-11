import { useState } from 'react';

import {
  EditorRenderer,
  FixedLayoutEditorProvider,
  FlowNodeEntity,
} from '@flowgram.ai/fixed-layout-editor';

import { FlowNodeRegistries } from './nodes';
import { initialData } from './initial-data';
import { useEditorProps } from './hooks/use-editor-props';
import { GlobalSidebarContext } from './context';
import { GlobalSidebar } from './components/global-sidebar';
import { DemoTools } from './components';

import '@flowgram.ai/fixed-layout-editor/index.css';

export const App = () => {
  /**
   * Editor Config
   */
  const editorProps = useEditorProps(initialData, FlowNodeRegistries);
  const [node, setNode] = useState<FlowNodeEntity | undefined>();

  return (
    <GlobalSidebarContext.Provider
      value={{
        node,
        setNode,
      }}
    >
      <div className="doc-feature-overview">
        <FixedLayoutEditorProvider {...editorProps}>
          <EditorRenderer />
          <DemoTools />
          <GlobalSidebar />
        </FixedLayoutEditorProvider>
      </div>
    </GlobalSidebarContext.Provider>
  );
};

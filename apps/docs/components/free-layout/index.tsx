import { EditorRenderer, FreeLayoutEditorProvider } from '@flowgram.ai/free-layout-editor';

import { useEditorProps } from './use-editor-props';
import { NodeAddPanel } from './node-add-panel';
import '@flowgram.ai/free-layout-editor/index.css';
import './index.css';

export const FreeLayoutDemo = () => {
  const editorProps = useEditorProps();
  return (
    <FreeLayoutEditorProvider {...editorProps}>
      <div className="demo-container">
        <div className="demo-layout">
          <NodeAddPanel />
          <EditorRenderer className="demo-editor" />
        </div>
      </div>
    </FreeLayoutEditorProvider>
  );
};

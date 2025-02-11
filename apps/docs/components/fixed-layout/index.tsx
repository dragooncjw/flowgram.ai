// 加载样式文件
import '@flowgram.ai/fixed-layout-editor/index.css';
import { PlaygroundTools } from '@flowgram.ai/fixed-semi-materials';
import { FixedLayoutEditorProvider, EditorRenderer } from '@flowgram.ai/fixed-layout-editor';

import { useEditorProps } from './use-editor-props';
import { nodeRegistries, initialData } from './data';

export const FixedLayout = () => {
  const editorProps = useEditorProps(initialData, nodeRegistries);
  return (
    <FixedLayoutEditorProvider {...editorProps}>
      <div className="demo-container">
        <EditorRenderer>{/* add child panel here */}</EditorRenderer>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 10,
          top: 10,
          zIndex: 10,
        }}
      >
        <PlaygroundTools layoutText={'isHorizontal'} />
      </div>
    </FixedLayoutEditorProvider>
  );
};

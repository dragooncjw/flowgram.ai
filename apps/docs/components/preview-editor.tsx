import { useMemo } from 'react';

import { useDark } from '@rspress/core/runtime';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackFiles,
} from '@codesandbox/sandpack-react';

export const PreviewEditor = ({
  files,
  children,
  previewStyle,
  editorStyle,
}: {
  files: SandpackFiles;
  children: JSX.Element;
  previewStyle?: React.CSSProperties;
  editorStyle?: React.CSSProperties;
}) => {
  const dark = useDark();
  const theme = useMemo(() => (dark ? 'dark' : 'light'), [dark]);

  return (
    <SandpackProvider
      template="react"
      theme={theme}
      files={files}
      onChange={(v) => {
        console.log('debugger', v);
      }}
    >
      <SandpackLayout style={previewStyle}>{children}</SandpackLayout>
      <SandpackLayout>
        <SandpackCodeEditor style={editorStyle} readOnly />
      </SandpackLayout>
    </SandpackProvider>
  );
};

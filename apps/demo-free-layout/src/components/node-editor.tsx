import { useRef, useCallback, useMemo } from 'react';

import Editor from '@monaco-editor/react';
import { logger, FlowNodeEntity, useEntityFromContext } from '@flowgram.ai/free-layout-editor';
import { FlowNodeFormData, getFormModel, IFormMeta } from '@flowgram.ai/form-core';
import { Button, Toast } from '@douyinfe/semi-ui';

export function NodeEditor() {
  const editorRef = useRef(null);

  const node = useEntityFromContext<FlowNodeEntity>();
  const formData = node.getData<FlowNodeFormData>(FlowNodeFormData);
  const formModel = getFormModel(node);
  const initialSchema = useMemo(() => JSON.stringify(formModel.formMeta.root, undefined, 2), []);

  // @ts-ignore
  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }

  const onSubmit = useCallback(() => {
    // @ts-ignore
    const editorValue = editorRef.current?.getValue();
    logger.log(editorValue);

    try {
      const newRootSchema = JSON.parse(editorValue);
      const newFormMeta: IFormMeta = {
        root: newRootSchema,
        options: formModel.formMeta.options,
      };
      formData.recreateForm(newFormMeta);
      Toast.success('Node update succeeded.');
    } catch (e) {
      Toast.error('Failed to update node. See console for error details.');
      logger.log('Node update failed.', e);
    }
  }, []);

  return (
    <>
      <Editor
        height={448}
        defaultLanguage="json"
        defaultValue={initialSchema}
        onMount={handleEditorDidMount}
      />
      <Button onClick={onSubmit} size="small">
        Submit
      </Button>
    </>
  );
}

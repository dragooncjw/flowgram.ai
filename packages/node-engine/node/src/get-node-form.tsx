import React from 'react';

import { Event } from '@flowgram.ai/utils';
import { FlowNodeFormData, NodeRender, OnFormValuesChangePayload } from '@flowgram.ai/form-core';
import { toForm, FieldValue, FieldName, FormState } from '@flowgram.ai/form';
import { FlowNodeEntity } from '@flowgram.ai/document';

import { FormModelV2 } from './form-model-v2';

export interface NodeFormProps<TValues> {
  /**
   * The initialValues of the form.
   */
  initialValues: TValues;
  /**
   * Form values. Returns a deep copy of the data in the store.
   */
  values: TValues;
  /**
   * Form state
   */
  state: FormState;
  /**
   * Get value in certain path
   * @param name path
   */
  getValueIn<TValue = FieldValue>(name: FieldName): TValue;

  /**
   * Set value in certain path.
   * It will trigger the re-rendering of the Field Component if a Field is related to this path
   * @param name path
   */
  setValueIn<TValue>(name: FieldName, value: TValue): void;
  /**
   * Render form
   */
  render: () => React.ReactNode;
  /**
   * Form value change event
   */
  onFormValuesChange: Event<OnFormValuesChangePayload>;
}

/**
 * Only support FormModelV2
 * @param node
 */
export function getNodeForm<TValues = any>(
  node: FlowNodeEntity
): NodeFormProps<TValues> | undefined {
  const formModel = (node.getData<FlowNodeFormData>(FlowNodeFormData)?.formModel as FormModelV2)
    ?.nativeFormModel;
  if (!formModel) return undefined;
  const result: NodeFormProps<TValues> = {
    ...toForm<TValues>(formModel),
    render: () => <NodeRender node={node} />,
    onFormValuesChange: formModel.onFormValuesChange,
  };
  Object.defineProperty(result, '_formModel', {
    enumerable: false,
    get() {
      return formModel;
    },
  });
  return result;
}

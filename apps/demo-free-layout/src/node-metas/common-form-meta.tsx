import {
  Field,
  FieldRenderProps,
  FormMeta,
  FormRenderProps,
} from '@flowgram.ai/free-layout-editor';
import Label from '@douyinfe/semi-ui/lib/es/form/label';
import { TextArea } from '@douyinfe/semi-ui';

import { VariableSelector } from '../plugins/variable-plugin/variable-selector';

interface CommonFormData {
  outputs: Record<string, any>;
}

const CommonRender = ({ form }: FormRenderProps<CommonFormData>) => (
  <>
    <Label>inputs</Label>
    <Field name="inputs">
      {({ field }: FieldRenderProps<string | undefined>) => (
        <VariableSelector value={field.value} onChange={field.onChange} />
      )}
    </Field>
    <Label>outputs</Label>
    <Field name="outputs">
      {({ field }: FieldRenderProps<string | undefined>) => (
        <TextArea
          value={JSON.stringify(field.value, null, 2)}
          onChange={(v) => field.onChange(JSON.parse(v))}
        />
      )}
    </Field>
  </>
);

export const CommonFormMeta: FormMeta = {
  render: (props) => <CommonRender {...props} />,
};

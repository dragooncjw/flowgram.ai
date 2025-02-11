import { nanoid } from 'nanoid';
import { VariableDeclarationJSON } from '@flowgram.ai/free-layout-editor';
import { Input, Select, Space } from '@douyinfe/semi-ui';

const typeMappings: Record<string, any> = {
  Boolean: 'Boolean',
  String: 'String',
  Number: 'Number',
  Integer: 'Integer',
  Map: {
    kind: 'Map',
    valueType: 'String',
  },
  ['Boolean[]']: {
    kind: 'Array',
    items: 'Boolean',
  },
  ['String[]']: {
    kind: 'Array',
    items: 'String',
  },
  ['Number[]']: {
    kind: 'Array',
    items: 'Number',
  },
  ['Integer[]']: {
    kind: 'Array',
    items: 'Integer',
  },
};

const defaultVariable = { type: 'Boolean', meta: { title: 'Variable_' } };

export function VariableOutput({
  value,
  onChange,
}: {
  value?: VariableDeclarationJSON;
  onChange: (v?: VariableDeclarationJSON) => void;
}) {
  const variable: VariableDeclarationJSON = value || { key: nanoid(), ...defaultVariable };
  const { meta, type } = variable;

  const updateName = (title: string) => {
    onChange({
      ...variable,
      meta: {
        ...meta,
        title,
      },
    });
  };

  const updateType = (type: string) => {
    onChange({
      ...variable,
      type: typeMappings[type],
    });
  };

  let typeValue: string = 'Boolean';
  if (typeof type === 'string') {
    typeValue = type;
  } else if (type?.kind === 'Array') {
    typeValue = type.items + '[]';
  } else if (type?.kind === 'Map') {
    typeValue = 'Map';
  }

  return (
    <Space>
      <Input value={meta?.title} onChange={(value) => updateName(value)} />
      <Select
        style={{ width: 120 }}
        showClear
        value={typeValue}
        onChange={(_type) => updateType(_type! as string)}
        optionList={Object.keys(typeMappings).map((_value) => ({ value: _value }))}
      />
    </Space>
  );
}

export const variableOutput = {
  key: 'VariableOutput',
  component: VariableOutput,
};

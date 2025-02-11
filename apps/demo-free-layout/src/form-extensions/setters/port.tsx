import { type CSSProperties } from 'react';

import type { SetterComponentProps } from '@flowgram.ai/form-core';

type PortProps = SetterComponentProps<{
  portID: string;
  portType: 'input' | 'output';
  styles: CSSProperties;
}>;

export const Port = ({ options }: PortProps) => {
  const { portID, portType, styles } = options;
  return <div data-port-id={portID} data-port-type={portType} style={styles} />;
};

export const port = {
  key: 'Port',
  component: Port,
};

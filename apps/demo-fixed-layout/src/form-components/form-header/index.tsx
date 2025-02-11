import { useContext } from 'react';

import {
  Command,
  Field,
  FieldRenderProps,
  useClientContext,
} from '@flowgram.ai/fixed-layout-editor';
import { IconButton, Dropdown, Typography, Button } from '@douyinfe/semi-ui';
import { IconSmallTriangleDown, IconSmallTriangleLeft } from '@douyinfe/semi-icons';
import { IconMore } from '@douyinfe/semi-icons';

import { Feedback } from '../feedback';
import { FlowNodeRegistry } from '../../typings';
import { GlobalSidebarContext, NodeRenderContext } from '../../context';
import { getIcon } from './utils';
import { Header, Operators, Title } from './styles';

const { Text } = Typography;

function DropdownContent() {
  const { node, deleteNode } = useContext(NodeRenderContext);
  const clientContext = useClientContext();
  const { setNode } = useContext(GlobalSidebarContext);
  const registry = node.getNodeRegistry<FlowNodeRegistry>();
  const handleOpenEditSidebar = () => {
    setNode(node);
  };
  const handleCopy = () => {
    clientContext.playground.commandService.executeCommand(Command.Default.COPY, node);
  };
  return (
    <Dropdown.Menu>
      <Dropdown.Item onClick={handleOpenEditSidebar}>Edit</Dropdown.Item>
      <Dropdown.Item onClick={handleCopy} disabled={registry.meta!.copyDisable === true}>
        Copy
      </Dropdown.Item>
      <Dropdown.Item
        onClick={deleteNode}
        disabled={!!(registry.canDelete?.(clientContext, node) || registry.meta!.deleteDisable)}
      >
        Delete
      </Dropdown.Item>
    </Dropdown.Menu>
  );
}

export function FormHeader() {
  const { node, expanded, startDrag, toggleExpand, readonly } = useContext(NodeRenderContext);

  return (
    <Header
      onMouseDown={(e) => {
        // trigger drag node
        startDrag(e);
        e.stopPropagation();
      }}
    >
      {getIcon(node)}
      <Title>
        <Field name="title">
          {({ field: { value, onChange }, fieldState }: FieldRenderProps<string>) => (
            <>
              <Text ellipsis={{ showTooltip: true }}>{value}</Text>
              <Feedback errors={fieldState?.errors} />
            </>
          )}
        </Field>
      </Title>
      <Button
        type="primary"
        icon={expanded ? <IconSmallTriangleDown /> : <IconSmallTriangleLeft />}
        size="small"
        theme="borderless"
        onClick={toggleExpand}
      />
      {readonly ? undefined : (
        <Operators>
          <Dropdown trigger="hover" position="bottomRight" render={<DropdownContent />}>
            <IconButton
              color="secondary"
              size="small"
              theme="borderless"
              icon={<IconMore />}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        </Operators>
      )}
    </Header>
  );
}

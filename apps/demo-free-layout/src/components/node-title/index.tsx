import { WorkflowNodeEntity, useNodeRender } from '@flowgram.ai/free-layout-editor';
import { Dropdown, IconButton, Typography } from '@douyinfe/semi-ui';
import { IconMore } from '@douyinfe/semi-icons';

import { getIcon } from './utils';
import { Header, Operators, Title } from './styles';

const { Text } = Typography;

export const NodeTitle = ({ node }: { node: WorkflowNodeEntity }) => {
  const { deleteNode } = useNodeRender();
  return (
    <Header>
      {getIcon(node)}
      <Title>
        <Text ellipsis={{ showTooltip: true }}>{node.id}</Text>
      </Title>
      <Operators>
        <Dropdown
          trigger="hover"
          position="bottomRight"
          render={
            <Dropdown.Menu>
              <Dropdown.Item onClick={deleteNode}>Delete</Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <IconButton
            color="secondary"
            size="small"
            icon={<IconMore />}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      </Operators>
    </Header>
  );
};

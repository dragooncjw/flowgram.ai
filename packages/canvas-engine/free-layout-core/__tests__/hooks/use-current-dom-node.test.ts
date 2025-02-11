import { renderHook } from '@testing-library/react-hooks';

import { createDocument, createHookWrapper } from '../utils.mock';
import { useCurrentDomNode } from '../../src';

it('use-current-dom-node', async () => {
  const { container } = await createDocument();
  const wrapper = createHookWrapper(container);
  const { result } = renderHook(() => useCurrentDomNode(), {
    wrapper,
  });
  expect(result.current.tagName).toEqual('DIV');
});

import { test, expect } from '@playwright/test';

import PageModel from './models';

test.describe('node operations', () => {
  let editorPage: PageModel;

  test.beforeEach(async ({ page }) => {
    editorPage = new PageModel(page);
    await page.goto('http://localhost:3000');
  });

  test('node preview', async () => {
    const defaultNodeCount = await editorPage.getNodeCount();
    expect(defaultNodeCount).toEqual(10);
  });

  test('add node', async () => {
    await editorPage.addConditionNode();
    const defaultNodeCount = await editorPage.getNodeCount();
    expect(defaultNodeCount).toEqual(11);
  });

  // test('delete node', async () => {
  //   expect(await editorPage.getNodeCount()).to.eq(2);
  //   await editorPage.addNode('base');
  //   expect(await editorPage.getNodeCount()).to.eq(3);
  //   await editorPage.deleteNode('base_2');
  //   expect(await editorPage.getNodeCount()).to.eq(2);
  // });
});

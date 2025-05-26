import type { Page } from '@playwright/test';

class FreeLayoutModel {
  public readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // 获取节点数量
  async getNodeCount() {
    return await this.page.evaluate(
      () => document.querySelectorAll('[data-testid="sdk.workflow.canvas.node"]').length
    );
  }

  // 获取连线数量
  async getLineCount() {
    return await this.page.evaluate(
      () => document.querySelectorAll('[data-testid="sdk.workflow.canvas.line"]').length
    );
  }

  async getLine(options: {
    fromNodeID: string;
    toNodeID: string;
    fromPortID: string;
    toPortID: string;
  }) {
    const { fromNodeID, toNodeID, fromPortID, toPortID } = options;
    const line = this.page
      .locator(
        `[data-testid="sdk.workflow.canvas.line"][data-from-node-id="${fromNodeID}"][data-to-node-id="${toNodeID}"][data-from-port-id="${fromPortID}"][data-to-port-id="${toPortID}"]`
      )
      .locator('.gedit-flow-activity-edge');
    await line.waitFor({ state: 'visible' });
    return line;
  }

  // 获取当前为选中态的节点数量
  async getSelectedNodeCount(): Promise<number> {
    const count = await this.page.evaluate(
      () =>
        [].map.call(
          document.querySelectorAll(
            '[data-testid="sdk.workflow.canvas.node"] [data-node-selected="true"]'
          ),
          (el: HTMLElement) => el.closest('[data-testid="sdk.workflow.canvas.node"]')
        ).length
    );
    return count;
  }

  async addConditionNode() {
    const preConditionNodes = await this.page.locator('.gedit-flow-activity-node');
    const preCount = await preConditionNodes.count();
    const button = this.page.locator('[data-testid="demo.free-layout.add-node"]');
    // open add node panel
    await button.click();
    await this.page.waitForSelector('[data-testid="demo-free-node-list-condition"]');
    // add condition
    const conditionItem = this.page.locator('[data-testid="demo-free-node-list-condition"]');
    await conditionItem.click();
    // determine whether the node was successfully added
    await this.page.waitForFunction(
      (expectedCount) =>
        document.querySelectorAll('.gedit-flow-activity-node').length === expectedCount,
      preCount + 1
    );
  }
}

export default FreeLayoutModel;

import ReactDOM from 'react-dom';
import React, { ReactNode, useCallback, useState } from 'react';

import { inject, injectable } from 'inversify';
import { domUtils } from '@flowgram.ai/utils';
import {
  nanoid,
  WorkflowDocument,
  WorkflowHoverService,
  WorkflowLineEntity,
  WorkflowNodeEntity,
  WorkflowPortEntity,
  WorkflowSelectService,
} from '@flowgram.ai/free-layout-core';
import { Layer, observeEntities, observeEntityDatas, TransformData } from '@flowgram.ai/core';

import { LineRenderProps, LinesLayerOptions } from '../type';
import { LineRender } from '../components/lines';

@injectable()
export class LinesLayer extends Layer<LinesLayerOptions> {
  static type = 'WorkflowLinesLayer';

  @inject(WorkflowHoverService) hoverService: WorkflowHoverService;

  @inject(WorkflowSelectService) selectService: WorkflowSelectService;

  @observeEntities(WorkflowLineEntity) readonly lines: WorkflowLineEntity[];

  @observeEntities(WorkflowPortEntity) readonly ports: WorkflowPortEntity[];

  @observeEntityDatas(WorkflowNodeEntity, TransformData)
  readonly trans: TransformData[];

  @inject(WorkflowDocument) protected workflowDocument: WorkflowDocument;

  private layerID = nanoid();

  private mountedLines: Map<
    string,
    {
      line: WorkflowLineEntity;
      portal: ReactNode;
      version: string;
    }
  > = new Map();

  private _version = 0;

  /**
   * 节点线条
   */
  public node = domUtils.createDivWithClass('gedit-playground-layer gedit-flow-lines-layer');

  public onZoom(scale: number): void {
    this.node.style.transform = `scale(${scale})`;
  }

  public onReady() {
    this.pipelineNode.appendChild(this.node);
    this.toDispose.pushAll([
      this.selectService.onSelectionChanged(() => this.render()),
      this.hoverService.onHoveredChange(() => this.render()),
      this.workflowDocument.linesManager.onForceUpdate(() => {
        this.mountedLines.clear();
        this.bumpVersion();
        this.render();
      }),
    ]);
  }

  public dispose() {
    this.mountedLines.clear();
  }

  public render(): JSX.Element {
    const [, _refresh] = useState({});
    const refresh = useCallback(() => {
      _refresh({});
    }, []);

    const lines = this.lines.map((line) => this.renderLine(line, refresh));
    return <>{lines}</>;
  }

  // 用来绕过 memo
  private bumpVersion() {
    this._version = this._version + 1;
    if (this._version === Number.MAX_SAFE_INTEGER) {
      this._version = 0;
    }
  }

  private lineProps(line: WorkflowLineEntity, refresh: () => void): LineRenderProps {
    const { lineType } = this.workflowDocument.linesManager;
    const selected = this.selectService.isSelected(line.id);
    const { version: lineVersion, bezierDataVersion, color } = line;
    /**
     * NOTICE 这里需要使用 requestAnimationFrame 来确保在下一帧执行，避免性能问题
     * 原因：由于本函数上游修改过 DOM，refreshBezier 内部获取端口位置逻辑会调用 getBoundingClientRect，从而引发浏览器强制重排
     */
    requestAnimationFrame(() => {
      line.refreshBezier();
      if (line.bezierDataVersion !== bezierDataVersion) {
        // 如果贝塞尔数据版本发生变化，则需要重新渲染
        refresh();
      }
    });
    const version = `${this._version}:${lineVersion}:${bezierDataVersion}:${lineType}:${color}:${selected}`;
    return {
      key: line.id,
      color: line.color,
      selected,
      line,
      lineType,
      version,
      strokePrefix: this.layerID,
    };
  }

  private lineComponent(props: LineRenderProps): ReactNode {
    const RenderInsideLine = this.options.renderInsideLine ?? (() => <></>);
    return (
      <LineRender {...props}>
        <RenderInsideLine {...props} />
      </LineRender>
    );
  }

  private renderLine(line: WorkflowLineEntity, refresh: () => void): ReactNode {
    const lineProps = this.lineProps(line, refresh);
    const cache = this.mountedLines.get(line.id);
    const isCached = cache !== undefined;
    const { portal: cachedPortal, version: cachedVersion } = cache ?? {};
    if (isCached && cachedVersion === lineProps.version) {
      // 如果已有缓存且版本相同，则直接返回缓存的 portal
      return cachedPortal;
    }
    if (!isCached) {
      // 如果缓存不存在，则将 line 挂载到 renderElement 上
      this.renderElement.appendChild(line.node);
      line.onDispose(() => {
        this.mountedLines.delete(line.id);
        line.node.remove();
      });
    }
    // 刷新缓存
    const portal = ReactDOM.createPortal(this.lineComponent(lineProps), line.node);
    this.mountedLines.set(line.id, { line, portal, version: lineProps.version });
    return portal;
  }

  private get renderElement(): HTMLElement {
    if (typeof this.options.renderElement === 'function') {
      const element = this.options.renderElement();
      if (element) {
        return element;
      }
    } else if (typeof this.options.renderElement !== 'undefined') {
      return this.options.renderElement as HTMLElement;
    }
    return this.node;
  }
}

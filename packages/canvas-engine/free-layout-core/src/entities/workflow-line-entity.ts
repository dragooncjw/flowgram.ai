import { isEqual } from 'lodash-es';
import { Bezier } from 'bezier-js';
import { domUtils, type IPoint, Point, Rectangle } from '@flowgram.ai/utils';
import { Entity, type EntityOpts } from '@flowgram.ai/core';

import { type WorkflowLinesManager } from '../workflow-lines-manager';
import { type WorkflowDocument } from '../workflow-document';
import { WORKFLOW_LINE_ENTITY } from '../utils/statics';
import { FoldLine } from '../utils/fold-line';
import { getBezierHorizontalControlPoints, getBezierVerticalControlPoints } from '../utils/bezier';
import { type LinePosition, LineType } from '../typings/workflow-line';
import { type WorkflowEdgeJSON } from '../typings';
import { WorkflowNodePortsData } from '../entity-datas/workflow-node-ports-data';
import { type WorkflowPortEntity } from './workflow-port-entity';
import { type WorkflowNodeEntity } from './workflow-node-entity';

export const LINE_HOVER_DISTANCE = 8; // 线条 hover 的最小检测距离
export const POINT_RADIUS = 10;

export interface WorkflowLinePortInfo {
  from: string; // 前置节点 id
  to?: string; // 后置节点 id
  fromPort?: string | number; // 连线的 port 位置
  toPort?: string | number; // 连线的 port 位置
}

export interface WorkflowLineEntityOpts extends EntityOpts, WorkflowLinePortInfo {
  document: WorkflowDocument;
  linesManager: WorkflowLinesManager;
  drawingTo?: IPoint;
}

export interface BezierLine {
  fromPos: IPoint;
  toPos: IPoint;
  bbox: Rectangle; // 外围矩形
  controls: IPoint[]; // 控制点
  bezier: Bezier;
  // addArea: Rectangle // 可添加的区域 TODO 未支持
  foldPoints: IPoint[]; // 折叠线的点位
  foldBounds: Rectangle;
  foldPath: string; // 折叠线的 svg 路径
}

export interface WorkflowLineInfo extends WorkflowLinePortInfo {
  drawingTo?: IPoint; // 正在画中的元素
  isDefaultLine?: boolean; // 是否为默认的线
  highlightColor?: string; // 高亮显示
}

/**
 * 线条
 */
export class WorkflowLineEntity extends Entity<WorkflowLineEntityOpts> {
  static type = WORKFLOW_LINE_ENTITY;

  /**
   * 转成线条 id
   * @param info
   */
  static portInfoToLineId(info: WorkflowLinePortInfo): string {
    const { from, to, fromPort, toPort } = info;
    return `${from}_${fromPort || ''}-${to || ''}_${toPort || ''}`;
  }

  readonly document: WorkflowDocument;

  readonly linesManager: WorkflowLinesManager;

  private _from: WorkflowNodeEntity;

  private _to?: WorkflowNodeEntity;

  private _processing = false;

  private _hasError = false;

  /**
   * 线条数据
   */
  info: WorkflowLineInfo = {
    from: '',
  };

  readonly isDrawing: boolean;

  /**
   * 贝塞尔线条版本
   */
  private _bezierVersion: string = '';

  // private _infoDispose = new DisposableCollection();

  /**
   * 贝塞尔线条数据
   */
  private _bezier?: BezierLine;

  /**
   * 线条 Portal 挂载的 div
   */
  private _node?: HTMLDivElement;

  constructor(opts: WorkflowLineEntityOpts) {
    super(opts);
    this.document = opts.document;
    this.linesManager = opts.linesManager;
    // 初始化
    this.initInfo({
      from: opts.from,
      to: opts.to,
      drawingTo: opts.drawingTo,
      fromPort: opts.fromPort,
      toPort: opts.toPort,
    });
    if (opts.drawingTo) {
      this.isDrawing = true;
    }
    // this.onDispose(() => {
    // this._infoDispose.dispose();
    // });
  }

  /**
   * 获取线条的前置节点
   */
  get from(): WorkflowNodeEntity {
    return this._from;
  }

  /**
   * 获取线条的后置节点
   */
  get to(): WorkflowNodeEntity | undefined {
    return this._to;
  }

  get isHidden(): boolean {
    return this.highlightColor === this.linesManager.lineColor.hidden;
  }

  get inContainer(): boolean {
    const nodeInContainer = (node?: WorkflowNodeEntity) =>
      !!node?.parent && node.parent.flowNodeType !== 'root';
    return nodeInContainer(this.from) || nodeInContainer(this.to);
  }

  /**
   * 获取是否 testrun processing
   */
  get processing(): boolean {
    return this._processing;
  }

  /**
   * 设置 testrun processing 状态
   */
  set processing(status: boolean) {
    if (this._processing !== status) {
      this._processing = status;
      this.fireChange();
    }
  }

  // 获取连线是否为错误态
  get hasError() {
    return this._hasError;
  }

  // 设置连线的错误态
  set hasError(hasError: boolean) {
    if (this._hasError !== hasError) {
      this._hasError = hasError;
      this.fireChange();
    }
    if (this._node) {
      this._node.dataset.hasError = this.hasError ? 'true' : 'false';
    }
  }

  /**
   * 设置线条的后置节点
   */
  setToPort(toPort?: WorkflowPortEntity) {
    // 只有绘制中的线条才允许设置 port, 主要用于吸附到点
    if (!this.isDrawing) {
      throw new Error('[setToPort] only support drawing line.');
    }
    if (this.toPort === toPort) {
      return;
    }
    if (
      toPort &&
      toPort.portType === 'input' &&
      this.linesManager.canAddLine(this.fromPort, toPort, true)
    ) {
      const { node, portID } = toPort;
      this._to = node;
      this.info.drawingTo = undefined;
      this.info.isDefaultLine = false;
      this.info.to = node.id;
      this.info.toPort = portID;
    } else {
      this._to = undefined;
      this.info.to = undefined;
      this.info.toPort = '';
    }
    this.fireChange();
  }

  /**
   * 设置线条画线时的目标位置
   */
  set drawingTo(pos: IPoint | undefined) {
    const oldDrawingTo = this.info.drawingTo;
    if (!pos) {
      this.info.drawingTo = undefined;
      this.fireChange();
      return;
    }
    if (!oldDrawingTo || pos.x !== oldDrawingTo.x || pos.y !== oldDrawingTo.y) {
      this.info.to = undefined;
      this.info.isDefaultLine = false;
      this.info.drawingTo = pos;
      this.fireChange();
    }
  }

  /**
   * 获取线条正在画线的位置
   */
  get drawingTo(): IPoint | undefined {
    return this.info.drawingTo;
  }

  get highlightColor(): string {
    return this.info.highlightColor || '';
  }

  set highlightColor(color) {
    if (this.info.highlightColor !== color) {
      this.info.highlightColor = color;
      this.fireChange();
    }
  }

  /**
   * 创建贝塞尔线条
   * @param fromPos 前置节点位置
   * @param toPos 后置节点位置
   * @returns 贝塞尔线条数据
   */

  private createBezier(fromPos: IPoint, toPos: IPoint): BezierLine {
    const controls = this.vertical
      ? getBezierVerticalControlPoints(fromPos, toPos)
      : getBezierHorizontalControlPoints(fromPos, toPos);
    const bezier = new Bezier([fromPos, ...controls, toPos]);
    const bbox = bezier.bbox();
    const bboxBounds = new Rectangle(
      bbox.x.min,
      bbox.y.min,
      bbox.x.max - bbox.x.min,
      bbox.y.max - bbox.y.min
    );
    const foldPoints = FoldLine.getPoints({
      source: {
        x: fromPos.x + POINT_RADIUS,
        y: fromPos.y,
      },
      target: {
        x: toPos.x - POINT_RADIUS,
        y: toPos.y,
      },
    });
    const foldPath = FoldLine.getSmoothStepPath(foldPoints);

    this._bezier = {
      fromPos,
      toPos,
      bezier,
      bbox: bboxBounds,
      controls,
      foldPath,
      foldPoints,
      foldBounds: FoldLine.getBounds(foldPoints),
    };
    return this._bezier;
  }

  /**
   * 获取线条的边框位置大小
   */
  get bounds(): Rectangle {
    return this.bezier.bbox;
  }

  /**
   * 获取点和线最接近的距离
   */
  getHoverDist(pos: IPoint, lineType: LineType = LineType.BEZIER): number {
    if (lineType === LineType.BEZIER) {
      return Point.getDistance(pos, this.bezier.bezier.project(pos));
    }
    return FoldLine.getFoldLineToPointDistance(this.bezier.foldPoints, pos);
  }

  get fromPort(): WorkflowPortEntity {
    return this.from
      .getData(WorkflowNodePortsData)
      .getPortEntityByKey('output', this.info.fromPort);
  }

  get toPort(): WorkflowPortEntity | undefined {
    if (!this.to) {
      return undefined;
    }
    return this.to.getData(WorkflowNodePortsData).getPortEntityByKey('input', this.info.toPort);
  }

  /**
   * 获取线条真实的输入输出节点坐标
   */
  get position(): LinePosition {
    const { bezier } = this;
    return {
      from: bezier.fromPos,
      to: bezier.toPos,
    };
  }

  /**
   * 获取贝塞尔数据
   * 根据两边节点的位置信息创建贝塞尔曲线
   */
  get bezier(): BezierLine {
    if (!this._bezier) {
      this.refreshBezier();
    }
    return this._bezier!;
  }

  public refreshBezier(): void {
    const fromPos = this.from.getData(WorkflowNodePortsData)!.getOutputPoint(this.info.fromPort);
    const toPos =
      this.info.drawingTo ||
      this.to!.getData(WorkflowNodePortsData)!.getInputPoint(this.info.toPort);
    const bezierVersion = [fromPos.x, fromPos.y, toPos.x, toPos.y].join('-');
    if (this._bezier && this._bezierVersion === bezierVersion) {
      return;
    }
    this._bezierVersion = bezierVersion;
    this._bezier = this.createBezier(fromPos, toPos);
  }

  /**
   * 可以用于判断线条点位信息是否变化
   */
  get bezierDataVersion(): string {
    return this._bezierVersion;
  }

  /** 是否反转箭头 */
  get reverse(): boolean {
    return this.linesManager.isReverseLine(this);
  }

  /** 是否隐藏箭头 */
  get hideArrow(): boolean {
    return this.linesManager.isHideArrowLine(this);
  }

  /** 是否流动 */
  get flowing(): boolean {
    return this.linesManager.isFlowingLine(this);
  }

  /** 是否竖向 */
  get vertical(): boolean {
    return this.linesManager.isVerticalLine(this);
  }

  get color(): string | undefined {
    return this.linesManager.getLineColor(this);
  }

  // get defaultToPos(): IPoint {
  //   const fromPos = this.from.getData(TransformComponent)!.toBounds.center;
  //
  //   return {
  //     x: fromPos.x + DEFAULT_LINE_LENGTH,
  //     y: fromPos.y,
  //   };
  // }

  /**
   * 初始化线条
   * @param info 线条信息
   */
  protected initInfo(info: WorkflowLineInfo): void {
    if (!isEqual(info, this.info)) {
      this.info = info;
      // this._infoDispose.dispose();
      // this._infoDispose = new DisposableCollection();
      this._from = this.document.getNode(info.from)!;
      this._to = info.to ? this.document.getNode(info.to) : undefined;
      // // 线条两边节点的位置变化时
      // // 触发线条更新
      // this._infoDispose.push(
      //   this.fromPort!.onEntityChange(() => this.fireChange()),
      // );
      // const { toPort } = this
      // if (toPort) {
      //   this._infoDispose.push(
      //     toPort.onEntityChange(() =>
      //       this.fireChange(),
      //     ),
      //   );
      // }
      this.fireChange();
    }
  }

  // 校验连线是否为错误态
  validate() {
    const { fromPort, toPort } = this;
    this.validateSelf();
    fromPort?.validate();
    toPort?.validate();
  }

  validateSelf() {
    const { fromPort, toPort } = this;

    if (fromPort) {
      this.hasError = this.linesManager.isErrorLine(fromPort, toPort);
    }
  }

  is(line: WorkflowLineEntity | WorkflowLinePortInfo): boolean {
    if (line instanceof WorkflowLineEntity) {
      return this === line;
    }
    return WorkflowLineEntity.portInfoToLineId(line as WorkflowLinePortInfo) === this.id;
  }

  /**
   * 框选 贝塞尔曲线
   * TODO 这个方法可能有性能问题，后续看看有没有更好的方式
   * @param rect
   */
  intersectsRectangle(rect: Rectangle): boolean {
    const dots = this.bezier.bezier.getLUT(50);
    return dots.some((dot) => rect.contains(dot.x, dot.y));
  }

  canRemove(newLineInfo?: Required<WorkflowLinePortInfo>): boolean {
    return this.linesManager.canRemove(this, newLineInfo);
  }

  get node(): HTMLDivElement {
    if (this._node) return this._node;
    this._node = domUtils.createDivWithClass('gedit-flow-activity-line');
    this._node.dataset.testid = 'sdk.workflow.canvas.line';
    this._node.dataset.lineId = this.id;
    this._node.dataset.fromNodeId = this.from.id;
    this._node.dataset.fromPortId = this.fromPort?.id ?? '';
    this._node.dataset.toNodeId = this.to?.id ?? '';
    this._node.dataset.toPortId = this.toPort?.id ?? '';
    this._node.dataset.hasError = this.hasError ? 'true' : 'false';
    return this._node;
  }

  toJSON(): WorkflowEdgeJSON {
    const json = {
      sourceNodeID: this.info.from,
      targetNodeID: this.info.to!,
      sourcePortID: this.info.fromPort,
      targetPortID: this.info.toPort,
    };
    if (!json.sourcePortID) {
      delete json.sourcePortID;
    }
    if (!json.targetPortID) {
      delete json.targetPortID;
    }
    return json;
  }

  /** 触发线条渲染 */
  fireRender(): void {
    this.fireChange();
  }
}

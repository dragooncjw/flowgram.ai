import { VariableEngine } from '@flowgram.ai/variable-core';
import { FlowNodeEntity } from '@flowgram.ai/document';
import { EntityData } from '@flowgram.ai/core';

import { FlowNodeScope, FlowNodeScopeMeta, FlowNodeScopeTypeEnum } from './types';

interface Options {
  variableEngine: VariableEngine;
}

export class FlowNodeVariableData extends EntityData {
  static type: string = 'FlowNodeVariableData';

  declare entity: FlowNodeEntity;

  readonly variableEngine: VariableEngine;

  /**
   * private 的变量可以被 public 所访问，反之则不行
   */
  protected _private?: FlowNodeScope;

  protected _public: FlowNodeScope;

  get private() {
    return this._private;
  }

  get public() {
    return this._public;
  }

  get allScopes(): FlowNodeScope[] {
    const res = [];

    if (this._public) {
      res.push(this._public);
    }
    if (this._private) {
      res.push(this._private);
    }

    return res;
  }

  getDefaultData() {
    return {};
  }

  constructor(entity: FlowNodeEntity, readonly opts: Options) {
    super(entity);

    const { variableEngine } = opts || {};
    this.variableEngine = variableEngine;
    this._public = this.variableEngine.createScope(this.entity.id, {
      node: this.entity,
      type: FlowNodeScopeTypeEnum.public,
    } as FlowNodeScopeMeta);
    this.toDispose.push(this._public);
  }

  initPrivate(): FlowNodeScope {
    if (!this._private) {
      this._private = this.variableEngine.createScope(`${this.entity.id}_private`, {
        node: this.entity,
        type: FlowNodeScopeTypeEnum.private,
      } as FlowNodeScopeMeta);
      // 1. 通知 private 的覆盖作用域更新依赖
      this._private.coverScopes.forEach(_scope => {
        _scope.refreshDeps();
      });
      // 2. 通知 private 的依赖作用域更新覆盖
      this._private.depScopes.forEach(_scope => {
        _scope.refreshCovers();
      });
      // 3. private 自身需要刷新依赖
      this._private.available.refresh();

      this.toDispose.push(this._private);
    }
    return this._private;
  }
}

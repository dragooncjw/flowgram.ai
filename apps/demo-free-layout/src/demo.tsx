/* eslint-disable no-console */
import 'reflect-metadata';
import { useMemo } from 'react';

import { createMinimapPlugin } from '@flowgram.ai/minimap-plugin';
import { StackingContextManager } from '@flowgram.ai/free-stack-plugin';
import { createFreeSnapPlugin } from '@flowgram.ai/free-snap-plugin';
import { createFreeNodePanelPlugin } from '@flowgram.ai/free-node-panel-plugin';
import { createFreeLinesPlugin } from '@flowgram.ai/free-lines-plugin';
import {
  EditorRenderer,
  FlowNodeBaseType,
  FlowRendererKey,
  FreeLayoutEditorProvider,
  FreeLayoutPluginContext,
  FreeLayoutProps,
  PluginContext,
  ShortcutsRegistry,
  WorkflowCommands,
  WorkflowDocument,
  WorkflowDragService,
  WorkflowNodeEntity,
  WorkflowNodeJSON,
  WorkflowSelectService,
} from '@flowgram.ai/free-layout-editor';
import { createFreeAutoLayoutPlugin } from '@flowgram.ai/free-auto-layout-plugin';
import { NodeRender } from '@flowgram.ai/form-core';
import { Toast } from '@douyinfe/semi-ui';

import { DemoTools } from './tools';
import { createVariablePlugin } from './plugins';
import { nodeRegistries } from './node-metas';
import { basic } from './mocks/basic';
import { setters } from './form-extensions';
import { SubCanvasRender } from './components/sub-canvas';
import { SelectBoxPopover } from './components/select-box-popover';
import {
  ConditionNodeRenderer,
  ErrorNodeRenderer,
  LineAddIcon,
  NodePanel,
  NodeRenderer,
} from './components';
import '@flowgram.ai/free-layout-editor/index.css';
import './styles/index.css';

export const App = () => {
  const materials = useMemo(
    () => ({
      setters,
      nodeErrorRender: ({ error }: any) => {
        console.log('error', error);
        return <div>{error.message}</div>;
      },
      nodePlaceholderRender: () => <div>loading....</div>,
    }),
    []
  );

  const initialData = basic;

  const editorProps = useMemo<FreeLayoutProps>(
    () => ({
      /**
       * initial data
       */
      initialData,
      nodeRegistries,
      isErrorLine(ctx, fromPort, toPort) {
        return fromPort.node.flowNodeType === 'error' || toPort?.node.flowNodeType === 'error';
      },
      isErrorPort(ctx, port) {
        return port.node.flowNodeType === 'error';
      },
      isVerticalLine(ctx, line) {
        if (
          line.from?.flowNodeType === 'loop' &&
          line.to?.flowNodeType === FlowNodeBaseType.SUB_CANVAS &&
          line.fromPort?.portID === 'loop-output-to-function' &&
          line.toPort?.portID === 'loop-function-input'
        ) {
          return true;
        }
        return false;
      },
      isHideArrowLine(ctx, line) {
        return (
          line.from?.flowNodeType === 'loop' &&
          line.to?.flowNodeType === FlowNodeBaseType.SUB_CANVAS
        );
      },
      /*
       * can ports connected
       */
      canAddLine(ctx, fromPort, toPort) {
        // not the same node
        if (fromPort.node === toPort.node) {
          return false;
        }
        // container with sub node
        if (fromPort.node === toPort.node.parent || toPort.node === fromPort.node.parent) {
          return true;
        }
        if (toPort.portID === 'loop-function-inline-input') {
          return false;
        }
        // in different  container
        if (fromPort.node.parent !== toPort.node.parent) {
          return false;
        }
        // error port can not be lined
        if (fromPort.node.flowNodeType === 'error' || toPort.node.flowNodeType === 'error') {
          return false;
        }
        return true;
      },
      canDeleteLine(ctx, line, newLineInfo, silent) {
        if (
          line.from?.flowNodeType === 'loop' &&
          line.to?.flowNodeType === FlowNodeBaseType.SUB_CANVAS
        ) {
          return false;
        }
        return true;
      },
      cursors: {
        grab: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAxNiAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjBfZF8yMDU2XzI0NDQ2MykiPgo8bWFzayBpZD0icGF0aC0xLW91dHNpZGUtMV8yMDU2XzI0NDQ2MyIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMSIgeT0iMCIgd2lkdGg9IjE0IiBoZWlnaHQ9IjE4IiBmaWxsPSJibGFjayI+CjxyZWN0IGZpbGw9IndoaXRlIiB4PSIxIiB3aWR0aD0iMTQiIGhlaWdodD0iMTgiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04IDJDOCAxLjQ0NzcyIDguNDQ3NzIgMSA5IDFDOS41NTIyOCAxIDEwIDEuNDQ3NzIgMTAgMlYzQzEwIDIuNDQ3NzIgMTAuNDQ3NyAyIDExIDJDMTEuNTUyMyAyIDEyIDIuNDQ3NzIgMTIgM1Y1QzEyIDQuNDQ3NzIgMTIuNDQ3NyA0IDEzIDRDMTMuNTUyMyA0IDE0IDQuNDQ3NzIgMTQgNVY5LjVWMTBWMTAuODM4MUMxNCAxMS45MjU2IDEzLjcwNDUgMTIuOTkyNiAxMy4xNDUgMTMuOTI1MUwxMi41IDE1VjE3SDYuNVYxNUwyLjYwODk5IDkuODExOTlDMi4yOTE4OSA5LjM4OTE5IDIuNDM1MTMgOC43ODI0NCAyLjkwNzgzIDguNTQ2MDlDMy41NjAwNiA4LjIxOTk3IDQuMzQ3OCA4LjM0NzggNC44NjM0NCA4Ljg2MzQ0TDUuOTk5OTggOS45OTk5OEw2IDMuMDAwMDFDNiAyLjQ0NzcyIDYuNDQ3NzIgMiA3LjAwMDAxIDJDNy41NTA0MSAyIDcuOTk2OTUgMi40NDQ2NiA4IDIuOTk0MzRWMloiLz4KPC9tYXNrPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTggMkM4IDEuNDQ3NzIgOC40NDc3MiAxIDkgMUM5LjU1MjI4IDEgMTAgMS40NDc3MiAxMCAyVjNDMTAgMi40NDc3MiAxMC40NDc3IDIgMTEgMkMxMS41NTIzIDIgMTIgMi40NDc3MiAxMiAzVjVDMTIgNC40NDc3MiAxMi40NDc3IDQgMTMgNEMxMy41NTIzIDQgMTQgNC40NDc3MiAxNCA1VjkuNVYxMFYxMC44MzgxQzE0IDExLjkyNTYgMTMuNzA0NSAxMi45OTI2IDEzLjE0NSAxMy45MjUxTDEyLjUgMTVWMTdINi41VjE1TDIuNjA4OTkgOS44MTE5OUMyLjI5MTg5IDkuMzg5MTkgMi40MzUxMyA4Ljc4MjQ0IDIuOTA3ODMgOC41NDYwOUMzLjU2MDA2IDguMjE5OTcgNC4zNDc4IDguMzQ3OCA0Ljg2MzQ0IDguODYzNDRMNS45OTk5OCA5Ljk5OTk4TDYgMy4wMDAwMUM2IDIuNDQ3NzIgNi40NDc3MiAyIDcuMDAwMDEgMkM3LjU1MDQxIDIgNy45OTY5NSAyLjQ0NDY2IDggMi45OTQzNFYyWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEzLjE0NSAxMy45MjUxTDE0LjAwMjUgMTQuNDM5NkgxNC4wMDI1TDEzLjE0NSAxMy45MjUxWk0xMi41IDE1SDExLjVWMTQuNzIzTDExLjY0MjUgMTQuNDg1NUwxMi41IDE1Wk0xMi41IDE3SDEzLjVWMThIMTIuNVYxN1pNNi41IDE3VjE4SDUuNVYxN0g2LjVaTTYuNSAxNUw3LjMgMTQuNEw3LjUgMTQuNjY2N1YxNUg2LjVaTTIuNjA4OTkgOS44MTE5OUwzLjQwODk5IDkuMjExOTlMMi42MDg5OSA5LjgxMTk5Wk00Ljg2MzQ0IDguODYzNDRMNS41NzA1NCA4LjE1NjMzVjguMTU2MzNMNC44NjM0NCA4Ljg2MzQ0Wk01Ljk5OTk4IDkuOTk5OThMNi45OTk5OCA5Ljk5OTk5TDYuOTk5OTggMTIuNDE0Mkw1LjI5Mjg4IDEwLjcwNzFMNS45OTk5OCA5Ljk5OTk4Wk02IDMuMDAwMDFMNyAzLjAwMDAxVjMuMDAwMDFMNiAzLjAwMDAxWk04IDIuOTk0MzRIOUw3LjAwMDAyIDIuOTk5ODlMOCAyLjk5NDM0Wk05IDJWMkg3QzcgMC44OTU0MzEgNy44OTU0MyAwIDkgMFYyWk05IDJWMEMxMC4xMDQ2IDAgMTEgMC44OTU0MzEgMTEgMkg5Wk05IDNWMkgxMVYzSDlaTTExIDNIOUM5IDEuODk1NDMgOS44OTU0MyAxIDExIDFWM1pNMTEgM1YxQzEyLjEwNDYgMSAxMyAxLjg5NTQzIDEzIDNIMTFaTTExIDVWM0gxM1Y1SDExWk0xMyA1SDExQzExIDMuODk1NDMgMTEuODk1NCAzIDEzIDNWNVpNMTMgNVYzQzE0LjEwNDYgMyAxNSAzLjg5NTQzIDE1IDVIMTNaTTEzIDkuNVY1SDE1VjkuNUgxM1pNMTMgMTBWOS41SDE1VjEwSDEzWk0xMyAxMC44MzgxVjEwSDE1VjEwLjgzODFIMTNaTTEyLjI4NzUgMTMuNDEwNkMxMi43NTM3IDEyLjYzMzUgMTMgMTEuNzQ0MyAxMyAxMC44MzgxSDE1QzE1IDEyLjEwNjggMTQuNjU1MiAxMy4zNTE3IDE0LjAwMjUgMTQuNDM5NkwxMi4yODc1IDEzLjQxMDZaTTExLjY0MjUgMTQuNDg1NUwxMi4yODc1IDEzLjQxMDZMMTQuMDAyNSAxNC40Mzk2TDEzLjM1NzUgMTUuNTE0NUwxMS42NDI1IDE0LjQ4NTVaTTExLjUgMTdWMTVIMTMuNVYxN0gxMS41Wk02LjUgMTZIMTIuNVYxOEg2LjVWMTZaTTcuNSAxNVYxN0g1LjVWMTVINy41Wk01LjcgMTUuNkwxLjgwODk5IDEwLjQxMkwzLjQwODk5IDkuMjExOTlMNy4zIDE0LjRMNS43IDE1LjZaTTEuODA4OTkgMTAuNDEyQzEuMTE3NTUgOS40OTAwNyAxLjQyOTg4IDguMTY3MDMgMi40NjA2MiA3LjY1MTY2TDMuMzU1MDQgOS40NDA1MUMzLjQ0MDM4IDkuMzk3ODUgMy40NjYyMyA5LjI4ODMxIDMuNDA4OTkgOS4yMTE5OUwxLjgwODk5IDEwLjQxMlpNMi40NjA2MiA3LjY1MTY2QzMuNDk3ODQgNy4xMzMwNSA0Ljc1MDU1IDcuMzM2MzMgNS41NzA1NCA4LjE1NjMzTDQuMTU2MzMgOS41NzA1NEMzLjk0NTA1IDkuMzU5MjcgMy42MjIyOSA5LjMwNjg5IDMuMzU1MDQgOS40NDA1MUwyLjQ2MDYyIDcuNjUxNjZaTTUuNTcwNTQgOC4xNTYzM0w2LjcwNzA5IDkuMjkyODhMNS4yOTI4OCAxMC43MDcxTDQuMTU2MzMgOS41NzA1NEw1LjU3MDU0IDguMTU2MzNaTTcgMy4wMDAwMUw2Ljk5OTk4IDkuOTk5OTlMNC45OTk5OCA5Ljk5OTk4TDUgMy4wMDAwMUw3IDMuMDAwMDFaTTcuMDAwMDEgM0w3IDMuMDAwMDFMNSAzLjAwMDAxQzUgMS44OTU0MyA1Ljg5NTQzIDEgNy4wMDAwMSAxVjNaTTcuMDAwMDIgMi45OTk4OUw3LjAwMDAxIDNWMUM4LjEwMDgzIDEgOC45OTM4OCAxLjg4OTMxIDguOTk5OTggMi45ODg3OUw3LjAwMDAyIDIuOTk5ODlaTTkgMlYyLjk5NDM0SDdWMkg5WiIgZmlsbD0iYmxhY2siIG1hc2s9InVybCgjcGF0aC0xLW91dHNpZGUtMV8yMDU2XzI0NDQ2MykiLz4KPHBhdGggZD0iTTYuNSAxNS41SDEzLjVWMThINi41VjE1LjVaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNOCAxLjVDOC4zMjAxNCAxLjgyMDE0IDguNSAyLjI1NDM1IDguNSAyLjcwNzExVjdIOFYxLjVaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNMTAgMkgxMC41VjdIMTBWMloiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik0xMiA0SDEyLjVWN0gxMlY0WiIgZmlsbD0iYmxhY2siLz4KPC9nPgo8ZGVmcz4KPGZpbHRlciBpZD0iZmlsdGVyMF9kXzIwNTZfMjQ0NDYzIiB4PSIwLjQzODk2NSIgeT0iMCIgd2lkdGg9IjE1LjU2MSIgaGVpZ2h0PSIyMCIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPgo8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPgo8ZmVDb2xvck1hdHJpeCBpbj0iU291cmNlQWxwaGEiIHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxMjcgMCIgcmVzdWx0PSJoYXJkQWxwaGEiLz4KPGZlT2Zmc2V0IGR5PSIxIi8+CjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjAuNSIvPgo8ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJvdXQiLz4KPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuNDUgMCIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd18yMDU2XzI0NDQ2MyIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9ImVmZmVjdDFfZHJvcFNoYWRvd18yMDU2XzI0NDQ2MyIgcmVzdWx0PSJzaGFwZSIvPgo8L2ZpbHRlcj4KPC9kZWZzPgo8L3N2Zz4K"), auto',
        grabbing:
          'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNSAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjBfZF8yMDU2XzI0NDQ3OCkiPgo8bWFzayBpZD0icGF0aC0xLW91dHNpZGUtMV8yMDU2XzI0NDQ3OCIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMC41IiB5PSIwIiB3aWR0aD0iMTMiIGhlaWdodD0iMTQiIGZpbGw9ImJsYWNrIj4KPHJlY3QgZmlsbD0id2hpdGUiIHg9IjAuNSIgd2lkdGg9IjEzIiBoZWlnaHQ9IjE0Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNS41MDAwMiAxQzQuOTQ3NzMgMSA0LjUwMDAyIDEuNDQ3NzIgNC41MDAwMSAyLjAwMDAxTDQuNSA0LjA4MDYyQzQuNSAzLjI0MjEyIDMuNTMwMDcgMi43NzU5NSAyLjg3NTMxIDMuMjk5NzZMMi4zNzUzMSAzLjY5OTc2QzIuMTM4MDkgMy44ODk1MyAyIDQuMTc2ODQgMiA0LjQ4MDYyVjYuODc4NjhDMiA3LjI3NjUgMi4xNTgwNCA3LjY1ODA0IDIuNDM5MzQgNy45MzkzNEw0LjUgMTBWMTNIMTAuNVYxMS41TDExLjg2NjYgOC43NjY4N0MxMi4yODMxIDcuOTMzNzQgMTIuNSA3LjAxNTA2IDEyLjUgNi4wODM1OVY2VjQuNVYzQzEyLjUgMi40NDc3MiAxMi4wNTIzIDIgMTEuNSAyQzEwLjk0NzcgMiAxMC41IDIuNDQ3NzIgMTAuNSAzVjIuNUMxMC41IDEuOTQ3NzIgMTAuMDUyMyAxLjUgOS41IDEuNUM4Ljk0NzcyIDEuNSA4LjUgMS45NDc3MiA4LjUgMi41VjJDOC41IDEuNDQ3NzIgOC4wNTIyOCAxIDcuNSAxQzYuOTQ5NiAxIDYuNTAzMDcgMS40NDQ2NSA2LjUwMDAyIDEuOTk0MzNDNi40OTY5NiAxLjQ0NDY1IDYuMDUwNDIgMSA1LjUwMDAyIDFaIi8+CjwvbWFzaz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01LjUwMDAyIDFDNC45NDc3MyAxIDQuNTAwMDIgMS40NDc3MiA0LjUwMDAxIDIuMDAwMDFMNC41IDQuMDgwNjJDNC41IDMuMjQyMTIgMy41MzAwNyAyLjc3NTk1IDIuODc1MzEgMy4yOTk3NkwyLjM3NTMxIDMuNjk5NzZDMi4xMzgwOSAzLjg4OTUzIDIgNC4xNzY4NCAyIDQuNDgwNjJWNi44Nzg2OEMyIDcuMjc2NSAyLjE1ODA0IDcuNjU4MDQgMi40MzkzNCA3LjkzOTM0TDQuNSAxMFYxM0gxMC41VjExLjVMMTEuODY2NiA4Ljc2Njg3QzEyLjI4MzEgNy45MzM3NCAxMi41IDcuMDE1MDYgMTIuNSA2LjA4MzU5VjZWNC41VjNDMTIuNSAyLjQ0NzcyIDEyLjA1MjMgMiAxMS41IDJDMTAuOTQ3NyAyIDEwLjUgMi40NDc3MiAxMC41IDNWMi41QzEwLjUgMS45NDc3MiAxMC4wNTIzIDEuNSA5LjUgMS41QzguOTQ3NzIgMS41IDguNSAxLjk0NzcyIDguNSAyLjVWMkM4LjUgMS40NDc3MiA4LjA1MjI4IDEgNy41IDFDNi45NDk2IDEgNi41MDMwNyAxLjQ0NDY1IDYuNTAwMDIgMS45OTQzM0M2LjQ5Njk2IDEuNDQ0NjUgNi4wNTA0MiAxIDUuNTAwMDIgMVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik00LjUwMDAxIDIuMDAwMDFMNS41MDAwMSAyLjAwMDAxVjIuMDAwMDFMNC41MDAwMSAyLjAwMDAxWk00LjUgNC4wODA2Mkw1LjUgNC4wODA2M0wzLjUgNC4wODA2Mkg0LjVaTTIuODc1MzEgMy4yOTk3NkwzLjUgNC4wODA2MlY0LjA4MDYzTDIuODc1MzEgMy4yOTk3NlpNMi4zNzUzMSAzLjY5OTc2TDEuNzUwNjEgMi45MTg4OVYyLjkxODg5TDIuMzc1MzEgMy42OTk3NlpNNC41IDEwTDUuMjA3MTEgOS4yOTI4OUw1LjUgOS41ODU3OVYxMEg0LjVaTTQuNSAxM1YxNEgzLjVWMTNINC41Wk0xMC41IDEzSDExLjVWMTRIMTAuNVYxM1pNMTAuNSAxMS41SDkuNVYxMS4yNjM5TDkuNjA1NTcgMTEuMDUyOEwxMC41IDExLjVaTTExLjg2NjYgOC43NjY4N0wxMC45NzIxIDguMzE5NjZMMTEuODY2NiA4Ljc2Njg3Wk02LjUwMDAyIDEuOTk0MzNMNy41IDEuOTk5ODhMNS41MDAwMyAxLjk5OTg5TDYuNTAwMDIgMS45OTQzM1pNMy41MDAwMSAyQzMuNTAwMDIgMC44OTU0MzEgNC4zOTU0NSAwIDUuNTAwMDIgMFYyTDUuNTAwMDEgMi4wMDAwMUwzLjUwMDAxIDJaTTMuNSA0LjA4MDYyTDMuNTAwMDEgMkw1LjUwMDAxIDIuMDAwMDFMNS41IDQuMDgwNjNMMy41IDQuMDgwNjJaTTIuMjUwNjEgMi41MTg4OUMzLjU2MDE0IDEuNDcxMjcgNS41IDIuNDAzNjEgNS41IDQuMDgwNjJIMy41VjQuMDgwNjJMMi4yNTA2MSAyLjUxODg5Wk0xLjc1MDYxIDIuOTE4ODlMMi4yNTA2MSAyLjUxODg5TDMuNSA0LjA4MDYzTDMgNC40ODA2MkwxLjc1MDYxIDIuOTE4ODlaTTEgNC40ODA2MkMxIDMuODczMDYgMS4yNzYxOCAzLjI5ODQzIDEuNzUwNjEgMi45MTg4OUwzIDQuNDgwNjJWNC40ODA2MkgxWk0xIDYuODc4NjhWNC40ODA2MkgzVjYuODc4NjhIMVpNMS43MzIyMyA4LjY0NjQ1QzEuMjYzMzkgOC4xNzc2MSAxIDcuNTQxNzIgMSA2Ljg3ODY4SDNDMyA3LjAxMTI5IDMuMDUyNjggNy4xMzg0NiAzLjE0NjQ1IDcuMjMyMjNMMS43MzIyMyA4LjY0NjQ1Wk0zLjc5Mjg5IDEwLjcwNzFMMS43MzIyMyA4LjY0NjQ1TDMuMTQ2NDUgNy4yMzIyM0w1LjIwNzExIDkuMjkyODlMMy43OTI4OSAxMC43MDcxWk0zLjUgMTNWMTBINS41VjEzSDMuNVpNMTAuNSAxNEg0LjVWMTJIMTAuNVYxNFpNMTEuNSAxMS41VjEzSDkuNVYxMS41SDExLjVaTTEyLjc2MSA5LjIxNDA5TDExLjM5NDQgMTEuOTQ3Mkw5LjYwNTU3IDExLjA1MjhMMTAuOTcyMSA4LjMxOTY2TDEyLjc2MSA5LjIxNDA5Wk0xMy41IDYuMDgzNTlDMTMuNSA3LjE3MDMxIDEzLjI0NyA4LjI0MjEgMTIuNzYxIDkuMjE0MDlMMTAuOTcyMSA4LjMxOTY2QzExLjMxOTMgNy42MjUzOCAxMS41IDYuODU5ODIgMTEuNSA2LjA4MzU5SDEzLjVaTTEzLjUgNlY2LjA4MzU5SDExLjVWNkgxMy41Wk0xMy41IDQuNVY2SDExLjVWNC41SDEzLjVaTTEzLjUgM1Y0LjVIMTEuNVYzSDEzLjVaTTExLjUgMUMxMi42MDQ2IDEgMTMuNSAxLjg5NTQzIDEzLjUgM0gxMS41VjFaTTkuNSAzQzkuNSAxLjg5NTQzIDEwLjM5NTQgMSAxMS41IDFWM0g5LjVaTTExLjUgMi41VjNIOS41VjIuNUgxMS41Wk05LjUgMC41QzEwLjYwNDYgMC41IDExLjUgMS4zOTU0MyAxMS41IDIuNUg5LjVWMC41Wk03LjUgMi41QzcuNSAxLjM5NTQzIDguMzk1NDMgMC41IDkuNSAwLjVWMi41SDcuNVpNOS41IDJWMi41SDcuNVYySDkuNVpNNy41IDBDOC42MDQ1NyAwIDkuNSAwLjg5NTQzMSA5LjUgMkg3LjVWMFpNNS41MDAwMyAxLjk4ODc4QzUuNTA2MTMgMC44ODkyOTggNi4zOTkxOCAwIDcuNSAwVjJMNy41IDEuOTk5ODhMNS41MDAwMyAxLjk4ODc4Wk01LjUwMDAyIDBDNi42MDA4NCAwIDcuNDkzODkgMC44ODkyOTYgNy41IDEuOTg4NzdMNS41MDAwMyAxLjk5OTg5TDUuNTAwMDIgMlYwWiIgZmlsbD0iYmxhY2siIG1hc2s9InVybCgjcGF0aC0xLW91dHNpZGUtMV8yMDU2XzI0NDQ3OCkiLz4KPHJlY3QgeD0iMy41IiB5PSIxMS41IiB3aWR0aD0iNyIgaGVpZ2h0PSIyIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNNi41IDFIN1YzSDYuNVYxWiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTguNSAxSDlWM0g4LjVWMVoiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik0xMC41IDJIMTFWM0gxMC41VjJaIiBmaWxsPSJibGFjayIvPgo8cmVjdCB4PSI0LjUiIHk9IjEyLjI1IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJ3aGl0ZSIvPgo8L2c+CjxkZWZzPgo8ZmlsdGVyIGlkPSJmaWx0ZXIwX2RfMjA1Nl8yNDQ0NzgiIHg9IjAiIHk9IjAiIHdpZHRoPSIxNC41IiBoZWlnaHQ9IjE2IiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CjxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIiByZXN1bHQ9ImhhcmRBbHBoYSIvPgo8ZmVPZmZzZXQgZHk9IjEiLz4KPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMC41Ii8+CjxmZUNvbXBvc2l0ZSBpbjI9ImhhcmRBbHBoYSIgb3BlcmF0b3I9Im91dCIvPgo8ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC40NSAwIi8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0iZWZmZWN0MV9kcm9wU2hhZG93XzIwNTZfMjQ0NDc4Ii8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iZWZmZWN0MV9kcm9wU2hhZG93XzIwNTZfMjQ0NDc4IiByZXN1bHQ9InNoYXBlIi8+CjwvZmlsdGVyPgo8L2RlZnM+Cjwvc3ZnPgo="), auto',
      },
      nodeEngine: {
        materials: materials,
      },
      materials: {
        renderNodes: {
          'condition-render': ConditionNodeRenderer,
          'error-render': ErrorNodeRenderer,
          [FlowRendererKey.SUB_CANVAS]: SubCanvasRender,
          [FlowRendererKey.SELECTOR_BOX_POPOVER]: SelectBoxPopover,
        },
        renderDefaultNode: (props) => (
          <NodeRenderer {...props}>
            <NodeRender node={props.node} />
          </NodeRenderer>
        ),
      },
      variableEngine: {
        enable: true,
        layout: 'free',
      },
      history: {
        enable: true,
      },
      reduxDevTool: {
        enable: true,
        ecs: true,
        variable: true,
      },
      shortcuts(shortcutsRegistry: ShortcutsRegistry, ctx: FreeLayoutPluginContext) {
        shortcutsRegistry.addHandlers({
          commandId: 'selectAll',
          shortcuts: ['meta a', 'ctrl a'],
          execute() {
            const allNodes = ctx.document.getAllNodes();
            ctx.playground.selectionService.selection = allNodes;
          },
        });
        shortcutsRegistry.addHandlers({
          commandId: WorkflowCommands.COPY_NODES,
          shortcuts: ['meta c', 'ctrl c'],
          execute: async (e) => {
            const document = ctx.get<WorkflowDocument>(WorkflowDocument);
            const selectService = ctx.get<WorkflowSelectService>(WorkflowSelectService);

            if (window.getSelection()?.toString()) {
              navigator.clipboard.writeText(window.getSelection()?.toString() ?? '').then(() => {
                Toast.success({
                  content: 'Text copied',
                });
              });

              return e;
            }

            const { selectedNodes } = selectService;

            if (selectedNodes.length === 0) {
              return;
            }
            const nodeEntities = selectedNodes.filter(
              (n) => n.flowNodeType !== 'start' && n.flowNodeType !== 'end'
            );
            const nodes = await Promise.all(
              nodeEntities.map(async (nodeEntity) => {
                const nodeJSON = await document.toNodeJSON(nodeEntity);
                return {
                  nodeJSON,
                  nodeType: nodeEntity.flowNodeType,
                };
              })
            );
            navigator.clipboard
              .writeText(
                JSON.stringify({
                  nodes,
                  fromHost: window.location.host,
                })
              )
              .then(() => {
                Toast.success({
                  content: 'Nodes copied',
                });
              })
              .catch((err) => {
                Toast.error({
                  content: 'Failed to copy nodes',
                });
                console.error('Failed to write text: ', err);
              });
          },
        });
        shortcutsRegistry.addHandlers({
          commandId: WorkflowCommands.PASTE_NODES,
          shortcuts: ['meta v', 'ctrl v'],
          execute: async (selectedNodes?: WorkflowNodeEntity[]) => {
            const document = ctx.get<WorkflowDocument>(WorkflowDocument);
            const selectService = ctx.get<WorkflowSelectService>(WorkflowSelectService);
            const dragService = ctx.get<WorkflowDragService>(WorkflowDragService);

            if (selectedNodes && Array.isArray(selectedNodes)) {
              const newNodes = await Promise.all(
                selectedNodes.map(async (node) => {
                  const nodeJSON = await document.toNodeJSON(node);
                  return document.copyNodeFromJSON(
                    nodeJSON.type as string,
                    nodeJSON,
                    '',
                    nodeJSON.meta?.position,
                    node.parent?.id
                  );
                })
              );
              return newNodes;
            }

            const text: string = (await navigator.clipboard.readText()) || '';
            let clipboardData: {
              nodes: {
                nodeJSON: WorkflowNodeJSON;
                nodeType: string;
              }[];
              fromHost: string;
            };
            try {
              clipboardData = JSON.parse(text);
            } catch (e) {
              return;
            }
            if (!clipboardData.nodes || !clipboardData.fromHost) {
              return null;
            }

            if (clipboardData.fromHost !== window.location.host) {
              Toast.error({
                content: 'Cannot paste nodes from different pages',
              });
              return null;
            }

            const { activatedNode } = selectService;
            const containerNode =
              activatedNode?.flowNodeType === FlowNodeBaseType.SUB_CANVAS
                ? activatedNode
                : undefined;

            const nodes = await Promise.all(
              clipboardData.nodes.map(({ nodeJSON }) => {
                delete nodeJSON.blocks;
                delete nodeJSON.edges;
                delete nodeJSON.meta?.canvasPosition;
                const position = containerNode
                  ? dragService.adjustSubNodePosition(
                      nodeJSON.type as string,
                      containerNode,
                      nodeJSON.meta?.position
                    )
                  : nodeJSON.meta?.position;
                return document.copyNodeFromJSON(
                  nodeJSON.type as string,
                  nodeJSON,
                  '',
                  position,
                  containerNode?.id
                );
              })
            );

            if (nodes.length > 0) {
              selectService.selection = nodes;
            }

            Toast.success({
              content: 'Nodes pasted',
            });
          },
        });
      },
      onAllLayersRendered(ctx) {
        ctx.document.fitView(false);
        console.log('--- canvas rendered ---');
      },
      onDispose() {
        console.log('--- canvas dispose ---');
      },
      plugins: () => [
        createVariablePlugin({}),
        createFreeLinesPlugin({
          renderInsideLine: LineAddIcon,
          renderElement: (ctx: PluginContext) => {
            const stackingContextManager = ctx.get<StackingContextManager>(StackingContextManager);
            if (stackingContextManager.node) {
              return stackingContextManager.node;
            }
          },
        }),
        createFreeAutoLayoutPlugin({}),
        createMinimapPlugin({
          disableLayer: true,
        }),
        createFreeSnapPlugin({}),
        createFreeNodePanelPlugin({
          renderer: NodePanel,
        }),
      ],
    }),
    []
  );
  return (
    <div className="doc-free-feature-overview">
      <FreeLayoutEditorProvider {...editorProps}>
        <div className="demo-container">
          <EditorRenderer className="demo-editor" />
        </div>
        <DemoTools />
      </FreeLayoutEditorProvider>
    </div>
  );
};

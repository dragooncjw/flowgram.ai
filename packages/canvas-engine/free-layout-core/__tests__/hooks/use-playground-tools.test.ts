import { interfaces } from 'inversify';
import { renderHook } from '@testing-library/react-hooks';
import { FlowNodeBaseType } from '@flowgram.ai/document';
import { Playground, PositionData } from '@flowgram.ai/core';

import { createDocument, createHookWrapper, createSubCanvasNodes, nestJSON } from '../utils.mock';
import {
  usePlaygroundTools,
  PlaygroundTools,
  LineType,
  WorkflowDocument,
  EditorCursorState,
  InteractiveType,
  delay,
  WorkflowDocumentOptions,
} from '../../src';

describe(
  'use-playground-tools',
  () => {
    let toolsData: { current: PlaygroundTools };
    let playground: Playground;
    let container: interfaces.Container;
    beforeEach(async () => {
      container = (await createDocument()).container;
      playground = container.get<Playground>(Playground);
      // tools 工具要在 ready 之后才能生效
      playground.ready();
      const wrapper = createHookWrapper(container);
      const { result } = renderHook(() => usePlaygroundTools(), {
        wrapper,
      });
      toolsData = result;
    });
    it('zoomin', async () => {
      expect(toolsData.current.zoom).toEqual(1);
      toolsData.current.zoomin(false);
      expect(toolsData.current.zoom).toEqual(1.1);
    });
    it('zoomout', async () => {
      expect(toolsData.current.zoom).toEqual(1);
      toolsData.current.zoomout(false);
      expect(toolsData.current.zoom).toEqual(0.9);
    });
    it('fitview', async () => {
      playground.config.updateConfig({
        width: 1000,
        height: 800,
      });
      await toolsData.current.fitView(false);
      expect(playground.config.scrollData).toEqual({
        scrollX: -30,
        scrollY: -370,
      });
    });
    it('autoLayout', async () => {
      const doc = container.get(WorkflowDocument);
      let startPos = doc.getNode('start_0')!.getData(PositionData)!;
      const endPos = doc.getNode('end_0')!.getData(PositionData)!;
      expect(endPos.x - startPos.x).toEqual(800);
      const revert = await toolsData.current.autoLayout();
      expect(endPos.x - startPos.x).toEqual(620);
      // 回滚
      await revert();
      expect(endPos.x - startPos.x).toEqual(800);
    });
    it('autoLayout with nested JSON', async () => {
      const doc = container.get(WorkflowDocument);
      doc.fromJSON(nestJSON);
      await delay(10);
      let startPos = doc.getNode('start_0')!.getData(PositionData)!;
      const endPos = doc.getNode('end_0')!.getData(PositionData)!;
      expect(endPos.x - startPos.x).toEqual(800);
      const revert = await toolsData.current.autoLayout();
      expect(endPos.x - startPos.x).toEqual(760);
      // 回滚
      await revert();
      expect(endPos.x - startPos.x).toEqual(800);
    });
    it('autoLayout with verticalLine', async () => {
      const documentOptions = container.get<WorkflowDocumentOptions>(WorkflowDocumentOptions);
      documentOptions.isVerticalLine = line => {
        if (
          line.from?.flowNodeType === 'loop' &&
          line.to?.flowNodeType === FlowNodeBaseType.SUB_CANVAS
        ) {
          return true;
        }
        return false;
      };
      const document = container.get(WorkflowDocument);
      const { loopNode, subCanvasNode } = await createSubCanvasNodes(document);
      const loopPos = loopNode.getData(PositionData)!;
      const subCanvasPos = subCanvasNode.getData(PositionData)!;
      await delay(10);
      expect({
        x: loopPos.x,
        y: loopPos.y,
      }).toEqual({
        x: -100,
        y: 0,
      });
      expect({
        x: subCanvasPos.x,
        y: subCanvasPos.y,
      }).toEqual({
        x: 100,
        y: 0,
      });
      await toolsData.current.autoLayout();
      await delay(10);
      expect({
        x: loopPos.x,
        y: loopPos.y,
      }).toEqual({
        x: 140,
        y: 130,
      });
      expect({
        x: subCanvasPos.x,
        y: subCanvasPos.y,
      }).toEqual({
        x: 0,
        y: 290,
      });
    });
    it('switchLineType', async () => {
      expect(toolsData.current.lineType).toEqual(LineType.BEZIER);
      toolsData.current.switchLineType();
      expect(toolsData.current.lineType).toEqual(LineType.LINE_CHART);
      toolsData.current.switchLineType();
      expect(toolsData.current.lineType).toEqual(LineType.BEZIER);
    });
    it('setCursorState', async () => {
      await toolsData.current.setCursorState(() => EditorCursorState.GRAB);
      expect(toolsData.current.cursorState).toEqual('GRAB');

      await toolsData.current.setCursorState(EditorCursorState.SELECT);
      expect(toolsData.current.cursorState).toEqual('SELECT');
    });
    it('setInteractiveType', async () => {
      await toolsData.current.setInteractiveType(InteractiveType.MOUSE);
      expect(toolsData.current.interactiveType).toEqual(InteractiveType.MOUSE);
      expect(toolsData.current.cursorState).toEqual('GRAB');

      await toolsData.current.setInteractiveType(InteractiveType.PAD);
      expect(toolsData.current.interactiveType).toEqual(InteractiveType.PAD);
      expect(toolsData.current.cursorState).toEqual('SELECT');
    });
  },
  {
    timeout: 30000,
  },
);

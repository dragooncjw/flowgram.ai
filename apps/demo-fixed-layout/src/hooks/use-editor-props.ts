import { useMemo } from 'react';

import { createMinimapPlugin } from '@flowgram.ai/minimap-plugin';
import { createGroupPlugin } from '@flowgram.ai/group-plugin';
import { defaultFixedSemiMaterials } from '@flowgram.ai/fixed-semi-materials';
import {
  FixedLayoutProps,
  FlowDocumentJSON,
  FlowLayoutDefault,
  FlowRendererKey,
  ShortcutsRegistry,
} from '@flowgram.ai/fixed-layout-editor';

import { type FlowNodeRegistry } from '../typings';
import { shortcutGetter } from '../shortcuts';
import { createVariablePlugin, createClipboardPlugin } from '../plugins';
import { defaultFormMeta } from '../nodes';
import { SelectorBoxPopover } from '../components/select-box-popover';
import { GroupBoxHeader, GroupNode } from '../components/group';
import { BaseNode } from '../components/base-node';
import Adder from '../components/adder';
import { DragNode } from '../components';

export function useEditorProps(
  initialData: FlowDocumentJSON,
  nodeRegistries: FlowNodeRegistry[]
): FixedLayoutProps {
  return useMemo<FixedLayoutProps>(
    () => ({
      /**
       * Whether it is read-only or not, the node cannot be dragged in read-only mode
       */
      readonly: false,
      /**
       * Initial data
       */
      initialData,
      /**
       * Node registries
       */
      nodeRegistries,
      /**
       * Get the default node registry, which will be merged with the 'nodeRegistries'
       */
      getNodeDefaultRegistry(type) {
        return {
          type,
          meta: {
            defaultExpanded: true,
          },
          formMeta: defaultFormMeta,
        };
      },
      /**
       * Set default layout
       */
      defaultLayout: FlowLayoutDefault.VERTICAL_FIXED_LAYOUT, // or FlowLayoutDefault.HORIZONTAL_FIXED_LAYOUT
      /**
       * Style config
       */
      // constants: {
      //   [ConstantKeys.NODE_SPACING]: 24,
      //   [ConstantKeys.INLINE_SPACING_BOTTOM]: 24,
      //   [ConstantKeys.INLINE_BLOCKS_INLINE_SPACING_BOTTOM]: 13,
      //   [ConstantKeys.ROUNDED_LINE_X_RADIUS]: 8,
      //   [ConstantKeys.ROUNDED_LINE_Y_RADIUS]: 10,
      //   [ConstantKeys.INLINE_BLOCKS_INLINE_SPACING_TOP]: 23,
      //   [ConstantKeys.INLINE_BLOCKS_PADDING_BOTTOM]: 30,
      //   [ConstantKeys.COLLAPSED_SPACING]: 10,
      //   [ConstantKeys.BASE_COLOR]: '#B8BCC1',
      //   [ConstantKeys.BASE_ACTIVATED_COLOR]: '#82A7FC',
      // },
      /**
       * SelectBox config
       */
      selectBox: {
        SelectorBoxPopover,
      },
      // Config shortcuts
      shortcuts: (registry: ShortcutsRegistry, ctx) => {
        registry.addHandlers(...shortcutGetter.map((getter) => getter(ctx)));
        // press cmd + a to select all
        registry.addHandlers({
          commandId: 'selectAll',
          shortcuts: ['meta a', 'ctrl a'],
          execute() {
            const allNodes = ctx.document.getAllNodes();
            ctx.playground.selectionService.selection = allNodes;
          },
        });
      },
      /**
       * Drag/Drop config
       */
      dragdrop: {
        /**
         * Callback when drag drop
         */
        onDrop: (ctx, dropData) => {
          // console.log(
          //   '>>> onDrop: ',
          //   dropData.dropNode.id,
          //   dropData.dragNodes.map(n => n.id),
          // );
        },
        canDrop: (ctx, dropData) =>
          // console.log(
          //   '>>> canDrop: ',
          //   dropData.isBranch,
          //   dropData.dropNode.id,
          //   dropData.dragNodes.map(n => n.id),
          // );
          true,
      },
      /**
       * Redo/Undo enable
       */
      history: {
        enable: true,
        enableChangeNode: true, // Listen Node engine data change
        onApply(ctx, opt) {
          // Listen change to trigger auto save
          console.log('auto save: ', ctx.document.toJSON(), opt);
        },
      },
      /**
       * Node engine enable, you can configure formMeta in the FlowNodeRegistry
       */
      nodeEngine: {
        enable: true,
      },
      /**
       * Variable engine enable
       */
      variableEngine: {
        enable: true,
        layout: 'fixed',
      },
      /**
       * materials
       */
      materials: {
        renderNodes: {
          ...defaultFixedSemiMaterials,
          [FlowRendererKey.ADDER]: Adder,
          [FlowRendererKey.DRAG_NODE]: DragNode,
        },
        renderDefaultNode: BaseNode, // node render
        renderTexts: {
          'loop-end-text': 'Loop End',
          'loop-while-text': 'Condition Satisfied',
          'loop-traverse-text': 'Loop',
          'try-start-text': 'Try Start',
          'try-end-text': 'Try End',
          'catch-text': 'Catch',
        },
      },
      /**
       * Playground init
       */
      onInit: (ctx) => {
        console.log('---- Playground Init ----');
      },
      /**
       * Playground render
       */
      onAllLayersRendered: (ctx) => {
        ctx.playground.config.updateConfig({
          // Set default zoom
          zoom: 0.9,
        });
      },
      /**
       * Playground dispose
       */
      onDispose: () => {
        console.log('---- Playground Dispose ----');
      },
      plugins: () => [
        /**
         * Minimap plugin
         */
        createMinimapPlugin({
          disableLayer: true,
          enableDisplayAllNodes: true,
          canvasStyle: {
            canvasWidth: 182,
            canvasHeight: 102,
            canvasPadding: 50,
            canvasBackground: 'rgba(245, 245, 245, 1)',
            canvasBorderRadius: 10,
            viewportBackground: 'rgba(235, 235, 235, 1)',
            viewportBorderRadius: 4,
            viewportBorderColor: 'rgba(201, 201, 201, 1)',
            viewportBorderWidth: 1,
            viewportBorderDashLength: 2,
            nodeColor: 'rgba(255, 255, 255, 1)',
            nodeBorderRadius: 2,
            nodeBorderWidth: 0.145,
            nodeBorderColor: 'rgba(6, 7, 9, 0.10)',
            overlayColor: 'rgba(255, 255, 255, 0)',
          },
          inactiveDebounceTime: 1,
        }),
        /**
         * Group plugin
         */
        createGroupPlugin({
          components: {
            GroupBoxHeader,
            GroupNode,
          },
        }),
        createVariablePlugin({}),
        createClipboardPlugin(),
      ],
    }),
    []
  );
}

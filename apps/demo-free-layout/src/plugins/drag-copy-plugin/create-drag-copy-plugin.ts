/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import {
  definePluginCreator,
  PluginCreator,
  FreeLayoutPluginContext,
} from '@flowgram.ai/free-layout-editor';

import { DragCopyLayer } from './drag-copy-layer';

/**
 * Creates a plugin of contextmenu
 * @param ctx - The plugin context, containing the document and other relevant information.
 * @param options - Plugin options, currently an empty object.
 */
export const createDragCopyPlugin: PluginCreator<void> = definePluginCreator<
  void,
  FreeLayoutPluginContext
>({
  onInit(ctx, options) {
    ctx.playground.registerLayer(DragCopyLayer);
  },
});

import { definePluginCreator, PluginContext } from '@flowgram.ai/core';

import { FreeLinesPluginOptions } from './type';
import { LinesLayer } from './layer';

export const createFreeLinesPlugin = definePluginCreator({
  onInit: (ctx: PluginContext, opts: FreeLinesPluginOptions) => {
    ctx.playground.registerLayer(LinesLayer, {
      ...opts,
      renderElement: () => {
        if (typeof opts.renderElement === 'function') {
          return opts.renderElement(ctx);
        } else {
          return opts.renderElement;
        }
      },
    });
  },
});

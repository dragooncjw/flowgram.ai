import { bindConfigEntity } from '@flowgram.ai/core';
export { delay } from '@flowgram.ai/utils';

/**
 * 让 entity 可以注入到类中
 *
 * @example
 * ```
 *    class SomeClass {
 *      @inject(PlaygroundConfigEntity) playgroundConfig: PlaygroundConfigEntity
 *    }
 * ```
 * @param bind
 * @param entityRegistry
 */
export { bindConfigEntity };

export * from './fold-line';
export * from './bezier';
export * from './nanoid';
export * from './compose';
export * from './fit-view';
export * from './get-anti-overlap-position';
export * from './statics';
export * from './auto-layout';
export * from './auto-layout-node';

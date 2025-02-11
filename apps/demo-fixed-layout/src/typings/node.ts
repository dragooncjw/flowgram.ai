import {
  FlowNodeJSON as FlowNodeJSONDefault,
  FlowNodeRegistry as FlowNodeRegistryDefault,
  FixedLayoutPluginContext,
  FlowNodeEntity,
} from '@flowgram.ai/fixed-layout-editor';

import { type JsonSchema } from './json-schema';

export type FlowLiteralValueSchema = string | number | boolean;
export type FlowRefValueSchema =
  | { type: 'ref'; content?: string }
  | { type: 'expression'; content?: string }
  | { type: 'template'; content?: string };
export type FlowValueSchema = FlowLiteralValueSchema | FlowRefValueSchema;
/**
 * You can customize your own node json
 */
export interface FlowNodeJSON extends FlowNodeJSONDefault {
  data: {
    title: string;
    values?: Record<string, FlowValueSchema>;
    inputs?: JsonSchema;
    outputs?: JsonSchema;
  };
}

/**
 * You can customize your own node registry
 */
export interface FlowNodeRegistry extends FlowNodeRegistryDefault {
  /**
   * Define the inputs and outputs data of the node
   */
  definition: {
    info: {
      icon: string;
      description: string;
    };
    inputs?: JsonSchema;
    outputs?: JsonSchema;
  };
  canAdd?: (ctx: FixedLayoutPluginContext, from: FlowNodeEntity) => boolean;
  canDelete?: (ctx: FixedLayoutPluginContext, from: FlowNodeEntity) => boolean;
  onAdd?: (ctx: FixedLayoutPluginContext, from: FlowNodeEntity) => FlowNodeJSON;
}

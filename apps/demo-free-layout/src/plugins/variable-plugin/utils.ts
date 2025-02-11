import { get, set } from 'lodash-es';
import {
  type ArrayType,
  ASTKind,
  type ASTNodeJSON,
  type BaseType,
  type ObjectType,
} from '@flowgram.ai/free-layout-editor';

import { JsonSchema } from './json-schema';

function sortProperties(properties: Record<string, JsonSchema>) {
  return Object.entries(properties).sort(
    (a, b) => (get(a?.[1], 'extra.index') || 0) - (get(b?.[1], 'extra.index') || 0)
  );
}

export function createASTFromJSONSchema(jsonSchema: JsonSchema): ASTNodeJSON | undefined {
  const { type, $ref } = jsonSchema || {};

  if ($ref) {
    return {
      kind: 'RefCustomType',
      $ref,
    };
  }

  if (!type) {
    return undefined;
  }

  switch (type) {
    case 'object':
      return {
        kind: ASTKind.Object,
        properties: sortProperties(jsonSchema.properties || {}).map(([key, _property]) => ({
          key,
          type: createASTFromJSONSchema(_property),
          meta: { description: _property.description },
        })),
      };

    case 'array':
      return {
        kind: ASTKind.Array,
        items: createASTFromJSONSchema(jsonSchema.items!),
      };

    default:
      // Camel case to variable-core type
      return {
        kind: type.charAt(0).toUpperCase() + type.slice(1),
        enum: jsonSchema.enum,
      };
  }
}

export function parseASTToJSONSchema(type?: BaseType): JsonSchema | undefined {
  switch (type?.kind) {
    case ASTKind.Object:
      return {
        type: 'object',
        properties: (type as ObjectType).properties.reduce<Record<string, JsonSchema>>(
          (acm: any, curr, index) => {
            acm[curr.key] = parseASTToJSONSchema(curr.type);
            set(acm[curr.key], 'extra.index', index);
            return acm;
          },
          {}
        ),
      };

    case ASTKind.Array:
      return {
        type: 'array',
        items: parseASTToJSONSchema((type as ArrayType).items),
      };

    case 'RefCustomType':
      return {
        $ref: type?.$ref as string,
      };

    default:
      return {
        type: type?.kind.toLowerCase() as JsonSchema['type'],
        enum: type?.enum as string[],
      };
  }
}

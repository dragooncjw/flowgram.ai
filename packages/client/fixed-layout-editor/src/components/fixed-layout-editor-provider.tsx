import React, { useMemo, useCallback, forwardRef } from 'react';

import { interfaces } from 'inversify';
import {
  FlowDocument,
  createPluginContextDefault,
  PlaygroundReactProvider,
} from '@flowgram.ai/editor';

import { FlowOperationService } from '../types';
import { createFixedLayoutPreset, FixedLayoutPluginContext, FixedLayoutProps } from '../preset';

export const FixedLayoutEditorProvider = forwardRef<FixedLayoutPluginContext, FixedLayoutProps>(
  function FixedLayoutEditorProvider(props: FixedLayoutProps, ref) {
    const { parentContainer, children, ...others } = props;
    const preset = useMemo(() => createFixedLayoutPreset(others), []);
    const customPluginContext = useCallback(
      (container: interfaces.Container) =>
        ({
          ...createPluginContextDefault(container),
          get document(): FlowDocument {
            return container.get<FlowDocument>(FlowDocument);
          },
          get operation(): FlowOperationService {
            return container.get<FlowOperationService>(FlowOperationService);
          },
        } as FixedLayoutPluginContext),
      []
    );
    return (
      <PlaygroundReactProvider
        ref={ref}
        plugins={preset}
        customPluginContext={customPluginContext}
        parentContainer={parentContainer}
      >
        {children}
      </PlaygroundReactProvider>
    );
  }
);

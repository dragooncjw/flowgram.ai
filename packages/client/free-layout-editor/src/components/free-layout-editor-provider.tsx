import React, { useMemo, useCallback, forwardRef } from 'react';

import { interfaces } from 'inversify';
import { PlaygroundReactProvider, createPluginContextDefault } from '@flowgram.ai/editor';
import { WorkflowDocument } from '@flowgram.ai/free-layout-core';

import { createFreeLayoutPreset, FreeLayoutPluginContext, FreeLayoutProps } from '../preset';

export const FreeLayoutEditorProvider = forwardRef<FreeLayoutPluginContext, FreeLayoutProps>(
  function FreeLayoutEditorProvider(props: FreeLayoutProps, ref) {
    const { children, ...others } = props;
    const preset = useMemo(() => createFreeLayoutPreset(others), []);
    const customPluginContext = useCallback(
      (container: interfaces.Container) =>
        ({
          ...createPluginContextDefault(container),
          get document(): WorkflowDocument {
            return container.get<WorkflowDocument>(WorkflowDocument);
          },
        } as FreeLayoutPluginContext),
      [],
    );
    return (
      <PlaygroundReactProvider ref={ref} plugins={preset} customPluginContext={customPluginContext}>
        {children}
      </PlaygroundReactProvider>
    );
  },
);

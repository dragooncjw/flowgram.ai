'use client';
import { useEffect, useState } from 'react';

import { Editor } from './editor';

export const EditorClient = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // only render <Editor /> in browser client
    return null;
  }

  return <Editor />;
};

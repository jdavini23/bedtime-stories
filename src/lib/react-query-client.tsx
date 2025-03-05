'use client';

import React from 'react';
import { ReactNode } from 'react';
import BaseReactQueryProvider from './ReactQueryProvider.client';

interface ReactQueryProviderProps {
  children: ReactNode;
}

export const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => {
  return (
    <BaseReactQueryProvider>
      {children}
    </BaseReactQueryProvider>
  );
}
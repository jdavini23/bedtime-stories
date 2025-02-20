'use client';

import React from 'react';
import { ClerkProvider as BaseClerkProvider } from '@clerk/nextjs';

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  return <BaseClerkProvider>{children}</BaseClerkProvider>;
}

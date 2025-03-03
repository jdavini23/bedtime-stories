'use client';

import React from 'react';

export function DynamicFontLoader() {
  return (
    <link
      href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
      media="print"
      onLoad={(e) => {
        const link = e.currentTarget;
        link.media = 'all';
      }}
    />
  );
}

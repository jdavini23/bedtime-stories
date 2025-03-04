'use client';

import React, { useEffect, useState } from 'react';

export default function HydrationTestPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Hydration Test Page</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg mb-4">
            This page is used to test if hydration issues have been resolved.
          </p>
          <div className="p-4 border rounded">
            <p>Client-side rendering status: {isClient ? 'Active' : 'Not active yet'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

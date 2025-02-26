'use client';

import React from 'react';
import StorybookSvg from '@/components/StorybookSvg';

export default function TestSvgPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-8">SVG Test Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">StorybookSvg Component</h2>
          <div className="w-64 h-64 flex items-center justify-center">
            <StorybookSvg className="w-full h-full" />
          </div>
        </div>

        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Direct SVG from public folder</h2>
          <div className="w-64 h-64 flex items-center justify-center">
            <img
              src="/images/illustrations/storybook.svg"
              alt="Storybook SVG"
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/illustrations/test-storybook.svg';
              }}
            />
          </div>
        </div>

        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Inline SVG</h2>
          <div className="w-64 h-64 flex items-center justify-center">
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="40" y="60" width="120" height="80" rx="5" fill="#8B5CF6" />
              <rect x="45" y="65" width="110" height="70" rx="3" fill="#A78BFA" />
              <rect x="100" y="65" width="2" height="70" fill="#7C3AED" />
              <rect x="50" y="75" width="45" height="5" fill="#EDE9FE" />
              <rect x="50" y="85" width="45" height="5" fill="#EDE9FE" />
              <rect x="50" y="95" width="45" height="5" fill="#EDE9FE" />
              <rect x="50" y="105" width="45" height="5" fill="#EDE9FE" />
              <rect x="50" y="115" width="45" height="5" fill="#EDE9FE" />
              <rect x="105" y="75" width="45" height="5" fill="#EDE9FE" />
              <rect x="105" y="85" width="45" height="5" fill="#EDE9FE" />
              <rect x="105" y="95" width="45" height="5" fill="#EDE9FE" />
              <rect x="105" y="105" width="45" height="5" fill="#EDE9FE" />
              <rect x="105" y="115" width="45" height="5" fill="#EDE9FE" />
              <path d="M150 65V90L145 85L140 90V65H150Z" fill="#EF4444" />
              <text
                x="100"
                y="140"
                fontFamily="Arial"
                fontSize="16"
                fill="#4B5563"
                textAnchor="middle"
              >
                Story Book
              </text>
            </svg>
          </div>
        </div>

        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Test SVG</h2>
          <div className="w-64 h-64 flex items-center justify-center">
            <img
              src="/images/illustrations/test-storybook.svg"
              alt="Test Storybook SVG"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

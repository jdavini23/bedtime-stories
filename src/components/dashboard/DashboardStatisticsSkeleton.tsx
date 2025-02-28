import React from 'react';

export default function DashboardStatisticsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-white p-4 rounded-lg shadow-sm">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-1 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}

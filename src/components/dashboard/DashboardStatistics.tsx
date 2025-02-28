import React from 'react';

interface DashboardStatisticsProps {
  userId: string;
}

export default async function DashboardStatistics({ userId }: DashboardStatisticsProps) {
  // In a real application, you would fetch these statistics from your database
  // For now, we'll use placeholder data
  const stats = [
    {
      title: 'Stories Created',
      value: '12',
      description: 'Total stories generated',
    },
    {
      title: 'Reading Time',
      value: '3.5 hrs',
      description: 'Total time spent reading',
    },
    {
      title: 'Favorite Theme',
      value: 'Adventure',
      description: 'Most selected theme',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          <p className="text-sm text-gray-600">{stat.description}</p>
        </div>
      ))}
    </div>
  );
}

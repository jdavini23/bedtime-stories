import React from 'react';
import { Book, Star, Clock } from 'lucide-react';
import { UserPreferences } from '@/services/userPreferencesService';
import { getUserPreferences } from '@/lib/server/userPreferences';

interface DashboardStatisticsProps {
  userId: string | null | null | null | null | null | null;
}

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
}> = ({ icon, title, value, color }) => (
  <div className={`bg-white shadow rounded-lg p-4 flex items-center space-x-4 ${color}`}>
    <div className={`p-3 rounded-full ${color} bg-opacity-20`}>{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

export default async function DashboardStatistics({ userId }: DashboardStatisticsProps) {
  // Fetch user preferences server-side
  const preferences = await getUserPreferences(userId);

  // Provide default values if preferences are undefined
  const defaultPreferences: Partial<UserPreferences> = {
    generatedStoryCount: 0,
    preferredThemes: [],
    lastStoryGeneratedAt: undefined,
  };

  const safePreferences = preferences || defaultPreferences;

  const statistics = [
    {
      icon: <Book className="text-blue-500" />,
      title: 'Stories Generated',
      value: safePreferences.generatedStoryCount ?? 0,
      color: 'text-blue-500',
    },
    {
      icon: <Star className="text-yellow-500" />,
      title: 'Favorite Themes',
      value: safePreferences.preferredThemes?.length ?? 0,
      color: 'text-yellow-500',
    },
    {
      icon: <Clock className="text-green-500" />,
      title: 'Last Story Generated',
      value: safePreferences.lastStoryGeneratedAt
        ? new Date(safePreferences.lastStoryGeneratedAt).toLocaleDateString()
        : 'Never',
      color: 'text-green-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statistics.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          title={stat.title}
          value={stat.value}
          color={stat.color}
        />
      ))}
    </div>
  );
}

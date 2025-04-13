
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RsvpCounts } from '@/types/rsvp';
import { Users, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface StatsCardProps {
  counts: RsvpCounts;
}

const StatsCard: React.FC<StatsCardProps> = ({ counts }) => {
  const stats = [
    {
      title: "Total Players",
      value: counts.total,
      icon: <Users className="h-4 w-4 text-blue-500" />,
      color: "text-blue-500"
    },
    {
      title: "Confirmed",
      value: counts.confirmed,
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      color: "text-green-500"
    },
    {
      title: "Declined",
      value: counts.declined,
      icon: <XCircle className="h-4 w-4 text-red-500" />,
      color: "text-red-500"
    },
    {
      title: "Maybe",
      value: counts.maybe,
      icon: <HelpCircle className="h-4 w-4 text-yellow-500" />,
      color: "text-yellow-500"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Attendance Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.title} className="flex flex-col items-center p-3 border rounded-lg bg-white shadow-sm">
              <div className="flex items-center justify-center mb-2">
                {stat.icon}
                <span className="text-sm font-medium ml-1">{stat.title}</span>
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;

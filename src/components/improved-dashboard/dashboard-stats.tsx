"use client"

import { useEffect, useState } from 'react';
import { getStatistics, getTrainingApplications } from '../../api/dashboard';
import CountUp from 'react-countup';
import { 
  Users, ClipboardList, UserCircle2, 
  TrendingUp, TrendingDown, 
  Laptop, Sprout, Calculator, LineChart
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";

const trainingTypes = [
  'INFORMATION_SCIENCE',
  'AGROBUSINESS',
  'ACCOUNTING',
  'MARKETING'
];

const trainingIcons = {
  INFORMATION_SCIENCE: Laptop,
  AGROBUSINESS: Sprout,
  ACCOUNTING: Calculator,
  MARKETING: LineChart
};

export function DashboardStats() {
  const [statistics, setStatistics] = useState({
    users: 0,
    applications: 0,
    teamMembers: 0,
  });
  const [trainingData, setTrainingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, trainingResponse] = await Promise.all([
          getStatistics(),
          getTrainingApplications()
        ]);

        setStatistics(statsResponse.data);

        const data = trainingResponse.data;
        const trainingMap = trainingTypes.reduce((acc, type) => {
          acc[type] = 0;
          return acc;
        }, {});

        data.forEach((item: any) => {
          trainingMap[item.trainingType] = item.count;
        });

        const trainingArray = Object.keys(trainingMap).map(type => ({
          trainingType: type,
          count: trainingMap[type],
          percentage: Math.round((trainingMap[type] / statsResponse.data.applications) * 100) || 0,
          trend: Math.random() > 0.5
        }));

        setTrainingData(trainingArray);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-200 animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-secondary border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={statistics.users}
          icon={Users}
          gradient="bg-secondary"
          secondaryValue={12}
        />
        <StatCard
          title="Applications"
          value={statistics.applications}
          icon={ClipboardList}
          gradient="bg-primary"
          secondaryValue={8}
        />
        <StatCard
          title="Team Members"
          value={statistics.teamMembers}
          icon={UserCircle2}
          gradient="bg-violet-500"
          secondaryValue={15}
        />
      </div>

      <Card className="border border-gray-200/80 shadow-lg">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-gray-900 mb-2">Training Applications</CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Distribution across different programs
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">{statistics.applications} Total Applications</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainingData.map((item, index) => (
              <TrainingCard key={index} data={item} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const StatCard = ({ title, value, icon: Icon, gradient, secondaryValue }: { title: string, value: number, icon: React.ElementType, gradient: string, secondaryValue: number }) => (
  <Card className="relative overflow-hidden border-none group hover:scale-[1.02] transition-all duration-300">
    <div className={`absolute inset-0 ${gradient} opacity-[0.08] group-hover:opacity-[0.11] transition-opacity`} />
    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
    <CardContent className="p-6 relative">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3.5 rounded-xl ${gradient} bg-opacity-15 shadow-lg transform group-hover:-translate-y-0.5 transition-transform`}>
          <Icon className="w-6 h-6 text-white drop-shadow-sm" strokeWidth={1.5} />
        </div>
        {secondaryValue && (
          <div className="flex items-center px-3.5 py-2 rounded-full bg-emerald-500/10 text-emerald-600 font-medium backdrop-blur-sm shadow-sm">
            <TrendingUp className="w-4 h-4 mr-1.5 animate-pulse" />
            <span className="text-sm">+{secondaryValue}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-3xl font-bold tracking-tight text-gray-900 group-hover:text-gray-800">
          <CountUp end={value} duration={2} separator="," />
        </h3>
        <p className="text-sm text-gray-600 mt-2 font-medium group-hover:text-gray-700">{title}</p>
      </div>
    </CardContent>
  </Card>
);

const TrainingCard = ({ data }: { data: any }) => {
  const Icon = trainingIcons[data.trainingType];
  
  const formatTrainingType = (type: string) => {
    return type.split('_').map((word: string) => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const getGradientByType = (type: string) => {
    const gradients = {
      'INFORMATION_SCIENCE': 'from-blue-500/20 to-blue-600/20',
      'AGROBUSINESS': 'from-emerald-500/20 to-emerald-600/20',
      'ACCOUNTING': 'from-violet-500/20 to-violet-600/20',
      'MARKETING': 'from-amber-500/20 to-amber-600/20'
    };
    return gradients[type] || 'from-gray-500/20 to-gray-600/20';
  };

  return (
    <Card className="group border border-gray-200/80 hover:border-gray-300 transition-all duration-300 hover:shadow-lg relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradientByType(data.trainingType)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-secondary/10 shadow-sm group-hover:shadow-md transition-shadow">
              <Icon className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            </div>
            <CardTitle className="text-base font-semibold text-gray-900 group-hover:text-gray-800">
              {formatTrainingType(data.trainingType)}
            </CardTitle>
          </div>
          <div className={`flex items-center ${
            data.trend 
              ? 'text-emerald-600 bg-emerald-50/80 dark:bg-emerald-500/10' 
              : 'text-rose-600 bg-rose-50/80 dark:bg-rose-500/10'
            } rounded-full p-2 backdrop-blur-sm shadow-sm group-hover:shadow-md transition-shadow`}
          >
            {data.trend ? 
              <TrendingUp className="w-4 h-4 group-hover:scale-110 transition-transform" /> : 
              <TrendingDown className="w-4 h-4 group-hover:scale-110 transition-transform" />
            }
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-3xl font-bold text-gray-900 group-hover:text-gray-800">
              <CountUp end={data.count} duration={2} />
            </span>
            <span className="text-sm font-medium text-gray-500 group-hover:text-gray-600">
              {data.percentage}% of total
            </span>
          </div>
          <div className="w-full bg-gray-100/80 rounded-full h-2.5 overflow-hidden shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                data.trainingType === 'INFORMATION_SCIENCE' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                data.trainingType === 'AGROBUSINESS' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                data.trainingType === 'ACCOUNTING' ? 'bg-gradient-to-r from-violet-500 to-violet-600' :
                'bg-gradient-to-r from-amber-500 to-amber-600'
              } group-hover:scale-x-105 origin-left`}
              style={{ width: `${data.percentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

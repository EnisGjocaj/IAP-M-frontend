import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getStatistics, getTrainingApplications } from '../../api/dashboard'; 
import { useNavigate } from 'react-router-dom';
import formatNumber from '../../utils/formatNumber';
import CountUp from 'react-countup';
import { FaUsers, FaClipboardList, FaUserTie, FaGraduationCap, FaChartLine } from 'react-icons/fa';
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi';
import DashboardJobListings from './DashboardJobListings';
import CreateJobListingForm from './CreateJobListingForm';

const trainingTypes = [
  'INFORMATION_SCIENCE',
  'AGROBUSINESS',
  'ACCOUNTING',
  'MARKETING'
];

const trainingIcons = {
  INFORMATION_SCIENCE: '💻',
  AGROBUSINESS: '🌾',
  ACCOUNTING: '📊',
  MARKETING: '📈'
};

const DashboardForAdmin = () => {
  const [statistics, setStatistics] = useState({
    users: 0,
    applications: 0,
    teamMembers: 0,
  });
  const [trainingData, setTrainingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
    fetchTrainingApplications();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await getStatistics();
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchTrainingApplications = async () => {
    try {
      const response = await getTrainingApplications();
      const data = response.data;
      
      const trainingMap = trainingTypes.reduce((acc, type) => {
        acc[type] = 0;
        return acc;
      }, {});

      data.forEach(item => {
        trainingMap[item.trainingType] = item.count;
      });

      const trainingArray = Object.keys(trainingMap).map(type => ({
        trainingType: type,
        count: trainingMap[type],
        percentage: Math.round((trainingMap[type] / statistics.applications) * 100) || 0,
        trend: Math.random() > 0.5 // Simulated trend, replace with actual trend data
      }));

      setTrainingData(trainingArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching training applications:', error);
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, secondaryValue }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {secondaryValue && (
            <div className="flex items-center text-sm font-medium text-green-600">
              <HiTrendingUp className="w-4 h-4 mr-1" />
              {secondaryValue}%
            </div>
          )}
        </div>
        <div className="flex items-baseline">
          <h3 className="text-2xl font-bold text-gray-900">
            <CountUp end={value} duration={2} separator="," />
          </h3>
        </div>
        <p className="text-sm font-medium text-gray-500 mt-2">{title}</p>
      </div>
      <div className={`h-1 ${color}`} />
    </div>
  );

  const TrainingCard = ({ data }) => {
    const formatTrainingType = (type) => {
      return type.split('_').map(word => 
        word.charAt(0) + word.slice(1).toLowerCase()
      ).join(' ');
    };

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{trainingIcons[data.trainingType]}</span>
              <h3 className="font-semibold text-gray-900">{formatTrainingType(data.trainingType)}</h3>
            </div>
            <div className={`flex items-center ${data.trend ? 'text-green-600' : 'text-red-600'}`}>
              {data.trend ? <HiTrendingUp className="w-5 h-5" /> : <HiTrendingDown className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl font-bold text-gray-900">
                <CountUp end={data.count} duration={2} />
              </span>
              <span className="text-sm font-medium text-gray-500">
                {data.percentage}% of total
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${data.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Routes>
        <Route index element={
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <StatCard
                title="Total Users"
                value={statistics.users}
                icon={FaUsers}
                color="bg-blue-500"
                secondaryValue={12}
              />
              <StatCard
                title="Applications"
                value={statistics.applications}
                icon={FaClipboardList}
                color="bg-green-500"
                secondaryValue={8}
              />
              <StatCard
                title="Team Members"
                value={statistics.teamMembers}
                icon={FaUserTie}
                color="bg-purple-500"
                secondaryValue={15}
              />
            </div>

            {/* Training Applications Section */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Training Applications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {!loading && trainingData.map((item, index) => (
                  <TrainingCard key={index} data={item} />
                ))}
              </div>
            </div>
          </div>
        } />
        
        {/* Job Listings Routes */}
        <Route path="jobs" element={<DashboardJobListings />} />
        <Route path="create-job" element={<CreateJobListingForm />} />
        <Route path="edit-job/:id" element={<CreateJobListingForm />} />
      </Routes>
    </div>
  );
};

export default DashboardForAdmin;
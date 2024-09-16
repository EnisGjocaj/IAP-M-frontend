import React, { useEffect, useState } from 'react';
import { getStatistics, getTrainingApplications } from '../../api/dashboard'; 
import { useNavigate } from 'react-router-dom';

import formatNumber from '../../utils/formatNumber';
import CountUp from 'react-countup';


const trainingTypes = [
    'INFORMATION_SCIENCE',
    'AGROBUSINESS',
    'ACCOUNTING',
    'MARKETING'
  ];
  
  const DashboardForAdmin = () => {
    const [statistics, setStatistics] = useState({
      users: 0,
      applications: 0,
      teamMembers: 0,
    });
    const [trainingData, setTrainingData] = useState([]);
  
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
        
        // Initialize trainingData with all training types set to 0
        const trainingMap = trainingTypes.reduce((acc, type) => {
          acc[type] = 0;
          return acc;
        }, {});
  
        // Update trainingMap with actual counts from the API response
        data.forEach(item => {
          trainingMap[item.trainingType] = item.count;
        });
  
        // Convert the map to an array
        const trainingArray = Object.keys(trainingMap).map(type => ({
          trainingType: type,
          count: trainingMap[type]
        }));
  
        setTrainingData(trainingArray);
      } catch (error) {
        console.error('Error fetching training applications:', error);
      }
    };
  
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
        
        {/* Main Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <div className="text-center flex-grow">
              <h2 className="text-2xl font-bold text-blue-600">
                <CountUp end={statistics.users} duration={2} />
              </h2>
              <p className="text-gray-600">Users</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <div className="text-center flex-grow">
              <h2 className="text-2xl font-bold text-yellow-600">
                <CountUp end={statistics.applications} duration={2} />
              </h2>
              <p className="text-gray-600">Applications</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <div className="text-center flex-grow">
              <h2 className="text-2xl font-bold text-gray-800">
                <CountUp end={statistics.teamMembers} duration={2} />
              </h2>
              <p className="text-gray-600">Team Members</p>
            </div>
          </div>
        </div>
  
        {/* Training Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainingData.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <h2 className="text-xl font-bold text-blue-600">
                <CountUp end={item.count} duration={2} />
              </h2>
              <p className="text-gray-600">{item.trainingType}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

export default DashboardForAdmin;
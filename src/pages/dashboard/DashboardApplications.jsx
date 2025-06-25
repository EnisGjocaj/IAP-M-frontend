import React, { useEffect, useState } from 'react';

import { deleteApplication, getAllApplications } from '../../api/application';
import { useNavigate } from 'react-router-dom';

import CustomTable from '../../components/common/CustomTable';

const DashboardApplications = () => {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await getAllApplications();
      console.log(response.data.message);
      setApplications(response.data.message); 
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleDelete = async (id) => {
      try {
        await deleteApplication(id);
        fetchApplications();
      } catch (error) {
        console.error('Error deleting application:', error);
      }
  };

  const headers = ['ID', 'Name', 'Surname', 'Email', 'Phone', 'Type'];

  const tableData = applications.map((app) => ({
    id: app.id,
    name: app.name,
    surname: app.surname,
    email: app.email.toLowerCase(),
    phone: app.phoneNumber || 'N/A',
    type: app.type,
  }));


  console.log(tableData)
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Applications</h1>
        <button
          onClick={() => navigate('/admin/create-application')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Application
        </button>
      </div>
      <CustomTable headers={headers} data={tableData} onDelete={handleDelete} />
    </div>
  );
};

export default DashboardApplications;

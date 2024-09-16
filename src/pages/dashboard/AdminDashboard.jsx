

// src/pages/AdminDashboard.js
import React , { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import DashbaordApplications from './DashboardApplications'; // Adjust import to your file name
import DashboardNews from './DashboardNews'; // Adjust import to your file name
import Sidebar from './Sidebar';
import CreateApplicationForm from './CreateApplicationForm';
import CreateNewsForm from './CreateNewsForm';

import DashboardTeamMembers from './DashboardTeamMembers';
import CreateTeamMemberForm from './CreateTeamMemberForm';

import DashboardUsers from './DashboardUsers';
import CreateUserForm from './CreateUserForm';

import { ToastContainer } from 'react-toastify';

import DashboardForAdmin from './DashboardForAdmin';
import { HiMenu } from 'react-icons/hi';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content area */}
      <div className={`flex-1 bg-gray-100 p-8 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* Menu toggle button for small screens */}
        <button 
  className="lg:hidden mb-4 p-2 bg-gray-200 rounded-md focus:outline-none" 
  onClick={() => {
    console.log('Toggle button clicked'); // Add this line to check if the click event is fired
    setSidebarOpen(!sidebarOpen);
  }}    
>
  <HiMenu size={24} />
</button>



        {/* Routes */}
        <Routes>
          <Route path="/" element={<DashboardForAdmin />} />
          <Route path="dashboard-applications" element={<DashbaordApplications />} />
          <Route path="dashboard-news" element={<DashboardNews />} />
          <Route path="create-application" element={<CreateApplicationForm />} />
          <Route path="create-news" element={<CreateNewsForm />} />
          <Route path="dashboard-team-members" element={<DashboardTeamMembers />} />
          <Route path="create-team-member" element={<CreateTeamMemberForm />} />
          <Route path="dashboard-users" element={<DashboardUsers />} />
          <Route path="create-user" element={<CreateUserForm />} />
          <Route path="edit-user/:id" element={<CreateUserForm />} />
          <Route path="edit-team-member/:id" element={<CreateTeamMemberForm />} />
          <Route path="edit-news/:id" element={<CreateNewsForm />} />
        </Routes>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;

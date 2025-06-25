import React , { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import DashbaordApplications from './DashboardApplications';
import DashboardNews from './DashboardNews'; 
import Sidebar from './Sidebar';
import CreateApplicationForm from './CreateApplicationForm';
import CreateNewsForm from './CreateNewsForm';
import DashboardTeamMembers from './DashboardTeamMembers';
import CreateTeamMemberForm from './CreateTeamMemberForm';
import DashboardUsers from './DashboardUsers';
import CreateUserForm from './CreateUserForm';
import DashboardJobListings from './DashboardJobListings';
import CreateJobListingForm from './CreateJobListingForm';
import { ToastContainer } from 'react-toastify';
import DashboardForAdmin from './DashboardForAdmin';
import { HiMenu } from 'react-icons/hi';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>
        <button 
          className="lg:hidden p-4 focus:outline-none" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <HiMenu size={24} />
        </button>

        <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
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
            
            <Route path="dashboard-job-listings" element={<DashboardJobListings />} />
            <Route path="create-job-listing" element={<CreateJobListingForm />} />
            <Route path="edit-job-listing/:id" element={<CreateJobListingForm />} />
          </Routes>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;

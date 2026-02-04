import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AppSidebar } from '../../components/improved-dashboard/app-sidebar';
import { SidebarProvider } from '../../components/ui/sidebar';

// Main Dashboard
import DashboardPage from '../../components/improved-dashboard/main-page';

// Applications
import ApplicationsPage from '../../components/improved-dashboard/applications/applications-list';
import NewApplicationPage from '../../components/improved-dashboard/applications/application-form';

// Users
import UsersPage from '../../components/improved-dashboard/users/users-list';
import NewUserPage from '../../components/improved-dashboard/users/users-form';

// Board Members
import BoardMembersPage from '../../components/improved-dashboard/board-members/board-member-list';
import NewBoardMemberPage from '../../components/improved-dashboard/board-members/board-member-form';

// News
import NewsPage from '../../components/improved-dashboard/news/news-list';
import NewNewsPage from '../../components/improved-dashboard/news/news-form';

// Jobs
import JobsPage from '../../components/improved-dashboard/jobs/jobs-list';
import NewJobPage from '../../components/improved-dashboard/jobs/jobs-form';

// Featured Students
import FeaturedStudentsPage from '../../components/improved-dashboard/featured-students/featured-students-list';
import NewFeaturedStudentPage from '../../components/improved-dashboard/featured-students/featured-students-form';

// Students
import StudentsPage from '../../components/improved-dashboard/students/students-list';
// import StudentProfilePage from '../../components/improved-dashboard/students/student-profile';
// import EditStudentPage from '../../components/improved-dashboard/students/edit-student';

// Training Management
import TrainingsPage from '../../components/improved-dashboard/trainings/training-list';
import NewTrainingPage from '../../components/improved-dashboard/trainings/training-form';

// AI Management
import AdminAiMaterialsPage from '../../components/improved-dashboard/ai-materials/ai-materials-list';

const DashboardLayout = ({ children }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="relative flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          {children}
        </div>
        <ToastContainer />
      </div>
    </SidebarProvider>
  );
};

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        {/* Main Dashboard */}
        <Route path="/" element={<DashboardPage />} />

        {/* Users Management */}
        <Route path="users" element={<UsersPage />} />
        <Route path="users/new" element={<NewUserPage />} />
        <Route path="users/:id/edit" element={<NewUserPage />} />

        {/* Board Members */}
        <Route path="board-members" element={<BoardMembersPage />} />
        <Route path="board-members/new" element={<NewBoardMemberPage />} />
        <Route path="board-members/:id/edit" element={<NewBoardMemberPage />} />

        {/* News & Articles */}
        <Route path="news" element={<NewsPage />} />
        <Route path="news/new" element={<NewNewsPage />} />
        <Route path="news/:id/edit" element={<NewNewsPage />} />

        {/* Applications */}
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="applications/new" element={<NewApplicationPage />} />
        <Route path="applications/:id/edit" element={<NewApplicationPage />} />

        {/* Job Listings */}
        <Route path="jobs" element={<JobsPage />} />
        <Route path="jobs/new" element={<NewJobPage />} />
        <Route path="jobs/:id/edit" element={<NewJobPage />} />

        {/* Featured Students */}
        <Route path="featured-students" element={<FeaturedStudentsPage />} />
        <Route path="featured-students/new" element={<NewFeaturedStudentPage />} />
        <Route path="featured-students/:id/edit" element={<NewFeaturedStudentPage />} />

        {/* Students */}
        <Route path="students" element={<StudentsPage />} />
        {/* <Route path="students/:id" element={<StudentProfilePage />} />
        <Route path="students/:id/edit" element={<EditStudentPage />} /> */}

        {/* Training Management */}
        <Route path="trainings" element={<TrainingsPage />} />
        <Route path="trainings/new" element={<NewTrainingPage />} />
        <Route path="trainings/:id/edit" element={<NewTrainingPage />} />

        {/* AI Management */}
        <Route path="ai/materials" element={<AdminAiMaterialsPage />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;

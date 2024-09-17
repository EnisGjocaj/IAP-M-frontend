import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Layout } from "./components/common/Layout"
import { Home } from "./pages/Home"
import { BlogSinglePage } from "./components/common/BlogSinglePage"
import { About } from "./pages/About"
import { Courses } from "./pages/Courses"
import { Blog } from "./pages/Blog"
import { Instructor } from "./pages/Instructor"
import { News } from "./pages/News"
import { NewsDetail } from "./pages/NewsDetail"
import ApplicationForm from "./pages/ApplicationForm"

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminDashboard from "./pages/dashboard/AdminDashboard"
import DashbaordApplications from "./pages/dashboard/DashboardApplications"
import DashboardNews from "./pages/dashboard/DashboardNews"
import { Signup } from "./pages/Signup"
import TeamSection from "./pages/TeamSection"

import { AuthProvider } from "./contexts/authContext"

import ProfileDetails from "./components/common/ProfileDetails"
import TeamMemberProfile from "./pages/TeamMemberProfile"


function App() {
  return (
    <>
      <BrowserRouter basename="/">
      <AuthProvider>
        <Routes>
          <Route
            path='/'
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path='/about'
            element={
              <Layout>
                <About />
              </Layout>
            }
          />
          <Route
            path='/courses'
            element={
              <Layout>
                <Courses />
              </Layout>
            }
          />
          <Route
            path='/instructor'
            element={
              <Layout>
                <Instructor />
              </Layout>
            }
          />
          <Route
            path='/blog'
            element={
              <Layout>
                <Blog />
              </Layout>
            }
          />
          <Route
            path='/single-blog'
            element={
              <Layout>
                <BlogSinglePage />
              </Layout>
            }
          />

          <Route path='/news' element={<Layout><News /></Layout>} />

          <Route path='/news/:id' element={<Layout><NewsDetail /></Layout>} /> 

          <Route path='/application' element={<Layout><ApplicationForm />
             </Layout>} />
            
          <Route path='/admin/*' element={<AdminDashboard /> } />
          {/* <Route path='/admin' element={<Layout><AdminDashboard /></Layout>} />  */}

          <Route path='/bord' element={<Layout><TeamSection />  </Layout>} />

          <Route path="/signup" element={<Layout><Signup /> </Layout>}/>

          <Route path="/bord/team/:id" element={<Layout><TeamMemberProfile /> </Layout>} />


        </Routes>
        <ToastContainer />
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App

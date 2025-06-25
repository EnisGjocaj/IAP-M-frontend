import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import { FaUsers, FaNewspaper, FaUserGraduate, FaChalkboardTeacher, FaTachometerAlt, FaChevronRight } from 'react-icons/fa';
import { BriefcaseIcon as FiBriefcase } from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen || 
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      ) 
        return; 
      setSidebarOpen(false); 
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [sidebarOpen]); 
  
  useEffect(() => {
    console.log('sidebarOpen:', sidebarOpen); 
    console.log('sidebarExpanded:', sidebarExpanded); 
  }, [sidebarOpen, sidebarExpanded]);

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:translate-x-0 shadow-xl border-r border-gray-700`}
    >
     
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-xl font-bold">IM</span>
          </div>
          <span className="text-white text-lg font-bold tracking-wider">IAP-M</span>
        </NavLink>
      </div>

   
      <nav className="flex-1 overflow-y-auto overflow-x-hidden mt-5 py-4 px-4 lg:mt-6 lg:px-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 px-4 py-2">
            <FaTachometerAlt className="text-gray-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Dashboard</span>
          </div>
        </div>

        <ul className="space-y-2">
          <SidebarLinkGroup activeCondition={pathname.includes('/users')}>
            {(handleClick, open) => (
              <React.Fragment>
                <NavLink
                  to="#"
                  className={`group relative flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-300 transition-all duration-200 ease-in-out hover:bg-gray-700/50 ${
                    pathname.includes('/users') && 'bg-blue-600/10 text-blue-500'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                  }}
                >
                  <FaUsers className={`text-lg ${pathname.includes('/users') ? 'text-blue-500' : 'text-gray-400 group-hover:text-white'}`} />
                  <span className="flex-1">Users</span>
                  <FaChevronRight className={`text-sm transition-transform duration-200 ${open ? 'rotate-90' : ''} ${pathname.includes('/users') ? 'text-blue-500' : 'text-gray-400'}`} />
                </NavLink>
                <div className={`mt-2 transition-all duration-200 ease-in-out space-y-1 ${!open && 'hidden'}`}>
                  <NavLink
                    to="/admin/dashboard-users"
                    className={({ isActive }) =>
                      'flex items-center gap-2 rounded-lg pl-11 pr-4 py-2 text-sm font-medium transition-colors ' +
                      (isActive
                        ? 'text-blue-500 bg-blue-600/10'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50')
                    }
                  >
                    User List
                  </NavLink>
                  <NavLink
                    to="/admin/create-user"
                    className={({ isActive }) =>
                      'flex items-center gap-2 rounded-lg pl-11 pr-4 py-2 text-sm font-medium transition-colors ' +
                      (isActive
                        ? 'text-blue-500 bg-blue-600/10'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50')
                    }
                  >
                    Create User
                  </NavLink>
                </div>
              </React.Fragment>
            )}
          </SidebarLinkGroup>

          <SidebarLinkGroup activeCondition={pathname.includes('/bord')}>
            {(handleClick, open) => (
              <React.Fragment>
                <NavLink
                  to="#"
                  className={`group relative flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-300 transition-all duration-200 ease-in-out hover:bg-gray-700/50 ${
                    pathname.includes('/bord') && 'bg-blue-600/10 text-blue-500'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                  }}
                >
                  <FaChalkboardTeacher className={`text-lg ${pathname.includes('/bord') ? 'text-blue-500' : 'text-gray-400 group-hover:text-white'}`} />
                  <span className="flex-1">Board</span>
                  <FaChevronRight className={`text-sm transition-transform duration-200 ${open ? 'rotate-90' : ''} ${pathname.includes('/bord') ? 'text-blue-500' : 'text-gray-400'}`} />
                </NavLink>
                <div className={`mt-2 transition-all duration-200 ease-in-out space-y-1 ${!open && 'hidden'}`}>
                  <NavLink
                    to="/admin/dashboard-team-members"
                    className={({ isActive }) =>
                      'flex items-center gap-2 rounded-lg pl-11 pr-4 py-2 text-sm font-medium transition-colors ' +
                      (isActive
                        ? 'text-blue-500 bg-blue-600/10'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50')
                    }
                  >
                    Board Member List
                  </NavLink>
                  <NavLink
                    to="/admin/create-team-member"
                    className={({ isActive }) =>
                      'flex items-center gap-2 rounded-lg pl-11 pr-4 py-2 text-sm font-medium transition-colors ' +
                      (isActive
                        ? 'text-blue-500 bg-blue-600/10'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50')
                    }
                  >
                    Create Board Member
                  </NavLink>
                </div>
              </React.Fragment>
            )}
          </SidebarLinkGroup>

          <SidebarLinkGroup activeCondition={pathname.includes('/news')}>
            {(handleClick, open) => (
              <React.Fragment>
                <NavLink
                  to="#"
                  className={`group relative flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-300 transition-all duration-200 ease-in-out hover:bg-gray-700/50 ${
                    pathname.includes('/news') && 'bg-blue-600/10 text-blue-500'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                  }}
                >
                  <FaNewspaper className={`text-lg ${pathname.includes('/news') ? 'text-blue-500' : 'text-gray-400 group-hover:text-white'}`} />
                  <span className="flex-1">News</span>
                  <FaChevronRight className={`text-sm transition-transform duration-200 ${open ? 'rotate-90' : ''} ${pathname.includes('/news') ? 'text-blue-500' : 'text-gray-400'}`} />
                </NavLink>
                <div className={`mt-2 transition-all duration-200 ease-in-out space-y-1 ${!open && 'hidden'}`}>
                  <NavLink
                    to="/admin/dashboard-news"
                    className={({ isActive }) =>
                      'flex items-center gap-2 rounded-lg pl-11 pr-4 py-2 text-sm font-medium transition-colors ' +
                      (isActive
                        ? 'text-blue-500 bg-blue-600/10'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50')
                    }
                  >
                    News List
                  </NavLink>
                  <NavLink
                    to="/admin/create-news"
                    className={({ isActive }) =>
                      'flex items-center gap-2 rounded-lg pl-11 pr-4 py-2 text-sm font-medium transition-colors ' +
                      (isActive
                        ? 'text-blue-500 bg-blue-600/10'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50')
                    }
                  >
                    Create News
                  </NavLink>
                </div>
              </React.Fragment>
            )}
          </SidebarLinkGroup>

          <SidebarLinkGroup activeCondition={pathname.includes('/applications')}>
            {(handleClick, open) => (
              <React.Fragment>
                <NavLink
                  to="#"
                  className={`group relative flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-300 transition-all duration-200 ease-in-out hover:bg-gray-700/50 ${
                    pathname.includes('/applications') && 'bg-blue-600/10 text-blue-500'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                  }}
                >
                  <FaUserGraduate className={`text-lg ${pathname.includes('/applications') ? 'text-blue-500' : 'text-gray-400 group-hover:text-white'}`} />
                  <span className="flex-1">Applications</span>
                  <FaChevronRight className={`text-sm transition-transform duration-200 ${open ? 'rotate-90' : ''} ${pathname.includes('/applications') ? 'text-blue-500' : 'text-gray-400'}`} />
                </NavLink>
                <div className={`mt-2 transition-all duration-200 ease-in-out space-y-1 ${!open && 'hidden'}`}>
                  <NavLink
                    to="/admin/dashboard-applications"
                    className={({ isActive }) =>
                      'flex items-center gap-2 rounded-lg pl-11 pr-4 py-2 text-sm font-medium transition-colors ' +
                      (isActive
                        ? 'text-blue-500 bg-blue-600/10'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50')
                    }
                  >
                    Application List
                  </NavLink>
                  <NavLink
                    to="/admin/create-application"
                    className={({ isActive }) =>
                      'flex items-center gap-2 rounded-lg pl-11 pr-4 py-2 text-sm font-medium transition-colors ' +
                      (isActive
                        ? 'text-blue-500 bg-blue-600/10'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50')
                    }
                  >
                    Create Application
                  </NavLink>
                </div>
              </React.Fragment>
            )}
          </SidebarLinkGroup>

          <SidebarLinkGroup activeCondition={pathname.includes('/jobs')}>
            {(handleClick, open) => (
              <React.Fragment>
                <NavLink
                  to="#"
                  className={`group relative flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-300 transition-all duration-200 ease-in-out hover:bg-gray-700/50 ${
                    pathname.includes('/jobs') && 'bg-blue-600/10 text-blue-500'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                  }}
                >
                  <FiBriefcase className={`text-lg ${pathname.includes('/jobs') ? 'text-blue-500' : 'text-gray-400 group-hover:text-white'}`} />
                  <span className="flex-1">Job Listings</span>
                  <FaChevronRight className={`text-sm transition-transform duration-200 ${open ? 'rotate-90' : ''} ${pathname.includes('/jobs') ? 'text-blue-500' : 'text-gray-400'}`} />
                </NavLink>
                <div className={`mt-2 transition-all duration-200 ease-in-out space-y-1 ${!open && 'hidden'}`}>
                  <NavLink
                    to="/admin/dashboard-job-listings"
                    className={({ isActive }) =>
                      'flex items-center gap-2 rounded-lg pl-11 pr-4 py-2 text-sm font-medium transition-colors ' +
                      (isActive
                        ? 'text-blue-500 bg-blue-600/10'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50')
                    }
                  >
                    Job Listings
                  </NavLink>
                  <NavLink
                    to="/admin/create-job-listing"
                    className={({ isActive }) =>
                      'flex items-center gap-2 rounded-lg pl-11 pr-4 py-2 text-sm font-medium transition-colors ' +
                      (isActive
                        ? 'text-blue-500 bg-blue-600/10'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50')
                    }
                  >
                    Create Job Listing
                  </NavLink>
                </div>
              </React.Fragment>
            )}
          </SidebarLinkGroup>

          <SidebarLinkGroup>
            {(handleClick, open) => (
              <React.Fragment>
                <NavLink
                  to="#"
                  className={`block truncate transition duration-150 ${
                    pathname.includes('jobs') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick();
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FiBriefcase className="shrink-0 h-6 w-6" />
                      <span className="text-sm font-medium ml-3">Job Listings</span>
                    </div>
                    <div className="flex shrink-0 ml-2">
                      <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${open && 'rotate-180'}`} viewBox="0 0 12 12">
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </NavLink>
                <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                    <li className="mb-1 last:mb-0">
                      <NavLink end to="/admin/jobs" className={({ isActive }) => 
                        'block transition duration-150 truncate ' + (isActive ? 'text-blue-500' : 'text-slate-400 hover:text-slate-200')
                      }>
                        <span className="text-sm font-medium">View Jobs</span>
                      </NavLink>
                    </li>
                    <li className="mb-1 last:mb-0">
                      <NavLink end to="/admin/create-job" className={({ isActive }) =>
                        'block transition duration-150 truncate ' + (isActive ? 'text-blue-500' : 'text-slate-400 hover:text-slate-200')
                      }>
                        <span className="text-sm font-medium">Create Job</span>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </React.Fragment>
            )}
          </SidebarLinkGroup>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

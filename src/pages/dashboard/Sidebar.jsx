import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
// import Logo from '../../images/logo/logo.svg';


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
        !sidebarOpen || // If sidebarOpen is false, do nothing
        sidebar.current.contains(target) || // If clicking inside the sidebar, do nothing
        trigger.current.contains(target) // If clicking the trigger button, do nothing
      ) 
        return; 
      setSidebarOpen(false); // Close the sidebar if none of the above conditions are met
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [sidebarOpen]); // Add sidebarOpen to the dependency array
  
  useEffect(() => {
    console.log('sidebarOpen:', sidebarOpen); // Log sidebarOpen prop
    console.log('sidebarExpanded:', sidebarExpanded); // Log sidebarExpanded state
  }, [sidebarOpen, sidebarExpanded]);

  // close if the esc key is pressed
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
  className={`fixed inset-y-0 left-0 z-50 w-72 bg-black transform transition-transform duration-300 ease-in-out ${
    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
  } lg:static lg:translate-x-0 shadow-lg`}
>


  {/* SIDEBAR HEADER */}
  <div className="flex items-center justify-between gap-2 px-6 py-6 bg-gray-900">
    <NavLink to="/" className="text-white text-lg font-bold">
      {/* <img src={Logo} alt="Logo" /> */}
      IAP-M
    </NavLink>
  </div>

  {/* SIDEBAR MENU */}
  <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
    <div>
      <NavLink to="/admin" className="group relative flex items-center gap-3 rounded-md px-4 py-3 font-medium text-gray-300 duration-300 ease-in-out hover:bg-gray-700 dark:hover:bg-gray-600">
        MENU
      </NavLink>

  
      <ul className="mb-6 flex flex-col gap-2.5">


      <SidebarLinkGroup activeCondition={pathname.includes('/users')}>
              {(handleClick, open) => (
                <React.Fragment>
                  <NavLink
                    to="#"
                    className={`group relative flex items-center gap-3 rounded-md px-4 py-3 font-medium text-gray-300 duration-300 ease-in-out hover:bg-gray-700 dark:hover:bg-gray-600 ${
                      pathname.includes('/users') && 'bg-gray-700 text-white'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      sidebarExpanded
                        ? handleClick()
                        : setSidebarExpanded(true);
                    }}
                  >
                    <span className="material-icons text-gray-400 group-hover:text-white">
                      group
                    </span>
                    Users
                  </NavLink>
                  <div className={`mt-2 transition-all duration-300 ease-in-out ${!open && 'hidden'}`}>
                    <ul className="ml-6 flex flex-col gap-2">
                      <li>
                        <NavLink
                          to="/admin/dashboard-users"
                          className={({ isActive }) =>
                            'flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white ' +
                            (isActive && '!text-white bg-gray-700')
                          }
                        >
                          User List
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/admin/create-user"
                          className={({ isActive }) =>
                            'flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white ' +
                            (isActive && '!text-white bg-gray-700')
                          }
                        >
                          Create User
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </React.Fragment>
              )}
            </SidebarLinkGroup>
            
        <SidebarLinkGroup activeCondition={pathname.includes('/bord')}>
          {(handleClick, open) => (
            <React.Fragment>
              <NavLink
                to="#"
                className={`group relative flex items-center gap-3 rounded-md px-4 py-3 font-medium text-gray-300 duration-300 ease-in-out hover:bg-gray-700 dark:hover:bg-gray-600 ${
                  pathname.includes('/bord') && 'bg-gray-700 text-white'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  sidebarExpanded
                    ? handleClick()
                    : setSidebarExpanded(true);
                }}
              >
                <span className="material-icons text-gray-400 group-hover:text-white">
                  dashboard
                </span>
                Bord
              </NavLink>

              <div className={`mt-2 transition-all duration-300 ease-in-out ${!open && 'hidden'}`}>
                <ul className="ml-6 flex flex-col gap-2">
                  <li>
                    <NavLink
                      to="/admin/dashboard-team-members"
                      className={({ isActive }) =>
                        'flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white ' +
                        (isActive && '!text-white bg-gray-700')
                      }
                    >
                      Bord Member List
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/create-team-member"
                      className={({ isActive }) =>
                        'flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white ' +
                        (isActive && '!text-white bg-gray-700')
                      }
                    >
                      Create Bordr Member
                    </NavLink>
                  </li>
                </ul>
              </div>
            </React.Fragment>
          )}
        </SidebarLinkGroup>

        {/* MENU ITEM News */}
        <SidebarLinkGroup activeCondition={pathname.includes('/news')}>
          {(handleClick, open) => (
            <React.Fragment>
              <NavLink
                to="#"
                className={`group relative flex items-center gap-3 rounded-md px-4 py-3 font-medium text-gray-300 duration-300 ease-in-out hover:bg-gray-700 dark:hover:bg-gray-600 ${
                  pathname.includes('/news') && 'bg-gray-700 text-white'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  sidebarExpanded
                    ? handleClick()
                    : setSidebarExpanded(true);
                }}
              >
                <span className="material-icons text-gray-400 group-hover:text-white">
                  article
                </span>
                News
              </NavLink>
              <div className={`mt-2 transition-all duration-300 ease-in-out ${!open && 'hidden'}`}>
                <ul className="ml-6 flex flex-col gap-2">
                  <li>
                    <NavLink
                      to="/admin/dashboard-news"
                      className={({ isActive }) =>
                        'flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white ' +
                        (isActive && '!text-white bg-gray-700')
                      }
                    >
                      News List
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/create-news"
                      className={({ isActive }) =>
                        'flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white ' +
                        (isActive && '!text-white bg-gray-700')
                      }
                    >
                      Create News
                    </NavLink>
                  </li>
                </ul>
              </div>
            </React.Fragment>
          )}
        </SidebarLinkGroup>

        {/* Add more menu items similarly */}


        <SidebarLinkGroup activeCondition={pathname.includes('/applications')}>
          {(handleClick, open) => (
            <React.Fragment>
              <NavLink
                to="#"
                className={`group relative flex items-center gap-3 rounded-md px-4 py-3 font-medium text-gray-300 duration-300 ease-in-out hover:bg-gray-700 dark:hover:bg-gray-600 ${
                  pathname.includes('/applications') && 'bg-gray-700 text-white'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  sidebarExpanded
                    ? handleClick()
                    : setSidebarExpanded(true);
                }}
              >
                <span className="material-icons text-gray-400 group-hover:text-white">
                  Student
                </span>
                Applications
              </NavLink>
              <div className={`mt-2 transition-all duration-300 ease-in-out ${!open && 'hidden'}`}>
                <ul className="ml-6 flex flex-col gap-2">
                  <li>
                    <NavLink
                      to="/admin/dashboard-applications"
                      className={({ isActive }) =>
                        'flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white ' +
                        (isActive && '!text-white bg-gray-700')
                      }
                    >
                      Applications List
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/create-application"
                      className={({ isActive }) =>
                        'flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white ' +
                        (isActive && '!text-white bg-gray-700')
                      }
                    >
                      Create Application
                    </NavLink>
                  </li>
                </ul>
              </div>
            </React.Fragment>
          )}
        </SidebarLinkGroup>
      </ul>
    </div>
  </nav>
</aside>

  );
  
};

export default Sidebar;

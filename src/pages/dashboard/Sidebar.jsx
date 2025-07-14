import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Users, Newspaper, GraduationCap, 
  Briefcase, LayoutDashboard, ChevronRight,
  UserCircle2, Menu
} from 'lucide-react';

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "../../components/ui/sidebar";

import { cn } from "../../lib/utils";

const SidebarWrapper = () => {
  const { toggleSidebar, state } = useSidebar();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const isCollapsed = state === 'collapsed';

  const toggleMenu = (index) => {
    setOpenMenus(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const isPathActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
      exact: true
    },
    {
      title: "Users",
      icon: Users,
      path: "/users",
      submenu: [
        { title: "User List", path: "/admin/dashboard-users" },
        { title: "Create User", path: "/admin/create-user" }
      ]
    },
    {
      title: "Board Members",
      icon: UserCircle2,
      path: "/bord",
      submenu: [
        { title: "Board Member List", path: "/admin/dashboard-team-members" },
        { title: "Create Board Member", path: "/admin/create-team-member" }
      ]
    },
    {
      title: "News",
      icon: Newspaper,
      path: "/news",
      submenu: [
        { title: "News List", path: "/admin/dashboard-news" },
        { title: "Create News", path: "/admin/create-news" }
      ]
    },
    {
      title: "Applications",
      icon: GraduationCap,
      path: "/applications",
      submenu: [
        { title: "Application List", path: "/admin/dashboard-applications" },
        { title: "Create Application", path: "/admin/create-application" }
      ]
    },
    {
      title: "Job Listings",
      icon: Briefcase,
      path: "/jobs",
      submenu: [
        { title: "Job Listings", path: "/admin/dashboard-job-listings" },
        { title: "Create Job Listing", path: "/admin/create-job-listing" }
      ]
    }
  ];

  return (
    <>
      <SidebarHeader className={cn(
        "border-b border-gray-200/50 transition-all duration-300",
        isCollapsed ? "px-2" : "px-4"
      )}>
        <div className={cn(
          "flex h-16 items-center transition-all duration-300",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          <div className={cn(
            "flex items-center",
            isCollapsed ? "gap-0" : "gap-3"
          )}>
            <div className={cn(
              "relative flex overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300",
              isCollapsed ? "h-11 w-11" : "h-10 w-10"
            )}>
              <img 
                src="/iap-m-logo.jpg" 
                alt="IAP-M Logo"
                className={cn(
                  "h-full w-full object-cover transition-all duration-300",
                  isCollapsed && "scale-110"
                )}
              />
              {isCollapsed && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              )}
            </div>
            <div className={cn(
              "flex flex-col overflow-hidden transition-all duration-300",
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}>
              <span className="text-base font-semibold text-gray-900">IAP-M</span>
              <span className="text-xs text-gray-500">Admin Dashboard</span>
            </div>
          </div>
          {!isCollapsed && (
            <button
              onClick={toggleSidebar}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
                "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary/20"
              )}
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className={cn(
        "flex-1 transition-all duration-300",
        isCollapsed ? "px-2 py-3" : "px-3 py-4"
      )}>
        <SidebarMenu>
          {menuItems.map((item, index) => {
            const isItemActive = isPathActive(item.path);
            const hasActiveChild = item.submenu?.some(sub => isPathActive(sub.path));

            return (
              <SidebarMenuItem 
                key={index} 
                className={cn(
                  "relative my-1 overflow-hidden transition-all duration-200",
                  isCollapsed ? "mx-auto w-12" : "w-full",
                  (isItemActive || hasActiveChild) && 
                    isCollapsed ? "bg-gray-50/80 rounded-xl" : "bg-gray-50/50 rounded-xl"
                )}
              >
                <SidebarMenuButton
                  asChild
                  tooltip={isCollapsed ? item.title : undefined}
                  className={cn(
                    "group relative flex items-center rounded-xl transition-all duration-200 ease-in-out",
                    "hover:bg-gray-50 active:bg-gray-100",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30",
                    isCollapsed 
                      ? "h-12 w-12 p-0 justify-center" 
                      : "px-3 py-2.5 w-full",
                    openMenus[index] && item.submenu && !isCollapsed && "bg-gray-50/80"
                  )}
                  onClick={item.submenu && !isCollapsed ? (e) => {
                    e.preventDefault();
                    toggleMenu(index);
                  } : undefined}
                >
                  <NavLink 
                    to={item.submenu && !isCollapsed ? "#" : item.path}
                    className={({ isActive }) => cn(
                      "flex items-center",
                      isCollapsed 
                        ? "justify-center p-0" 
                        : "w-full gap-3"
                    )}
                  >
                    <div className={cn(
                      "relative flex items-center justify-center transition-all duration-200",
                      isCollapsed ? "h-12 w-12" : "h-5 w-5"
                    )}>
                      <item.icon className={cn(
                        "transition-all duration-200 z-10",
                        isCollapsed ? "h-[22px] w-[22px]" : "h-5 w-5",
                        "group-hover:text-secondary/80",
                        isItemActive && "text-secondary"
                      )} />
                      {(isItemActive || hasActiveChild) && (
                        <span className={cn(
                          "absolute inset-0 rounded-lg bg-secondary/10",
                          isCollapsed ? "scale-90" : "scale-100",
                          "transition-transform duration-200"
                        )} />
                      )}
                    </div>
                    {!isCollapsed && (
                      <>
                        <span className={cn(
                          "flex-1 truncate font-medium text-sm",
                          isItemActive ? "text-secondary" : "text-gray-700"
                        )}>
                          {item.title}
                        </span>
                        {item.submenu && (
                          <ChevronRight 
                            className={cn(
                              "ml-auto h-4 w-4 shrink-0 transition-all duration-200",
                              openMenus[index] ? "rotate-90 text-secondary" : "text-gray-400"
                            )}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </SidebarMenuButton>

                {!isCollapsed && item.submenu && (
                  <SidebarMenuSub
                    className={cn(
                      "overflow-hidden pl-4 transition-all duration-200 ease-in-out",
                      openMenus[index] 
                        ? "mt-1 max-h-[1000px] opacity-100" 
                        : "max-h-0 opacity-0"
                    )}
                  >
                    {item.submenu.map((subItem, subIndex) => (
                      <SidebarMenuSubItem 
                        key={subIndex} 
                        className="relative my-1 first:mt-0 last:mb-0"
                      >
                        <SidebarMenuSubButton
                          asChild
                          className={cn(
                            "group relative flex w-full items-center rounded-lg px-3 py-2 text-sm transition-all duration-200",
                            "hover:bg-gray-50 active:bg-gray-100",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/20"
                          )}
                        >
                          <NavLink 
                            to={subItem.path}
                            className={({ isActive }) => cn(
                              "flex w-full items-center gap-2.5",
                              isActive 
                                ? "font-medium text-secondary" 
                                : "text-gray-500",
                              "transition-colors duration-200"
                            )}
                          >
                            <span className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              "bg-current opacity-40"
                            )} />
                            <span className="truncate">{subItem.title}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
};

export default SidebarWrapper;

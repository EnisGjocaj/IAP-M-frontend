"use client"

import type * as React from "react"
import {
  BookOpen,
  Briefcase,
  FileText,
  GraduationCap,
  Home,
  Settings,
  Star,
  Users,
  UserCheck,
  ChevronRight,
  Brain,
} from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "../../components/ui/sidebar"

import { Link, useLocation } from "react-router-dom";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: false,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Users Management",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Users List",
          url: "/dashboard/users",
        },
        {
          title: "Add New User",
          url: "/dashboard/users/new",
        },
      ],
    },
    {
      title: "Board Members",
      url: "#",
      icon: UserCheck,
      items: [
        {
          title: "Members List",
          url: "/dashboard/board-members",
        },
        {
          title: "Add New Member",
          url: "/dashboard/board-members/new",
        },
      ],
    },
    {
      title: "News & Articles",
      url: "#",
      icon: FileText,
      items: [
        {
          title: "News List",
          url: "/dashboard/news",
        },
        {
          title: "Create Article",
          url: "/dashboard/news/new",
        },
      ],
    },
    {
      title: "Applications",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Applications List",
          url: "/dashboard/applications",
        },
        {
          title: "New Application",
          url: "/dashboard/applications/new",
        },
      ],
    },
    {
      title: "Job Listings",
      url: "#",
      icon: Briefcase,
      items: [
        {
          title: "Jobs List",
          url: "/dashboard/jobs",
        },
        {
          title: "Post New Job",
          url: "/dashboard/jobs/new",
        },
      ],
    },
    {
      title: "Featured Students",
      url: "#",
      icon: Star,
      items: [
        {
          title: "Students List",
          url: "/dashboard/featured-students",
        },
        {
          title: "Add Featured Student",
          url: "/dashboard/featured-students/new",
        },
      ],
    },
    {
      title: "Students",
      url: "#",
      icon: GraduationCap,
      items: [
        {
          title: "Students List",
          url: "/dashboard/students",
        },
        {
          title: "Student Profiles",
          url: "/dashboard/students/profiles",
        },
      ],
    },
    {
      title: "Training Programs",
      url: "#",
      icon: BookOpen, 
      items: [
        {
          title: "All Trainings",
          url: "/dashboard/trainings",
        },
        {
          title: "Add New Training",
          url: "/dashboard/trainings/new",
        },
      ],
    },
    {
      title: "AI Management",
      url: "#",
      icon: Brain,
      items: [
        {
          title: "Materials Management",
          url: "/dashboard/ai/materials",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const pathname = location.pathname;

  const isDirectActive = (url: string) => {
    if (url === "/") return pathname === "/";
    if (url === "/dashboard") return pathname === "/dashboard";
    return pathname === url;
  };

  const isSubActive = (url: string) => {
    return pathname === url;
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="border-b border-border/50 px-4 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard" className="flex items-center gap-3">
                <div className="relative flex overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                  <img 
                    src="/iap-m-logo.jpg" 
                    alt="IAP-M" 
                    className="h-10 w-10 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>
                <div className="grid flex-1 text-left">
                  <span className="text-base font-semibold text-gray-900">IAP-M</span>
                  <span className="text-xs text-gray-500">Admin Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={Boolean(item.items?.some((sub) => isSubActive(sub.url)))}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    {item.items ? (
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={Boolean(item.items?.some((sub) => isSubActive(sub.url)))}
                        >
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                    ) : (
                      <SidebarMenuButton asChild tooltip={item.title} isActive={isDirectActive(item.url)}>
                        <Link to={item.url}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                    {item.items && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={isSubActive(subItem.url)}>
                                <Link to={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

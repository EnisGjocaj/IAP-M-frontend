import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "../../components/ui/sidebar";
import {
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  FileText,
  GraduationCap,
  Brain,
  Sparkles,
  Settings,
  HelpCircle,
  ChevronLeft,
  BookOpen,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/ai",
    icon: LayoutDashboard,
    description: "Overview & quick actions",
  },
  {
    title: "Materials",
    url: "/ai/materials",
    icon: FolderOpen,
    description: "Upload & manage content",
  },
  {
    title: "Ask AI",
    url: "/ai/ask",
    icon: MessageSquare,
    description: "Query your materials",
  },
  {
    title: "Summarize",
    url: "/ai/summarize",
    icon: FileText,
    description: "Generate summaries",
  },
  {
    title: "Exam Engine",
    url: "/ai/exam",
    icon: GraduationCap,
    description: "Practice & prepare",
  },
  {
    title: "Advisor",
    url: "/ai/advisor",
    icon: Brain,
    description: "Personalized guidance",
  },
];

const supportNavItems = [
  {
    title: "Help Center",
    url: "/ai/help",
    icon: HelpCircle,
  },
  {
    title: "Settings",
    url: "/ai/settings",
    icon: Settings,
  },
];

export const AISidebar: React.FC = () => {
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/ai") {
      return location.pathname === "/ai";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar"
    >
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sidebar-foreground text-lg">IAP-M AI</span>
              <span className="text-xs text-sidebar-foreground/70">Academic Assistant</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wider mb-2 px-2">
              AI Features
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={isCollapsed ? item.title : undefined}
                    className={cn(
                      "group relative transition-all duration-200",
                      isActive(item.url)
                        ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
                      <item.icon className={cn(
                        "w-5 h-5 shrink-0",
                        isActive(item.url) && "text-sidebar-primary-foreground"
                      )} />
                      {!isCollapsed && (
                        <div className="flex flex-col">
                          <span className="font-medium">{item.title}</span>
                          <span className={cn(
                            "text-xs",
                            isActive(item.url) 
                              ? "text-sidebar-primary-foreground/80" 
                              : "text-sidebar-foreground/60"
                          )}>
                            {item.description}
                          </span>
                        </div>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          {!isCollapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wider mb-2 px-2">
              Support
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {supportNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={isCollapsed ? item.title : undefined}
                    className={cn(
                      "transition-all duration-200",
                      isActive(item.url)
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!isCollapsed && <span className="font-medium">{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-sidebar-accent flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-sidebar-accent-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium text-sidebar-foreground truncate">
                Faculty of Business
              </span>
              <span className="text-xs text-sidebar-foreground/60">
                Academic Year 2024-25
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent shrink-0"
          >
            <ChevronLeft className={cn(
              "w-4 h-4 transition-transform duration-200",
              isCollapsed && "rotate-180"
            )} />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AISidebar;

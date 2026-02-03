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
  Settings,
  HelpCircle,
  ChevronLeft,
  BookOpen,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";

const mainNavItems = [
  { title: "Dashboard", url: "/ai", icon: LayoutDashboard },
  { title: "Materials", url: "/ai/materials", icon: FolderOpen },
  { title: "Ask AI", url: "/ai/ask", icon: MessageSquare },
  { title: "Summarize", url: "/ai/summarize", icon: FileText },
  { title: "Exam Engine", url: "/ai/exam", icon: GraduationCap },
  { title: "Advisor", url: "/ai/advisor", icon: Brain },
];

const supportNavItems = [
  { title: "Help", url: "/ai/help", icon: HelpCircle },
  { title: "Settings", url: "/ai/settings", icon: Settings },
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
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sidebar-foreground">IAP-M AI</span>
              <span className="text-xs text-sidebar-foreground/70">Academic Tools</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wider mb-2 px-2">
              Features
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
                      "transition-colors",
                      isActive(item.url)
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
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
                      "transition-colors",
                      isActive(item.url)
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <span className="text-xs text-sidebar-foreground/60">
              Faculty of Business
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8"
          >
            <ChevronLeft className={cn(
              "w-4 h-4 transition-transform",
              isCollapsed && "rotate-180"
            )} />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AISidebar;

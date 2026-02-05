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
  { title: "Paneli", url: "/ai", icon: LayoutDashboard },
  { title: "Materialet", url: "/ai/materials", icon: FolderOpen },
  { title: "Pyet AI", url: "/ai/ask", icon: MessageSquare },
  { title: "Përmbledhje", url: "/ai/summarize", icon: FileText },
  { title: "Motori i Provimeve", url: "/ai/exam", icon: GraduationCap },
  { title: "Këshilltari", url: "/ai/advisor", icon: Brain },
];

const supportNavItems = [
  { title: "Ndihmë", url: "/ai/help", icon: HelpCircle },
  { title: "Cilësimet", url: "/ai/settings", icon: Settings },
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
           <div className="relative flex h-10 w-10 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
            <img
              src="/iap-m-logo.jpg"
              alt="IAP-M"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sidebar-foreground">IAP-M AI</span>
              <span className="text-xs text-sidebar-foreground/70">Mjete Akademike</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4  overflow-x-hidden">
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wider mb-2 px-2">
              Veçoritë
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
              Mbështetje
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

      <SidebarFooter className="border-t border-sidebar-border p-3 overflow-x-hidden">
        <div className="flex items-center justify-between  overflow-x-hidden">
          {!isCollapsed && (
            <span className="text-xs text-sidebar-foreground/60  overflow-x-hidden whitespace-nowrap">
              Fakulteti i Biznesit
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8  overflow-x-hidden"
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

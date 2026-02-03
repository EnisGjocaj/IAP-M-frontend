import React from "react";
import { useLocation, Link } from "react-router-dom";
import { SidebarTrigger } from "../../components/ui/sidebar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { 
  Search, 
  Bell, 
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Badge } from "../../components/ui/badge";

const pageConfig: Record<string, { title: string; description: string }> = {
  "/ai": { title: "Dashboard", description: "Overview of your academic activity" },
  "/ai/materials": { title: "Materials", description: "Upload and manage study materials" },
  "/ai/ask": { title: "Ask AI", description: "Query your academic materials" },
  "/ai/summarize": { title: "Summarize", description: "Generate concise summaries" },
  "/ai/exam": { title: "Exam Engine", description: "Practice and prepare for exams" },
  "/ai/advisor": { title: "Advisor", description: "Personalized study recommendations" },
  "/ai/help": { title: "Help", description: "Support and guidance" },
  "/ai/settings": { title: "Settings", description: "Configure your preferences" },
};

export const AIHeader: React.FC = () => {
  const location = useLocation();
  const currentPage = pageConfig[location.pathname] || pageConfig["/ai"];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="flex h-14 items-center gap-4 px-4">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        
        <div className="flex-1">
          <h1 className="text-sm font-medium text-foreground">
            {currentPage.title}
          </h1>
          <p className="text-xs text-muted-foreground hidden sm:block">
            {currentPage.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-48 pl-8 h-8 text-sm bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-8 w-8">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-secondary text-[10px] text-secondary-foreground flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel className="text-xs">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-0.5 py-2">
                <span className="text-sm">New material uploaded</span>
                <span className="text-xs text-muted-foreground">Finance Module 5 is now available</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-0.5 py-2">
                <span className="text-sm">Exam reminder</span>
                <span className="text-xs text-muted-foreground">Marketing exam in 3 days</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-0.5 py-2">
                <span className="text-sm">Study recommendation</span>
                <span className="text-xs text-muted-foreground">Review Statistics Chapter 4</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs">
                <div className="flex flex-col">
                  <span>Student Profile</span>
                  <span className="font-normal text-muted-foreground">student@iapm.edu</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm">My Profile</DropdownMenuItem>
              <DropdownMenuItem className="text-sm">Study History</DropdownMenuItem>
              <DropdownMenuItem className="text-sm">Progress Report</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm" asChild>
                <Link to="/">Back to Main Site</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm text-destructive">Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AIHeader;

import React from "react";
import { useLocation } from "react-router-dom";
import { SidebarTrigger } from "../../components/ui/sidebar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { 
  Search, 
  Bell, 
  User,
  Sparkles,
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
  "/ai": { title: "AI Dashboard", description: "Your academic command center" },
  "/ai/materials": { title: "Materials", description: "Upload and manage your study materials" },
  "/ai/ask": { title: "Ask AI", description: "Query your academic materials" },
  "/ai/summarize": { title: "Summarize", description: "Generate concise summaries" },
  "/ai/exam": { title: "Exam Engine", description: "Practice and prepare for exams" },
  "/ai/advisor": { title: "Academic Advisor", description: "Personalized study recommendations" },
  "/ai/help": { title: "Help Center", description: "Get support and guidance" },
  "/ai/settings": { title: "Settings", description: "Configure your preferences" },
};

export const AIHeader: React.FC = () => {
  const location = useLocation();
  const currentPage = pageConfig[location.pathname] || pageConfig["/ai"];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        
        <div className="flex-1 flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
              {currentPage.title}
              <Sparkles className="w-4 h-4 text-primary" />
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {currentPage.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search materials..."
              className="w-64 pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="font-medium text-sm">New material uploaded</span>
                <span className="text-xs text-muted-foreground">Finance Module 5 is now available</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="font-medium text-sm">Exam reminder</span>
                <span className="text-xs text-muted-foreground">Marketing exam in 3 days</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="font-medium text-sm">Study recommendation</span>
                <span className="text-xs text-muted-foreground">Review Statistics Chapter 4</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <User className="w-4 h-4 text-secondary-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>Student Profile</span>
                  <span className="text-xs font-normal text-muted-foreground">student@iapm.edu</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>My Profile</DropdownMenuItem>
              <DropdownMenuItem>Study History</DropdownMenuItem>
              <DropdownMenuItem>Progress Report</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Back to Main Site</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AIHeader;

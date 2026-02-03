import React from "react";
import { Outlet } from "react-router-dom";
import { AISidebar } from "./AISidebar";
import { AIHeader } from "./AIHeader";
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar";

export const AILayout: React.FC = () => {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "16rem",       
        "--sidebar-width-icon": "4rem", 
      } as React.CSSProperties}
    >
      <div className="min-h-screen flex w-full bg-background">
        <AISidebar />
        <SidebarInset className="flex-1 flex flex-col">
          <AIHeader />
          <main className="flex-1 p-6 overflow-auto scrollbar-thin">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};


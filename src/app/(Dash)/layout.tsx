import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {  SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "280px", // use fixed px instead of calc/spaces
          "--header-height": "64px",
        } as React.CSSProperties
      }
    >
      <div className="flex h-screen w-full overflow-hidden">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content wrapper */}
        <div className="flex flex-col flex-1">
          {/* Header */}
          <SiteHeader />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

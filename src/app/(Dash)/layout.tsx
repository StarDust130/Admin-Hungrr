// src/app/(dashboard)/layout.tsx (or your layout file)

import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "280px",
          "--header-height": "64px",
        } as React.CSSProperties
      }
    >
      <div
        className="flex h-screen w-full overflow-hidden"
        suppressHydrationWarning
      >
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <SiteHeader />
          {/* 1. This main container ONLY handles scrolling */}
          <main className="flex-1 overflow-y-auto">
            {/* 2. This INNER div handles all the padding */}
            <div className="p-6 lg:p-8">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

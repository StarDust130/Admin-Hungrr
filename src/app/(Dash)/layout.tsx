// src/app/(dashboard)/layout.tsx (or your layout file)

import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CafeProvider } from "@/context/CafeContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CafeProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "280px",
            "--header-height": "64px",
          } as React.CSSProperties
        }
      >
        {" "}
        <div className="flex h-screen w-full overflow-hidden">
          <AppSidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <SiteHeader />
            <main className="flex-1 overflow-y-auto">
              <div className="p-6 lg:p-8">{children} </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </CafeProvider>
  );
}

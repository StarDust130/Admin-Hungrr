/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  IconLayoutDashboard,
  IconListDetails,
  IconChartBar,
  IconSettings,
  IconHelp,
  IconChartPie,
  IconCoffee,
} from "@tabler/icons-react";

// import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Sticker, Utensils } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCafe } from "@/context/CafeContext";

const data = {
  user: {
    name: "Chai Cafe",
    email: "chai@example.com",
    avatar: "/avatars/cafe-avatar.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconLayoutDashboard,
    },
    {
      title: "Orders",
      url: "/orders",
      icon: IconListDetails,
    },
    {
      title: "Menu Items",
      url: "/menu",
      icon: Utensils,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: IconChartBar,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Sticker,
    },
    {
      title: "Cafe",
      url: "/cafe",
      icon: IconCoffee,
    },
  ],
  navSecondary: [
    {
      title: "Get Help",
      url: "/help",
      icon: IconHelp,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
  ],
  documents: [
    {
      name: "Daily Summary",
      url: "/reports/daily",
      icon: IconChartPie,
    },
    {
      name: "Monthly Summary",
      url: "/reports/monthly",
      icon: IconChartBar,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { cafe } = useCafe();


  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard" className="flex items-center gap-2 hover:bg-transparent">
                {cafe?.logoUrl ? (
                  <Image
                    src={cafe.logoUrl}
                    alt="Cafe Logo"
                    className="size-6 rounded-full "
                    width={40}
                    height={40}
                  />
                ) : (
                  <IconCoffee className="!size-5" />
                )}
                <span className="text-xl font-semibold tracking-tight capitalize">
                  {cafe?.name}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain as any} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

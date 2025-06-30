"use client";

import { useState } from "react";
import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SignOutButton, UserProfile, useUser } from "@clerk/nextjs";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user  } = useUser();
  const [showUserProfile, setShowUserProfile] = useState(false);

  if (!user) return null;

  const userInitials = (user.firstName?.[0] || "") + (user.lastName?.[0] || "");

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage
                    src={user.imageUrl}
                    alt={user.fullName || "User"}
                  />
                  <AvatarFallback className="rounded-lg">
                    {userInitials || "👤"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.fullName}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.primaryEmailAddress?.emailAddress}
                  </span>
                </div>
                <IconDotsVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user.imageUrl}
                      alt={user.fullName || "User"}
                    />
                    <AvatarFallback className="rounded-lg">
                      {userInitials || "👤"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user.fullName}
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user.primaryEmailAddress?.emailAddress}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setShowUserProfile(true)}>
                  <IconUserCircle className="mr-2 h-4 w-4" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconCreditCard className="mr-2 h-4 w-4" />
                  Billing
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <SignOutButton>
                  <IconLogout className="mr-2 h-4 w-4" />
                  Log out
                </SignOutButton>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Clerk User Profile Modal */}
      <Dialog open={showUserProfile} onOpenChange={setShowUserProfile}>
        <DialogContent className="flex h-screen w-full flex-col items-center justify-center p-0 sm:max-w-lg sm:rounded-lg">
          <UserProfile />
        </DialogContent>
      </Dialog>
    </>
  );
}

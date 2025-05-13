"use client";

import * as React from "react";
import {
  Box,
  NotepadText,
  UsersRound,
  CalendarDays,
  LayoutDashboard,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";

export function AppSidebar() {
  const [user, setUser] = React.useState<null | {
    name: string;
    email: string;
    role: string;
  }>(null);

  // React.useEffect(() => {
  //   const stored = sessionStorage.getItem("user");

  //   if (stored) {
  //     try {
  //       const parsed = JSON.parse(stored);
  //       setUser(parsed);
  //     } catch (err) {
  //       console.error(err);
  //       sessionStorage.removeItem("user");
  //       setUser(null);
  //     }
  //   }
  // }, []);

  // if (!user) return null;

  const navMain = [
    {
      title: "Dashboards",
      url: "/dashboard",
      icon: LayoutDashboard,
      visible: true,
      // visible: true,
    },
    {
      title: "Members",
      url: "/dashboard/member",
      icon: UsersRound,
      visible: true,
      // visible: user.role === "admin",
    },
    {
      title: "Event",
      url: "/dashboard/event",
      icon: CalendarDays,
      visible: true,
      // visible: user.role === "admin" || user.role === "MANAGER",
    },
    //  {
    //    title: "Assets",
    //    url: "/dashboard/asset",
    //    icon: Box,
    // visible: user.role === "ADMIN",
    //  },
    //  {
    //    title: "Records",
    //    url: "/dashboard/record",
    //    icon: NotepadText,
    // visible: user.role === "ADMIN" || user.role === "MEMBER",
    //  },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <Image src={"/logo.png"} alt="test" width={50} height={50} />
                {/* <ArrowUpCircleIcon className="h-5 w-5" /> */}
                <span className="text-base font-semibold">PLANS</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain.filter((item) => item.visible)} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

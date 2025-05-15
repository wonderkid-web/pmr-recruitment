"use client";

import * as React from "react";
import {

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
    name: string | null;
    email: string | null;
    role: string | null;
  }>(null);

  React.useEffect(() => {
    const role = localStorage.getItem("role") || null
    const name = localStorage.getItem("name") || null
    const email = localStorage.getItem("email") || null

    if (role) {
      try {
        setUser({
          name, email, role
        });
      } catch (err) {
        console.error(err);
        localStorage.removeItem("role")
        localStorage.removeItem("name")
        localStorage.removeItem("email")
        setUser(null);
      }
    }
  }, []);

  if (!user) return null;

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
      visible: user.role === "ADMIN",
    },
    {
      title: "Event",
      url: "/dashboard/event",
      icon: CalendarDays,
      visible: user.role === "ADMIN"
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: UsersRound,
      visible: user.role === "ANGGOTA"
    },
    {
      title: "Events Berlangsung",
      url: "/dashboard/member-events",
      icon: CalendarDays,
      visible: user.role === "ANGGOTA"
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
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

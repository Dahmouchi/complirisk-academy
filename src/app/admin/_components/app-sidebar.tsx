"use client";

import type * as React from "react";
import {
  House,
  BellElectric,
  Settings2,
  Users,
  SwatchBook,
  Tickets,
  PlaneTakeoff,
  Newspaper,
  ListStart,
  Star,
  MessagesSquare,
  Route,
  Headset,
  ListOrdered,
  StarHalf,
  Sparkle,
  Sparkles,
  Key,
  Shapes,
  LibraryBig,
  BookText,
  Box,
  Boxes,
  Heart,
  GraduationCap,
  Ticket,
} from "lucide-react";

import { NavMain } from "./nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getPendingDemandesCount } from "@/actions/demande";

// This is sample data.
const datas = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Alert Application",
      logo: BellElectric,
      plan: "Dark Mode",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPendingCount = async () => {
      const result = await getPendingDemandesCount();
      if (result.success) {
        setPendingCount(result.count);
      }
    };

    fetchPendingCount();

    // Refresh count every 30 seconds
    const interval = setInterval(fetchPendingCount, 30000);

    return () => clearInterval(interval);
  }, []);

  const navMain = [
    {
      title: "Accueil",
      url: "/admin/dashboard",
      icon: House,
    },
    {
      title: "Demandes",
      url: "/admin/dashboard/demandes",
      icon: Ticket,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },

    {
      title: "Les Normes",
      url: "/admin/dashboard/classes",
      icon: Shapes,
    },
    {
      title: "Les Chapitres",
      url: "/admin/dashboard/matieres",
      icon: LibraryBig,
    },
    {
      title: "Les Cours",
      url: "/admin/dashboard/cours",
      icon: BookText,
    },
    {
      title: "Utilisateurs",
      url: "/admin/dashboard/users",
      icon: Users,
    },
    {
      title: "Enseignants",
      url: "/admin/dashboard/teacher",
      icon: GraduationCap,
    },
    {
      title: "actualités",
      url: "/admin/dashboard/actualites",
      icon: Newspaper,
    },

    {
      title: "Settings",
      url: "/admin/dashboard/settings",
      icon: Settings2,
    },
  ];

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="bg-white dark:bg-slate-800 p-2 flex flex-col items-center justify-center bg "
    >
      <SidebarHeader className="dark:bg-slate-900 flex items-center bg-white justify-start rounded-t-xl ">
        <Image
          src={`${state === "expanded" ? "/compli/complirisk-academy.png" : "/compli/complirisk-academy.png"}`}
          alt="logo"
          width={state === "expanded" ? 200 : 200}
          height={state === "expanded" ? 200 : 200}
        />
      </SidebarHeader>
      <SidebarContent className="dark:bg-slate-900 pl-0 bg-white rounded-b-xl mt-3">
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <div className="text-center flex items-center gap-1 text-xs text-gray-500">
          Powered by <span className="font-bold">Cinq-Cinq</span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

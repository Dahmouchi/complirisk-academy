"use client";

import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation"; // Import to get current route
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import clsx from "clsx"; // Utility for conditional classNames

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    badge?: number;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname(); // Get the current route
  const { state, setOpenMobile } = useSidebar();

  // Function to remove the language prefix ("/fr" or "/en") from pathname
  const getPathWithoutLocale = (path: string) => {
    return path.replace(/^\/(fr|en)/, ""); // Removes the "/fr" or "/en" prefix
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            getPathWithoutLocale(pathname) === item.url ||
            (item.url !== "/admin/dashboard" &&
              getPathWithoutLocale(pathname).startsWith(item.url));

          return (
            <Collapsible key={item.title} asChild className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <Link href={item.url}>
                    <SidebarMenuButton
                      onClick={() => setOpenMobile(false)}
                      tooltip={item.title}
                      className={clsx(
                        "cursor-pointer transition-all rounded-[6px] duration-200 py-5",
                        isActive
                          ? "bg-blue-500 shadow-[4px_6px_7px_0px_rgba(0,_0,_0,_0.1)]  text-white hover:bg-blue-700 hover:text-white  font-semibold"
                          : "hover:bg-white dark:hover:bg-gray-800",
                      )}
                    >
                      <div
                        className={`rounded-[6px] ${
                          isActive && state === "expanded"
                            ? "bg-white rounded-md p-1.5 text-blue-500"
                            : ""
                        }`}
                      >
                        {" "}
                        {item.icon && <item.icon className="w-4 h-4" />}
                      </div>
                      <span>{item.title}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-medium text-white">
                          {item.badge}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </Link>
                </CollapsibleTrigger>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

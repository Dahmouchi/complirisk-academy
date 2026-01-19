"use client";

import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { redirect, usePathname, useRouter } from "next/navigation";
import { NavUser } from "./nav-user";
import {
  AlertCircle,
  Archive,
  Bell,
  BookMarked,
  BookOpen,
  Check,
  ChevronDown,
  FolderLock,
  House,
  KeySquare,
  LayoutDashboard,
  Settings2,
  SwatchBook,
  UserCheck,
  UserCog,
  Users,
} from "lucide-react";
import { getSession, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
const navMain = [
  {
    title: "Accueil",
    url: "overview",
    icon: House,
  },
  {
    title: "Users",
    url: "users",
    icon: Users,
  },
  {
    title: "Users Archive",
    url: "archive",
    icon: Archive,
  },
  {
    title: "Alertes",
    url: "alertes",
    icon: AlertCircle,
  },
  {
    title: "Settings",
    url: "settings",
    icon: Settings2,
  },
];

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  relatedId: string;
  read: boolean;
  createdAt: Date;
  readAt?: Date;
}
const Header = () => {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").filter(Boolean).pop() || "Home"; // Extract last segment
  const { data: session, update } = useSession();
  const page = navMain.find((cat) => cat.url === lastSegment);
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // Filter unread notifications or limit to 5

  const [unreadNewslettersCount, setUnreadNewslettersCount] = useState(0);

  function formatDate(date: Date): string {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
  return (
    <header className="flex h-16 rounded-lg border shadow-[-4px_5px_10px_0px_rgba(0,_0,_0,_0.1)]  mb-1 shrink-0 bg-white dark:bg-slate-900 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
        <Separator
          orientation="vertical"
          className="mr-2 h-4 dark:bg-slate-50"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="">
              <BreadcrumbLink href="/">Cinq-Cinq Sup</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize hidden lg:block">
                {page?.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="lg:pr-10 w-1/2 flex items-center justify-end gap-4">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNewslettersCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                >
                  {unreadNewslettersCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 p-0" align="end" forceMount>
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <h3 className="font-semibold">Newsletters</h3>
            </div>

            {loading ? (
              <div className="p-4 text-center text-muted-foreground">
                Loading newsletters...
              </div>
            ) : newsletters.length > 0 ? (
              <div className="">
                <div
                  className={`max-h-[400px] ${
                    showAll ? "overflow-y-auto" : ""
                  }`}
                >
                  {newsletters
                    .filter((newsletter: any) => newsletter.statu === false)
                    .slice(0, showAll ? undefined : 3)
                    .map((newsletter: any) => (
                      <div
                        key={newsletter.id}
                        className="flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-accent"
                        onClick={() => {
                          setIsOpen(false);
                          redirect("/admin/dashboard/news");
                        }}
                      >
                        <div className="flex justify-between w-full">
                          <h4 className="font-medium">{newsletter.nom}</h4>
                          {!newsletter.status && (
                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {newsletter.message}
                        </p>
                        <div className="flex justify-between w-full items-center mt-1">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(newsletter.createdAt)}
                          </span>
                          {!newsletter.status && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                // markNewsletterAsRead(newsletter.id);
                              }}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No unread newsletters
              </div>
            )}

            {newsletters.filter((n: any) => n.status === false).length > 3 && (
              <div className="border-t p-2 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "Show less" : "Show all newsletters"}
                </Button>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div>
          {session?.user ? (
            <NavUser />
          ) : (
            <div>
              <Button
                onClick={() => redirect("/user")}
                className="gap-2.5 px-12"
              >
                <KeySquare /> S&apos;Identifier
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

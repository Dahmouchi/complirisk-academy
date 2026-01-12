/* eslint-disable @next/next/no-img-element */
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Award, ChevronDown, LogOut, User, User2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import BadgeDropdown from "./badges";
import { motion } from "framer-motion";

const HeaderSubject = (user: any) => {
  const router = useRouter();

  return (
    <div>
      <div className="   relative">
        <div className="absolute -top-10 inset-0 z-0 overflow-hidden">
          <img
            src="/nav.png"
            className="w-full h-full object-cover"
            alt="Header background"
          />
          {/* Optional overlay if you need to darken the background */}
          <div className="absolute inset-0 bg-opacity-20"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-50 relative ">
          <div className="flex items-center justify-between py-4 pb-8">
            <img
              onClick={() => router.push("/dashboard")}
              src="/cinq/logoH.png"
              className="h-auto w-30 lg:w-40 cursor-pointer"
              alt=""
            />

            <motion.div
              className="relative group flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Glow effect */}
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></span>
              {/* Inner glow */}
              <span className="absolute inset-0 border-2 border-white/20 rounded-lg group-hover:border-white/40 transition-all duration-300"></span>
              {/* Shadow animation */}
              <motion.span
                className="absolute inset-0 rounded-lg shadow-lg pl-2"
                initial={{
                  boxShadow:
                    "0 10px 15px -3px rgba(99, 102, 241, 0.3), 0 4px 6px -2px rgba(99, 102, 241, 0.1)",
                }}
                animate={{
                  boxShadow: [
                    "0 10px 15px -3px rgba(99, 102, 241, 0.3), 0 4px 6px -2px rgba(99, 102, 241, 0.1)",
                    "0 20px 25px -5px rgba(99, 102, 241, 0.4), 0 10px 10px -5px rgba(99, 102, 241, 0.2)",
                    "0 10px 15px -3px rgba(99, 102, 241, 0.3), 0 4px 6px -2px rgba(99, 102, 241, 0.1)",
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
              />

              {/* Content */}
              <div className="relative z-10 flex items-center gap-2">
                <BadgeDropdown user={user} size={"1"} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <div className="text-sm text-left">
                        <p className="font-medium">
                          {user?.user.name} {user?.user.prenom}
                        </p>
                        <div className="flex items-center space-x-1 text-gray-200 group-hover:text-white transition-colors">
                          <p>Profil</p>
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuItem
                      onClick={() => router.push("/dashboard/profile")}
                      className="cursor-pointer"
                    >
                      <User2 />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="cursor-pointer"
                    >
                      <LogOut />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSubject;

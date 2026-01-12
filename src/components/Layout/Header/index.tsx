/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { headerData } from "../Header/Navigation/menuData";
import Logo from "./Logo";
import HeaderLink from "../Header/Navigation/HeaderLink";
import MobileHeaderLink from "../Header/Navigation/MobileHeaderLink";
import Signin from "@/components/Auth/SignIn";
import SignUp from "@/components/Auth/SignUp";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react/dist/iconify.js";
import ThemeToggler from "./ThemeToggler";
import {
  BookOpenText,
  ChevronsUpDown,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LangSwitcher";
const Header = ({ visible }: { visible: any }) => {
  const { data: session } = useSession();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const navbarRef = useRef<HTMLDivElement>(null);
  const signInRef = useRef<HTMLDivElement>(null);
  const signUpRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    setSticky(window.scrollY >= 80);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      signInRef.current &&
      !signInRef.current.contains(event.target as Node)
    ) {
      setIsSignInOpen(false);
    }
    if (
      signUpRef.current &&
      !signUpRef.current.contains(event.target as Node)
    ) {
      setIsSignUpOpen(false);
    }
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node) &&
      navbarOpen
    ) {
      setNavbarOpen(false);
    }
  };
  const router = useRouter();

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navbarOpen, isSignInOpen, isSignUpOpen]);

  useEffect(() => {
    if (isSignInOpen || isSignUpOpen || navbarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isSignInOpen, isSignUpOpen, navbarOpen]);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all bg-white duration-300 ${
        sticky ? "shadow-lg lg:py-5" : "shadow-none py-4"
      }`}
    >
      {/* Background Image */}
      <div className="absolute -top-8 inset-0 z-0 overflow-hidden">
        {/* Optional overlay if you need to darken the background */}
        <div className="absolute inset-0 bg-opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="lg:py-0 py-0">
          <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md flex items-center justify-between px-4">
            <img
              onClick={() => router.push("/")}
              src="/cinq/logoH.png"
              className="h-auto w-20 lg:w-20 cursor-pointer"
              alt=""
            />
            {visible === true && (
              <nav className="hidden lg:flex flex-grow items-center gap-8 justify-center">
                {headerData.map((item, index) => (
                  <HeaderLink key={index} item={item} />
                ))}
              </nav>
            )}

            {/* Button content */}
            <div className="flex gap-2 items-center">
              {session?.user ? (
                <div className=" flex items-center gap-2">
                  <motion.button
                    onClick={() => router.push("/dashboard")}
                    className="relative group px-6 lg:py-3 py-2 cursor-pointer rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
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
                      className="absolute inset-0 rounded-lg shadow-lg"
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
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      <User className="lg:text-lg text-sm" />
                      <span>Mon Espace</span>
                    </div>
                  </motion.button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="lg"
                        className="bg-white text-slate-800 hover:text-white cursor-pointer data-[state=open]:text-sidebar-accent-foreground dark:bg-slate-700"
                      >
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            src={"/userProfile.png"}
                            alt={"user.name"}
                          />
                        </Avatar>
                        <div className=" flex-1 text-left text-sm leading-tight hidden lg:grid">
                          <span className="truncate font-semibold">
                            {session?.user.username || "Utilisateur"}
                          </span>
                          <span className="truncate text-xs">
                            {session?.user.email || "vous êtes connecté"}
                          </span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4 lg:block hidden" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                      align="end"
                      sideOffset={4}
                    >
                      <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                          <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarFallback className="rounded-lg">
                              {" "}
                              {session?.user.username
                                ?.slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                              {session?.user.username || "Utilisateur"}
                            </span>
                            <span className="truncate text-xs">
                              {session?.user.email || "vous êtes connecté"}
                            </span>
                          </div>
                        </div>
                      </DropdownMenuLabel>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="cursor-pointer"
                      >
                        <LogOut />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <motion.button
                  onClick={() => router.push(`/login`)}
                  className="relative group px-6 lg:py-3 py-2 cursor-pointer rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
                    className="absolute inset-0 rounded-lg shadow-lg"
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
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <LogIn className="lg:text-lg text-sm" />
                    <span>Connexion</span>
                  </div>{" "}
                </motion.button>
              )}
              {/*<LanguageSelector />*/}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

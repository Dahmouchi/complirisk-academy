"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import HeaderLink from "../Header/Navigation/HeaderLink";
import MobileHeaderLink from "../Header/Navigation/MobileHeaderLink";
import Signin from "@/components/Auth/SignIn";
import SignUp from "@/components/Auth/SignUp";
import { Icon } from "@iconify/react/dist/iconify.js";
import { HeaderItem } from "@/types/menu";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  X,
  Menu,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

const Header = ({
  visible,
  isbotton = true,
}: {
  visible: boolean;
  isbotton?: boolean;
}) => {
  const [headerData, setHeaderData] = useState<HeaderItem[]>([]);
  const { data: session } = useSession();
  const user = session?.user;
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const navbarRef = useRef<HTMLDivElement>(null);
  const signInRef = useRef<HTMLDivElement>(null);
  const signUpRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/data");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setHeaderData(data.HeaderData);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchData();
  }, []);

  const handleScroll = () => {
    setSticky(window.scrollY >= 10);
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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navbarOpen, isSignInOpen, isSignUpOpen]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const initials = user
    ?.username!.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    if (isSignInOpen || isSignUpOpen || navbarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isSignInOpen, isSignUpOpen, navbarOpen]);

  return (
    <>
      {/* Sticky Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-[99] w-full transition-all duration-500 ease-in-out
          ${
            sticky
              ? "bg-white/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.08)] border-b border-gray-100/80 py-3"
              : "bg-white py-4"
          }
        `}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Logo />
          </div>

          {/* Desktop Nav Links */}
          {visible && (
            <nav className="hidden lg:flex grow items-center gap-4 justify-start ml-10">
              {headerData.map((item, index) => (
                <HeaderLink key={index} item={item} />
              ))}
            </nav>
          )}

          {/* Partner Logo - desktop only */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <img
              src="/logo.png"
              alt="CompliRisk"
              className="h-10 w-auto object-contain opacity-90"
            />
          </div>

          {/* Auth / User section */}
          <div className="flex items-center gap-3 shrink-0 ml-auto lg:ml-0">
            {user ? (
              <>
                {/* Mobile: avatar + hamburger */}
                <div className="flex items-center gap-3 lg:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 px-2 hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-2 cursor-pointer">
                          <div className="relative">
                            {!user?.image && (
                              <div className="absolute top-0 right-0 z-50 bg-red-500 rounded-full w-2 h-2" />
                            )}
                            <Avatar className="w-9 h-9 border-2 border-primary/20">
                              <AvatarImage
                                src={`${user?.image}`}
                                alt={user?.username}
                              />
                              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 rounded-xl shadow-lg"
                    >
                      <div className="flex items-center gap-2 p-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={`${user?.image}`}
                            alt={user?.username}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">
                            {user?.username}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Étudiant
                          </span>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => router.push("/dashboard")}
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer relative"
                        onClick={() => router.push("/dashboard/profile")}
                      >
                        {!user?.image && (
                          <div className="absolute top-1 right-2 bg-red-500 rounded-full w-2 h-2" />
                        )}
                        <User className="mr-2 h-4 w-4" />
                        Mon profil
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => router.push("/dashboard/profile")}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Paramètres
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-destructive focus:text-destructive"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Se déconnecter
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {isbotton && (
                    <button
                      onClick={() => setNavbarOpen(!navbarOpen)}
                      className="relative flex flex-col justify-center items-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors"
                      aria-label="Toggle mobile menu"
                    >
                      <motion.span
                        animate={
                          navbarOpen
                            ? { rotate: 45, y: 6 }
                            : { rotate: 0, y: 0 }
                        }
                        transition={{ duration: 0.2 }}
                        className="block w-5 h-0.5 bg-gray-700 origin-center"
                      />
                      <motion.span
                        animate={
                          navbarOpen
                            ? { opacity: 0, scaleX: 0 }
                            : { opacity: 1, scaleX: 1 }
                        }
                        transition={{ duration: 0.2 }}
                        className="block w-5 h-0.5 bg-gray-700 mt-1.5 origin-center"
                      />
                      <motion.span
                        animate={
                          navbarOpen
                            ? { rotate: -45, y: -6 }
                            : { rotate: 0, y: 0 }
                        }
                        transition={{ duration: 0.2 }}
                        className="block w-5 h-0.5 bg-gray-700 mt-1.5 origin-center"
                      />
                    </button>
                  )}
                </div>

                {/* Desktop: user buttons */}
                <div className="items-center gap-3 lg:flex hidden">
                  {visible && (
                    <Button
                      variant="default"
                      className="h-9 px-4 rounded-lg text-sm font-medium"
                      onClick={() => router.push("/dashboard")}
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="h-9 px-4 rounded-lg text-sm font-medium bg-white hover:bg-gray-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Desktop auth buttons */}
                <div className="hidden lg:flex items-center gap-3">
                  <button
                    className="relative overflow-hidden h-9 px-5 rounded-lg text-sm font-medium text-primary border border-primary/30 bg-transparent hover:bg-primary hover:text-white transition-all duration-300 hover:border-primary hover:shadow-md hover:shadow-primary/20"
                    onClick={() => setIsSignInOpen(true)}
                  >
                    Sign In
                  </button>
                  <button
                    className="h-9 px-5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-all duration-300 hover:shadow-md hover:shadow-primary/30 border border-primary"
                    onClick={() => router.push("/login")}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Mobile hamburger (no user) */}
                <button
                  onClick={() => setNavbarOpen(!navbarOpen)}
                  className="relative flex flex-col justify-center items-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
                  aria-label="Toggle mobile menu"
                >
                  <motion.span
                    animate={
                      navbarOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }
                    }
                    transition={{ duration: 0.2 }}
                    className="block w-5 h-0.5 bg-gray-700 origin-center"
                  />
                  <motion.span
                    animate={
                      navbarOpen
                        ? { opacity: 0, scaleX: 0 }
                        : { opacity: 1, scaleX: 1 }
                    }
                    transition={{ duration: 0.2 }}
                    className="block w-5 h-0.5 bg-gray-700 mt-1.5 origin-center"
                  />
                  <motion.span
                    animate={
                      navbarOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
                    }
                    transition={{ duration: 0.2 }}
                    className="block w-5 h-0.5 bg-gray-700 mt-1.5 origin-center"
                  />
                </button>
              </>
            )}
          </div>
        </div>

      </header>

      {/* Sign In Modal */}
      <AnimatePresence>
        {isSignInOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSignInOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              ref={signInRef}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden z-[101] p-6 sm:p-8"
            >
              <div className="sm:hidden flex justify-center mb-4">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
              </div>
              <button
                onClick={() => setIsSignInOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close Sign In Modal"
              >
                <Icon
                  icon="material-symbols:close-rounded"
                  width={24}
                  height={24}
                  className="text-gray-500"
                />
              </button>
              <div className="mt-4">
                <Signin />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sign Up Modal */}
      {isSignUpOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-[100]">
          <div
            ref={signUpRef}
            className="relative mx-auto bg-white w-full max-w-md overflow-hidden rounded-2xl shadow-2xl px-8 pt-14 pb-8 text-center"
          >
            <button
              onClick={() => setIsSignUpOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close Sign Up Modal"
            >
              <Icon
                icon="material-symbols:close-rounded"
                width={24}
                height={24}
                className="text-gray-500"
              />
            </button>
            <SignUp />
          </div>
        </div>
      )}

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {navbarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[998] lg:hidden"
            onClick={() => setNavbarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <div
        ref={mobileMenuRef}
        className={`lg:hidden fixed z-[999] top-0 right-0 h-full w-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col
          ${navbarOpen ? "translate-x-0" : "translate-x-full"}
        `}
        style={{
          backgroundImage: "url('/compli/bg-login.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <Logo />
          <button
            onClick={() => setNavbarOpen(false)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 flex flex-col p-5 gap-1 overflow-y-auto items-center justify-center">
          {headerData.map((item, index) => (
            <div key={index} onClick={() => setNavbarOpen(false)}>
              <MobileHeaderLink item={item} />
            </div>
          ))}
        </nav>

        {/* Auth / User Buttons */}
        <div className="p-5 border-t border-gray-100 mb-20">
          {user ? (
            <div className="flex flex-col gap-3">
              <Button
                variant="default"
                className="w-full justify-center h-10 rounded-lg font-medium"
                onClick={() => {
                  router.push("/dashboard");
                  setNavbarOpen(false);
                }}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant="outline"
                className="w-full justify-center h-10 rounded-lg font-medium bg-white"
                onClick={() => {
                  handleLogout();
                  setNavbarOpen(false);
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                className="w-full h-10 rounded-lg border border-primary text-primary font-medium hover:bg-primary hover:text-white transition-all duration-300"
                onClick={() => {
                  setIsSignInOpen(true);
                  setNavbarOpen(false);
                }}
              >
                Sign In
              </button>
              <button
                className="w-full h-10 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-all duration-300"
                onClick={() => {
                  router.push("/login");
                  setNavbarOpen(false);
                }}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Partner Logos */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-6">
            <img
              src="/logo.png"
              alt="CompliRisk"
              className="h-12 w-auto object-contain opacity-80"
            />
            <div className="w-px h-7 bg-gray-200" />
            <img
              src="/pecb.png"
              alt="PECB"
              className="h-9 w-auto object-contain opacity-80"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

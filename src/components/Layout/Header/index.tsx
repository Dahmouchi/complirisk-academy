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
  Megaphone,
  Settings,
  User,
} from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
      <div className="relative">
        {!navbarOpen && (
          <div
            className={`${sticky ? "lg:hidden" : "lg:block"} m-2 hidden lg:block rounded-[8px] z-40 relative bg-primary hover:text-blue-400 cursor-pointer  text-primary-foreground py-2 text-center text-sm`}
            onClick={() => {
              router.push("/courses");
            }}
          >
            Cours gratuits 🎉 Offre limitée, inscrivez-vous vite !
            <span className="ml-2 cursor-pointer hover:underline">→</span>
          </div>
        )}
        <header
          className={`fixed top-0 z-30 w-full transition-all duration-300 ${
            sticky
              ? " shadow-lg bg-white py-4"
              : "shadow-none py-4 lg:mt-8 bg-white"
          }`}
        >
          <div>
            <div className="mx-auto max-w-7xl px-4 flex items-center justify-between">
              <Logo />
              {visible && (
                <nav className="hidden lg:flex grow items-center gap-8 justify-start ml-14">
                  {headerData.map((item, index) => (
                    <HeaderLink key={index} item={item} />
                  ))}
                </nav>
              )}
              {user ? (
                <>
                  <div className="flex items-center gap-4 lg:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center  gap-2 px-2 hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                            <div className="relative">
                              {!user?.image && (
                                <div className="absolute top-0 right-0 z-50 bg-red-500 rounded-full w-2 h-2" />
                              )}
                              <Avatar className="w-10 h-10 border-2 border-gray-200">
                                <AvatarImage
                                  src={`${user?.image}`}
                                  alt={user?.username}
                                />
                                <AvatarFallback>{initials}</AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="hidden md:block text-left">
                              <p className="text-sm font-semibold">
                                {" "}
                                {user?.username}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Étudiant
                              </p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-56 rounded-[6px]"
                      >
                        <div className="flex items-center gap-2 p-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={`${user?.image}`}
                              alt={user?.username}
                            />
                            <AvatarFallback className="bg-blue-600/10 text-blue-600">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {user?.username}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Étudiant
                            </span>
                          </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer relative"
                          onClick={() => router.push("/dashboard")}
                        >
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer relative"
                          onClick={() => router.push("/dashboard/profile")}
                        >
                          {!user?.image && (
                            <div className="absolute top-0 right-0 z-50 bg-red-500 rounded-full w-2 h-2" />
                          )}
                          <User className="mr-2 h-4 w-4" />
                          <span>Mon profil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => router.push("/dashboard/profile")}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Paramètres</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer text-destructive focus:text-destructive"
                          onClick={handleLogout}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Se déconnecter</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {isbotton && (
                      <button
                        onClick={() => setNavbarOpen(!navbarOpen)}
                        className="block lg:hidden p-2 rounded-lg"
                        aria-label="Toggle mobile menu"
                      >
                        <span className="block w-6 h-0.5 bg-black"></span>
                        <span className="block w-6 h-0.5 bg-black mt-1.5"></span>
                        <span className="block w-6 h-0.5 bg-black mt-1.5"></span>
                      </button>
                    )}
                  </div>

                  <div className="items-center gap-4 lg:flex hidden">
                    {visible && (
                      <Button
                        variant="default"
                        className="w-fit justify-center"
                        onClick={() => {
                          router.push("/dashboard");
                        }}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="w-fit justify-center bg-white"
                      onClick={() => {
                        handleLogout();
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <button
                    className="hidden lg:block bg-transparent text-primary border hover:bg-primary border-primary hover:text-white duration-300 px-6 py-2 rounded-lg hover:cursor-pointer"
                    onClick={() => {
                      setIsSignInOpen(true);
                    }}
                  >
                    Sign In
                  </button>
                  <AnimatePresence>
                    {isSignInOpen && (
                      <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
                        {/* Backdrop */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setIsSignInOpen(false)}
                          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                        />

                        {/* Modal Container */}
                        <motion.div
                          ref={signInRef}
                          initial={{ y: "100%", opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: "100%", opacity: 0 }}
                          transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 200,
                          }}
                          className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden z-[101] p-6 sm:p-8"
                        >
                          {/* Google-stye Handle for mobile */}
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
                  <button
                    className="hidden lg:block bg-primary text-white text-base font-medium hover:bg-transparent duration-300 hover:text-primary border border-primary px-6 py-2 rounded-lg hover:cursor-pointer"
                    onClick={() => {
                      router.push("/login");
                    }}
                  >
                    Sign Up
                  </button>
                  {isSignUpOpen && (
                    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
                      <div
                        ref={signUpRef}
                        className="relative mx-auto bg-white w-full max-w-md overflow-hidden rounded-lg bg-dark_grey/90 backdrop-blur-md px-8 pt-14 pb-8 text-center"
                      >
                        <button
                          onClick={() => setIsSignUpOpen(false)}
                          className="absolute top-0 right-0 mr-8 mt-8 dark:invert"
                          aria-label="Close Sign Up Modal"
                        >
                          <Icon
                            icon="material-symbols:close-rounded"
                            width={24}
                            height={24}
                            className="text-black hover:text-primary inline-block hover:cursor-pointer"
                          />
                        </button>
                        <SignUp />
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setNavbarOpen(!navbarOpen)}
                    className="block lg:hidden p-2 rounded-lg"
                    aria-label="Toggle mobile menu"
                  >
                    <span className="block w-6 h-0.5 bg-black"></span>
                    <span className="block w-6 h-0.5 bg-black mt-1.5"></span>
                    <span className="block w-6 h-0.5 bg-black mt-1.5"></span>
                  </button>
                </div>
              )}
            </div>
            {navbarOpen && (
              <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-40" />
            )}
            <div
              ref={mobileMenuRef}
              className={`lg:hidden fixed relat z-50 top-0 right-0 h-full w-full bg-white shadow-lg transform transition-transform duration-300 max-w-xs ${
                navbarOpen ? "translate-x-0" : "translate-x-full"
              } z-50`}
            >
              <div className="flex items-center justify-between p-4">
                <h2 className="text-lg font-bold text-midnight_text">
                  <Logo />
                </h2>
                {/*  */}
                <button
                  onClick={() => setNavbarOpen(false)}
                  className="bg-black/30 rounded-full p-1 text-white"
                  aria-label="Close menu Modal"
                >
                  <Icon
                    icon={"material-symbols:close-rounded"}
                    width={24}
                    height={24}
                  />
                </button>
              </div>
              <nav className="flex flex-col items-start p-4">
                {headerData.map((item, index) => (
                  <div key={index} onClick={() => setNavbarOpen(false)}>
                    <MobileHeaderLink item={item} />
                  </div>
                ))}
                {user ? (
                  <div className="flex flex-col mt-5 gap-4 w-full">
                    <Button
                      variant="default"
                      className="w-full justify-center "
                      onClick={() => {
                        router.push("/dashboard");
                      }}
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-center bg-white"
                      onClick={() => {
                        handleLogout();
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col gap-4 w-full">
                    <button
                      className="bg-primary text-white px-4 py-2 rounded-lg border  border-primary hover:text-primary hover:bg-transparent hover:cursor-pointer transition duration-300 ease-in-out"
                      onClick={() => {
                        setIsSignInOpen(true);
                        setNavbarOpen(false);
                      }}
                    >
                      Sign In
                    </button>
                    <button
                      className="bg-primary text-white px-4 py-2 rounded-lg border  border-primary hover:text-primary hover:bg-transparent hover:cursor-pointer transition duration-300 ease-in-out"
                      onClick={() => {
                        router.push("/login");
                      }}
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </nav>
            </div>
          </div>
        </header>
      </div>
    </>
  );
};

export default Header;

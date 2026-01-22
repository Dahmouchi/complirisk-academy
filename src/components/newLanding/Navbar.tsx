"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, LayoutDashboard, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const navLinks = [
  { href: "#accueil", label: "Accueil" },
  { href: "#formations", label: "Cours" },
  { href: "#about", label: "À Propos" },
  { href: "#contact", label: "Contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="fixed top-0 z-50 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-border">
      <nav className="container-custom flex items-center justify-between h-16 md:h-20 px-4 md:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <img src="/optimized/logoH.webp" className="w-32 h-auto" alt="" />
        </a>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button className="p-2  text-muted-foreground hover:text-foreground transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <div className="flex flex-row gap-2">
            {user ? (
              <>
                <Button
                  variant="default"
                  className="w-fit justify-center"
                  onClick={() => {
                    router.push("/dashboard");
                    setIsOpen(false);
                  }}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  className="w-fit justify-center"
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="cursor-pointer"
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/login")}
                >
                  Connexion
                </Button>
                <Button
                  variant="hero"
                  className="cursor-pointer"
                  size="sm"
                  onClick={() => router.push("/login")}
                >
                  S&apos;inscrire
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              style={{
                backgroundImage: "url('/optimized/bgblue2.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="fixed top-0 right-0 bottom-0 w-full bg-white h-screen z-50 overflow-y-auto"
            >
              {/* Close Button & Logo */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white">
                <div className="w-10" /> {/* Spacer for centering */}
                <a href="#" className="flex items-center gap-2">
                  <img
                    src="/optimized/logoH.webp"
                    className="w-32 h-auto"
                    alt=""
                  />
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Items - Centered */}
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6">
                <motion.ul
                  className="flex flex-col items-center gap-2 w-full max-w-sm"
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.href}
                      variants={{
                        closed: { opacity: 0, x: 50 },
                        open: { opacity: 1, x: 0 },
                      }}
                      transition={{ delay: index * 0.1 }}
                      className="w-full"
                    >
                      <a
                        href={link.href}
                        className="block py-4 px-6 text-center text-lg font-bold text-primary hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </a>
                    </motion.li>
                  ))}
                </motion.ul>

                {/* Buttons */}
                <motion.div
                  className="flex flex-col gap-3 w-full max-w-sm mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <button
                    onClick={() => router.push("/login")}
                    className="w-full py-3 px-6 text-blue-800 bg-white font-medium border-2 border-primary rounded-full hover:bg-primary/10 transition-colors"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => router.push("/login")}
                    className="w-full py-3 px-6 text-white font-medium bg-primary rounded-full hover:bg-primary/80 transition-colors"
                  >
                    S'inscrire
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

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
          <img src="/cinq/logoH.png" className="w-32 h-auto" alt="" />
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
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <ul className="flex flex-col py-4 px-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block py-3 text-foreground hover:text-primary transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-4 flex flex-col gap-2">
                <Button variant="ghost" className="w-full justify-center">
                  Connexion
                </Button>
                <Button variant="hero" className="w-full justify-center">
                  S&apos;inscrire
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

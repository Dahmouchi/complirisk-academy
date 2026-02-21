"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const StickyMobileCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar on mobile when scrolled down past a certain point
      if (window.innerWidth <= 767 && window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-0 z-[99] right-0  bg-white backdrop-blur-md pb-2 pt-4 px-6 shadow-xl border-b border-black/5 flex items-center justify-center gap-2 md:hidden">
      <Button
        onClick={() => router.push("/login")}
        size="lg"
        className="shadow-primary px-8 w-1/2  lg:w-fit rounded-[8px]"
      >
        Connectez-vous
      </Button>
      <Button
        onClick={() => router.push("/login")}
        variant="outline"
        size="lg"
        className="px-8 w-1/2  lg:w-fit border-primary border rounded-[8px]"
      >
        S&apos;inscrire
      </Button>
    </div>
  );
};

export default StickyMobileCTA;

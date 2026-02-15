"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CartButtonProps {
  cartCount: number;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  showLabel?: boolean;
}

/**
 * Reusable cart button component that displays cart count
 * and navigates to the courses/cart page
 */
export default function CartButton({
  cartCount,
  className,
  variant = "default",
  showLabel = true,
}: CartButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant={variant}
      className={cn("relative gap-2", className)}
      onClick={() => router.push("/dashboard/courses")}
    >
      <ShoppingCart className="h-4 w-4" />
      {showLabel && <span className="hidden sm:inline">Mon Panier</span>}
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-background animate-pulse">
          {cartCount}
        </span>
      )}
    </Button>
  );
}

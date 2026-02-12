import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: "default" | "primary" | "success" | "warning";
}

const variantStyles = {
  default: "bg-card",
  primary: "bg-primary text-primary-foreground",
  success: "bg-green-500 text-white",
  warning: "bg-yellow-500 text-white",
};

const iconStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary-foreground/20 text-primary-foreground",
  success: "bg-white/20 text-white",
  warning: "bg-yellow-500/20 text-white",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in",
        variantStyles[variant],
      )}
    >
      <CardContent className="px-6">
        <div className="flex items-start justify-between lg:flex-row flex-col-reverse">
          <div className="space-y-2">
            <p
              className={cn(
                "text-sm font-medium",
                variant === "default" ? "text-muted-foreground" : "opacity-90",
              )}
            >
              {title}
            </p>
            <p className="font-display text-xl lg:text-3xl font-bold">
              {value}
            </p>
            {subtitle && (
              <p
                className={cn(
                  "text-sm",
                  variant === "default"
                    ? "text-muted-foreground"
                    : "opacity-80",
                )}
              >
                {subtitle}
              </p>
            )}
            {trend && (
              <div className="flex items-center gap-1 text-sm">
                <span
                  className={cn(
                    "font-semibold",
                    trend.value >= 0 ? "text-success" : "text-destructive",
                  )}
                >
                  {trend.value >= 0 ? "+" : ""}
                  {trend.value}%
                </span>
                <span className="opacity-70">{trend.label}</span>
              </div>
            )}
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl",
              iconStyles[variant],
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

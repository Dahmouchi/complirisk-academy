import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtext?: string;
  color: string;
  delay?: number;
}

export const StatsCard = ({
  icon: Icon,
  label,
  value,
  subtext,
  color,
  delay = 0,
}: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative overflow-hidden z-0 rounded-2xl bg-card border border-gray-300 shadow-sm p-6"
    >
      {/* Gradient background accent */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 ${color}`}
        style={{ transform: "translate(30%, -30%)" }}
      />

      <div className="relative z-10">
        <div
          className={`inline-flex p-3 rounded-[8px] ${color} bg-opacity-10 mb-4`}
        >
          <Icon className={`w-6 h-6 text-white`} />
        </div>

        <p className="text-sm text-muted-foreground font-medium mb-1">
          {label}
        </p>
        <p className="lg:text-3xl text-lg font-bold text-foreground font-display">
          {value}
        </p>
        {subtext && (
          <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
        )}
      </div>
    </motion.div>
  );
};

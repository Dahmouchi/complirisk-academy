import { ProgressProps } from "@/types/product";
import React from "react";

const Progress: React.FC<ProgressProps> = ({
  value = 0,
  max = 100,
  className = "",
  showLabel = false,
  color = "purple",
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colorClasses: Record<string, string> = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
          <span>Progression</span>
          <span>
            {value}/{max}
          </span>
        </div>
      )}

      <div className="w-full bg-[#e7e7e7] rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            colorClasses["blue"] || colorClasses.blue
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {showLabel && (
        <div className="text-xs text-gray-500 mt-1 text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};

export default Progress;

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAllBadges, getUserBadges } from "@/actions/badge.actions";
import { Badge, EarnedBadge } from "@prisma/client";
import { Lock } from "lucide-react";

type EarnedBadgeWithBadge = EarnedBadge & { badge: Badge };

interface BadgeCondition {
  hoursRequired?: number;
  coursesRequired?: number;
  quizzesRequired?: number;
  streakRequired?: number;
  scoreRequired?: number;
}

export function BadgesDisplay() {
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadgeWithBadge[]>([]);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      const result = await getUserBadges();
      const allBadgesResult = await getAllBadges();

      if (allBadgesResult.success && allBadgesResult.badges) {
        setAllBadges(allBadgesResult.badges);
      }

      if (result.success && result.badges) {
        setEarnedBadges(result.badges);
      }
    } catch (error) {
      console.error("Error loading badges:", error);
    } finally {
      setLoading(false);
    }
  };

  const earnedBadgeIds = earnedBadges.map((eb) => eb.badge.id);

  const getConditionText = (condition: BadgeCondition): string => {
    const parts = [];
    if (condition.hoursRequired) parts.push(`${condition.hoursRequired}h`);
    if (condition.coursesRequired)
      parts.push(`${condition.coursesRequired} cours`);
    if (condition.quizzesRequired)
      parts.push(`${condition.quizzesRequired} quiz`);
    if (condition.streakRequired)
      parts.push(`${condition.streakRequired} jours`);
    return parts.join(" • ");
  };
  const sortedBadges = [...allBadges].sort((a, b) => {
    const aEarned = earnedBadgeIds.includes(a.id);
    const bEarned = earnedBadgeIds.includes(b.id);

    // Earned badges first
    if (aEarned && !bEarned) return -1;
    if (!aEarned && bEarned) return 1;

    return 0; // keep original order otherwise
  });
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            🏅 Badges
            <span className="text-sm text-muted-foreground font-normal">
              ({earnedBadges.length}/{allBadges.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Chargement...
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-scroll">
              {sortedBadges.map((badge, index) => {
                const isEarned = earnedBadgeIds.includes(badge.id);
                const earnedBadge = earnedBadges.find(
                  (eb) => eb.badge.id === badge.id
                );
                const condition = badge.condition as BadgeCondition;

                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                    className={`p-3 rounded-[8px] border text-center transition-all relative ${
                      isEarned
                        ? "bg-blue-600/5 border-blue-600/20 hover:border-blue-600/40 cursor-pointer group"
                        : "bg-muted/30 border-border opacity-60"
                    }`}
                    title={
                      isEarned
                        ? `Obtenu le ${new Date(
                            earnedBadge!.earnedAt
                          ).toLocaleDateString("fr-FR")}`
                        : `Requis: ${getConditionText(condition)}`
                    }
                  >
                    {/* Lock icon for locked badges */}
                    {!isEarned && (
                      <div className="absolute top-2 right-2">
                        <Lock className="w-3 h-3 text-muted-foreground" />
                      </div>
                    )}

                    <span
                      className={`text-2xl inline-block transition-transform ${
                        isEarned
                          ? "group-hover:scale-110 filter-none"
                          : "grayscale opacity-50"
                      }`}
                    >
                      {badge.icon}
                    </span>
                    <p
                      className={`text-xs font-medium mt-1 ${
                        !isEarned && "text-muted-foreground"
                      }`}
                    >
                      {badge.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">
                      {badge.description}
                    </p>

                    {/* Show condition for locked badges */}
                    {!isEarned && (
                      <p className="text-[9px] text-muted-foreground mt-1 font-medium">
                        {getConditionText(condition)}
                      </p>
                    )}
                  </motion.div>
                );
              })}

              {/* Show message when no badges exist at all */}
              {allBadges.length === 0 && (
                <div className="col-span-2 text-center py-8 text-muted-foreground">
                  <p className="text-sm">Aucun badge disponible</p>
                  <p className="text-xs mt-1">
                    Les badges seront bientôt disponibles!
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

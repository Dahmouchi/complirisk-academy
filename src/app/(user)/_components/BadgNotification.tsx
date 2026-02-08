"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award, Sparkles, Zap, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkEligibleBadges, claimBadge } from "@/actions/badge.actions";
import { Badge } from "@prisma/client";

export function BadgeNotification() {
  const [eligibleBadges, setEligibleBadges] = useState<Badge[]>([]);
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    checkForNewBadges();
  }, []);

  const checkForNewBadges = async () => {
    const result = await checkEligibleBadges();
    if (
      result.success &&
      result.eligibleBadges &&
      result.eligibleBadges.length > 0
    ) {
      setEligibleBadges(result.eligibleBadges);
      setIsVisible(true);
    }
  };

  const handleClaimBadge = async () => {
    if (eligibleBadges.length === 0) return;
    setShowConfetti(true);
    setIsClaiming(true);
    const currentBadge = eligibleBadges[currentBadgeIndex];
    const result = await claimBadge(currentBadge.id);

    if (result.success) {
      // Move to next badge or close if no more
      if (currentBadgeIndex < eligibleBadges.length - 1) {
        setCurrentBadgeIndex(currentBadgeIndex + 1);
      } else {
        setIsVisible(false);
        // Refresh the page or update the UI
        window.location.reload();
      }
    }
    setIsClaiming(false);
  };

  const handleDismiss = () => {
    if (currentBadgeIndex < eligibleBadges.length - 1) {
      setCurrentBadgeIndex(currentBadgeIndex + 1);
    } else {
      setIsVisible(false);
    }
  };

  if (!isVisible || eligibleBadges.length === 0) return null;

  const currentBadge = eligibleBadges[currentBadgeIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={handleDismiss}
          />

          {/* Main notification */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className="fixed bottom-8 right-4 lg:right-8 z-50 w-[380px] max-w-[calc(100vw-2rem)]"
          >
            {/* Glow effect behind card */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl opacity-60" />

            <div className="relative bg-gradient-to-br from-slate-900 via-purple-900/90 to-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/10">
              {/* Confetti effect */}
              {showConfetti && <Confetti />}

              {/* Animated background gradient */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.2),transparent_50%)]" />
              </div>

              {/* Floating particles */}
              <FloatingParticle
                delay={0}
                duration={3}
                size={6}
                left="10%"
                top="20%"
              />
              <FloatingParticle
                delay={0.5}
                duration={4}
                size={4}
                left="85%"
                top="30%"
              />
              <FloatingParticle
                delay={1}
                duration={3.5}
                size={5}
                left="70%"
                top="70%"
              />
              <FloatingParticle
                delay={1.5}
                duration={4.5}
                size={3}
                left="20%"
                top="80%"
              />
              <FloatingParticle
                delay={2}
                duration={3}
                size={4}
                left="50%"
                top="15%"
              />

              {/* Sparkle icons */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-6 right-12 text-yellow-400/60"
              >
                <Star className="w-4 h-4 fill-current" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-20 left-8 text-purple-400/50"
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>

              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-all duration-200 z-20 group"
              >
                <X className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
              </button>

              {/* Content */}
              <div className="relative z-10 p-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-5">
                  <motion.div
                    animate={{
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="relative"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-[6px] flex items-center justify-center shadow-lg shadow-orange-500/30">
                      <Trophy className="w-7 h-7 text-white" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900"
                    />
                  </motion.div>
                  <div>
                    <motion.h3
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="font-bold text-xl text-white flex items-center gap-2"
                    >
                      Nouveau Badge!
                      <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </motion.h3>
                    <p className="text-sm text-white/50 font-medium">
                      Badge {currentBadgeIndex + 1} sur {eligibleBadges.length}
                    </p>
                  </div>
                </div>

                {/* Badge card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative bg-white/5 backdrop-blur-md rounded-[6px] p-5 mb-5 border border-white/10 overflow-hidden"
                >
                  {/* Inner glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />

                  <div className="relative text-center">
                    <motion.div
                      animate={{
                        y: [-4, 4, -4],
                        rotate: [-2, 2, -2],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="mb-4"
                    >
                      <span className="text-6xl filter drop-shadow-lg">
                        {currentBadge.icon}
                      </span>
                    </motion.div>
                    <h4 className="font-bold text-xl text-white mb-2 tracking-wide">
                      {currentBadge.name}
                    </h4>
                    <p className="text-sm text-white/70 leading-relaxed">
                      {currentBadge.description}
                    </p>
                  </div>
                </motion.div>

                {/* Progress indicator for multiple badges */}
                {eligibleBadges.length > 1 && (
                  <div className="flex justify-center gap-1.5 mb-5">
                    {eligibleBadges.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          index === currentBadgeIndex
                            ? "w-6 bg-gradient-to-r from-purple-400 to-pink-400"
                            : index < currentBadgeIndex
                              ? "w-1.5 bg-green-400"
                              : "w-1.5 bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleClaimBadge}
                    disabled={isClaiming}
                    className="flex-1 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-[8px] shadow-lg shadow-purple-500/25 border-0 transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isClaiming ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <span className="flex items-center gap-2">
                        Réclamer
                        <span className="text-lg">🎉</span>
                      </span>
                    )}
                  </Button>
                  <Button
                    onClick={handleDismiss}
                    variant="ghost"
                    className="h-12 px-5 text-white/70 hover:text-white hover:bg-white/10 rounded-[8px] font-medium transition-all duration-200"
                  >
                    Plus tard
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
const FloatingParticle = ({
  delay,
  duration,
  size,
  left,
  top,
}: {
  delay: number;
  duration: number;
  size: number;
  left: string;
  top: string;
}) => (
  <motion.div
    className="absolute rounded-full bg-white/30"
    style={{ width: size, height: size, left, top }}
    animate={{
      y: [-20, 20, -20],
      x: [-10, 10, -10],
      opacity: [0.3, 0.8, 0.3],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);
const Confetti = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          backgroundColor: [
            "#FFD700",
            "#FF6B6B",
            "#4ECDC4",
            "#A78BFA",
            "#F472B6",
          ][i % 5],
        }}
        initial={{ y: -20, opacity: 1 }}
        animate={{
          y: 400,
          opacity: 0,
          rotate: Math.random() * 720,
          x: (Math.random() - 0.5) * 200,
        }}
        transition={{
          duration: 2 + Math.random() * 2,
          delay: Math.random() * 0.5,
          ease: "easeOut",
        }}
      />
    ))}
  </div>
);

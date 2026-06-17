"use client";
import { motion, AnimatePresence } from "framer-motion";
import { scrollStoryActs } from "@/data/dummy";

interface ScrollStoryOverlayProps {
  currentAct: number;
}

export default function ScrollStoryOverlay({ currentAct }: ScrollStoryOverlayProps) {
  const act = scrollStoryActs[currentAct - 1];
  if (!act) return null;

  // Only show overlay for acts 1–7 (the 3D story section)
  if (currentAct < 1 || currentAct > 7) return null;

  const isFinalAct = currentAct === 7;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentAct}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none"
      >
        {isFinalAct ? (
          <div className="space-y-2">
            {["PLAY", "LEARN", "CONNECT"].map((word, i) => (
              <motion.div
                key={word}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2 }}
                className="font-orbitron font-black text-5xl md:text-7xl text-neon-orange leading-none"
                style={{
                  textShadow: `0 0 30px rgba(255,91,0,0.8), 0 0 80px rgba(255,91,0,0.4)`,
                }}
              >
                {word}
              </motion.div>
            ))}
          </div>
        ) : (
          <>
            {act.instrument && (
              <div className="text-4xl mb-2 animate-float">{act.instrument}</div>
            )}
            <div
              className="font-orbitron font-black text-2xl md:text-3xl mb-1"
              style={{ color: act.color, textShadow: `0 0 20px ${act.color}80` }}
            >
              {act.title}
            </div>
            <div className="font-space text-sm text-white/40 tracking-widest">
              {act.subtitle}
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

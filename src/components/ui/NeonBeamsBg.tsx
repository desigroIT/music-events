"use client";
import { motion } from "framer-motion";

export default function NeonBeamsBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
        className="absolute w-full h-full opacity-60"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Neon Glow Filters */}
          <filter id="glow-orange-beam" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur1" />
            <feGaussianBlur stdDeviation="20" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-blue-beam" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur1" />
            <feGaussianBlur stdDeviation="20" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-purple-beam" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur1" />
            <feGaussianBlur stdDeviation="20" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradients to fade out the ends of the light beams */}
          <linearGradient id="grad-orange-beam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF5B00" stopOpacity="0" />
            <stop offset="30%" stopColor="#FF5B00" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="70%" stopColor="#FF5B00" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF5B00" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="grad-blue-beam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4FF" stopOpacity="0" />
            <stop offset="30%" stopColor="#00D4FF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="70%" stopColor="#00D4FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="grad-purple-beam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9D4EDD" stopOpacity="0" />
            <stop offset="30%" stopColor="#9D4EDD" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="70%" stopColor="#9D4EDD" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#9D4EDD" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Beam 1: Diagonal Orange slash from top-left to bottom-right */}
        <motion.path
          d="M -100 -50 L 2020 1130"
          stroke="url(#grad-orange-beam)"
          strokeWidth="3.5"
          fill="none"
          filter="url(#glow-orange-beam)"
          initial={{ pathLength: 0.15, pathOffset: -0.15 }}
          animate={{ pathOffset: 1.15 }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0,
          }}
        />

        {/* Beam 2: Diagonal Blue slash from top-right to bottom-left */}
        <motion.path
          d="M 2020 -50 L -100 1130"
          stroke="url(#grad-blue-beam)"
          strokeWidth="3"
          fill="none"
          filter="url(#glow-blue-beam)"
          initial={{ pathLength: 0.18, pathOffset: -0.18 }}
          animate={{ pathOffset: 1.18 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.5,
          }}
        />

        {/* Beam 3: Purple smooth curve wave in the center */}
        <motion.path
          d="M -100 540 Q 480 180, 960 540 T 2020 540"
          stroke="url(#grad-purple-beam)"
          strokeWidth="2.5"
          fill="none"
          filter="url(#glow-purple-beam)"
          initial={{ pathLength: 0.12, pathOffset: -0.12 }}
          animate={{ pathOffset: 1.12 }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />

        {/* Beam 4: Slow Orange wave lower down */}
        <motion.path
          d="M -100 850 Q 600 650, 1300 950 T 2020 750"
          stroke="url(#grad-orange-beam)"
          strokeWidth="3"
          fill="none"
          filter="url(#glow-orange-beam)"
          initial={{ pathLength: 0.2, pathOffset: -0.2 }}
          animate={{ pathOffset: 1.2 }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />

        {/* Beam 5: Fast Blue vertical-ish slice across center */}
        <motion.path
          d="M 500 -100 L 1420 1180"
          stroke="url(#grad-blue-beam)"
          strokeWidth="2.5"
          fill="none"
          filter="url(#glow-blue-beam)"
          initial={{ pathLength: 0.1, pathOffset: -0.1 }}
          animate={{ pathOffset: 1.1 }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
      </svg>
    </div>
  );
}

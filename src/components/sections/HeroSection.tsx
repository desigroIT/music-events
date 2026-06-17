"use client";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { heroData } from "@/data/dummy";
import { ChevronDown, Play, Users } from "lucide-react";
import NeonInstrumentsBg from "@/components/ui/NeonInstrumentsBg";
import NeonBeamsBg from "@/components/ui/NeonBeamsBg";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};
const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const letterVariant: Variants = {
  hidden: { opacity: 0, y: 60 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 + 0.5, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── Background image ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src="/hero.png"
            alt="Studio Musicians Hero"
            fill
            priority
            className="object-cover object-center"
            quality={100}
          />
        </motion.div>
        {/* Animated Neon Line Instruments */}
        {/* <NeonInstrumentsBg /> */}
        <NeonBeamsBg />
        {/* Dark gradient overlay — bottom heavy so text sits clearly */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.2) 40%, rgba(5,5,5,0.8) 90%, #050505 100%)",
          }}
        />
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-overlay opacity-30" />
        {/* Radial neon glow over image */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 60%, rgba(255,91,0,0.12) 0%, rgba(0,212,255,0.07) 40%, transparent 70%)",
          }}
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center px-6 max-w-6xl mx-auto w-full"
      >
        {/* Tagline */}
        <motion.div variants={item} className="flex items-center justify-center gap-3 mb-8">
          <span className="w-12 h-px bg-[#FF5B00]" />
          <span className="section-label text-[#FF5B00]">{heroData.tagline}</span>
          <span className="w-12 h-px bg-[#FF5B00]" />
        </motion.div>

        {/* Headline */}
        <div className="overflow-hidden mb-2">
          <h1 className="font-orbitron font-black leading-none tracking-tight">
            {heroData.headline.split("\n").map((line, li) => (
              <div key={li} className="flex items-center justify-center flex-wrap">
                {line.split("").map((char, i) => (
                  <motion.span
                    key={`${li}-${i}`}
                    custom={li * 10 + i}
                    variants={letterVariant}
                    initial="hidden"
                    animate="show"
                    className={`inline-block ${li === 0
                      ? "text-[clamp(3.5rem,12vw,9rem)] text-white"
                      : "text-[clamp(3rem,11vw,8rem)] text-neon-orange"
                      }`}
                    style={li === 1 ? { textShadow: "0 0 40px rgba(255,91,0,0.6), 0 0 80px rgba(255,91,0,0.3)" } : {}}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </div>
            ))}
          </h1>
        </div>

        {/* Subheadline */}
        <motion.p
          variants={item}
          className="font-space text-white/50 text-base md:text-lg max-w-2xl mx-auto mt-8 mb-12 leading-relaxed"
        >
          {heroData.subheadline}
        </motion.p>

        {/* CTA buttons */}
        <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button className="btn-neon btn-orange flex items-center gap-2 text-sm">
            <Play size={16} fill="white" />
            {heroData.cta.primary}
          </button>
          <button className="btn-neon btn-outline-orange flex items-center gap-2 text-sm">
            <Users size={16} />
            {heroData.cta.secondary}
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={item}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
        >
          {heroData.stats.map((stat, i) => (
            <div key={i} className="text-center glass-card p-4 border border-white/5">
              <div className="font-orbitron font-black text-2xl md:text-3xl text-neon-orange mb-1">
                {stat.value}
              </div>
              <div className="font-space text-xs text-white/40 tracking-widest uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="font-space text-xs text-white/30 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={20} className="text-[#FF5B00]" />
        </motion.div>
      </motion.div>
    </section>
  );
}

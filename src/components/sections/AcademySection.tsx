"use client";
import { motion } from "framer-motion";
import { academyFeatures, academyStats } from "@/data/dummy";
import NeonInstrumentsBg from "@/components/ui/NeonInstrumentsBg";

export default function AcademySection() {
  return (
    <section id="academy" className="section-padding relative overflow-hidden">
      <NeonInstrumentsBg variant="A" />
      {/* Background glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "60vw",
          height: "60vh",
          top: "20%",
          right: "-20%",
          background: "radial-gradient(ellipse, rgba(0,212,255,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-[#00D4FF]" />
            <span className="section-label text-[#00D4FF]">The Learning Engine</span>
            <span className="w-8 h-px bg-[#00D4FF]" />
          </div>
          <h2 className="section-title text-3xl md:text-5xl text-white mb-4">
            Music Learning <span className="text-neon-blue">Academy</span>
          </h2>
          <p className="font-space text-white/40 max-w-xl mx-auto text-sm md:text-base">
            A complete ecosystem to take you from beginner to professional musician.
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {academyStats.map((stat, i) => (
            <div
              key={i}
              className="glass-card-blue p-5 text-center border border-[#00D4FF]/10"
            >
              <div className="font-orbitron font-black text-2xl md:text-3xl text-neon-blue mb-1">
                {stat.value}
              </div>
              <div className="font-space text-xs text-white/40 tracking-widest uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {academyFeatures.map((feat, i) => (
            <motion.div
              key={feat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              className="glass-card p-6 group cursor-pointer border border-white/5 hover-glow-blue"
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `${feat.color}15`,
                  border: `1px solid ${feat.color}30`,
                  boxShadow: `0 0 20px ${feat.color}20`,
                }}
              >
                {feat.icon}
              </div>

              {/* Title + stat */}
              <div className="flex items-start justify-between mb-3">
                <h3
                  className="font-space font-bold text-base text-white group-hover:transition-colors duration-300"
                  style={{ color: `var(--white)` }}
                >
                  {feat.title}
                </h3>
                <span
                  className="font-orbitron text-xs font-bold px-2 py-1 rounded"
                  style={{ color: feat.color, background: `${feat.color}15` }}
                >
                  {feat.stats}
                </span>
              </div>

              <p className="font-space text-xs text-white/40 leading-relaxed">
                {feat.description}
              </p>

              {/* Bottom glow line */}
              <div
                className="mt-5 h-px w-0 group-hover:w-full transition-all duration-500"
                style={{ background: `linear-gradient(90deg, ${feat.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";
import { motion } from "framer-motion";
import { networkingOpportunities, networkingMilestones } from "@/data/dummy";
import { Briefcase, Clock, Tag, ArrowRight } from "lucide-react";
import NeonInstrumentsBg from "@/components/ui/NeonInstrumentsBg";

export default function NetworkingSection() {
  return (
    <section id="networking" className="section-padding relative overflow-hidden">
      <NeonInstrumentsBg variant="D" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-[#00D4FF]" />
            <span className="section-label text-[#00D4FF]">Build Your Career</span>
            <span className="w-8 h-px bg-[#00D4FF]" />
          </div>
          <h2 className="section-title text-3xl md:text-5xl text-white mb-4">
            Music Industry <span className="text-neon-blue">Networking</span>
          </h2>
          <p className="font-space text-white/40 max-w-xl mx-auto text-sm md:text-base">
            Real opportunities from real music companies. Find session work, tours, collaborations, and more.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Opportunities */}
          <div className="lg:col-span-2 space-y-4">
            {networkingOpportunities.map((opp, i) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-5 group cursor-pointer border border-white/5 hover-glow-blue flex flex-col sm:flex-row gap-4"
              >
                {/* Type badge */}
                <div
                  className="shrink-0 w-20 h-20 rounded-lg flex items-center justify-center font-space font-bold text-xs text-center leading-tight px-1"
                  style={{
                    background: `${opp.color}15`,
                    border: `1px solid ${opp.color}30`,
                    color: opp.color,
                  }}
                >
                  {opp.type}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-space font-bold text-sm text-white mb-1 group-hover:text-[#00D4FF] transition-colors">
                    {opp.title}
                  </h3>
                  <p className="font-space text-xs text-white/40 mb-2">{opp.company}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {opp.skills.map((sk) => (
                      <span key={sk} className="text-[10px] font-space px-2 py-0.5 rounded border border-white/10 text-white/40">
                        {sk}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-space text-white/30">
                    <span className="flex items-center gap-1">
                      <Briefcase size={11} />
                      {opp.budget}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {opp.deadline}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="shrink-0 flex items-center">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ background: `${opp.color}20`, border: `1px solid ${opp.color}40` }}
                  >
                    <ArrowRight size={14} style={{ color: opp.color }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Timeline */}
          <div>
            <h3 className="font-space font-bold text-sm text-white/50 uppercase tracking-widest mb-6">
              Our Journey
            </h3>
            <div className="relative pl-6 space-y-6">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#FF5B00] via-[#9D4EDD] to-[#00D4FF]" />
              {networkingMilestones.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  <div
                    className="absolute -left-[25px] top-1 w-3 h-3 rounded-full"
                    style={{ background: m.color, boxShadow: `0 0 10px ${m.color}` }}
                  />
                  <div className="font-orbitron text-xs font-bold mb-1" style={{ color: m.color }}>
                    {m.year}
                  </div>
                  <div className="font-space font-bold text-sm text-white mb-1">{m.event}</div>
                  <div className="font-space text-xs text-white/35 leading-relaxed">{m.detail}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

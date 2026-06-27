import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import NeonInstrumentsBg from "@/components/ui/NeonInstrumentsBg";
import { getAcademyFeatures, getAcademyStats, AcademyFeature, AcademyStat } from "@/lib/academy";

export default function AcademySection() {
  const router = useRouter();
  const [features, setFeatures] = useState<AcademyFeature[]>([]);
  const [stats, setStats] = useState<AcademyStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [featuresData, statsData] = await Promise.all([
        getAcademyFeatures(),
        getAcademyStats()
      ]);
      setFeatures(featuresData);
      setStats(statsData);
      setLoading(false);
    };
    loadData();
  }, []);
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

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 size={36} className="animate-spin text-[#00D4FF]" />
          </div>
        ) : (
          <>
            {/* Stats bar */}
            {stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
              >
                {stats.map((stat, i) => (
                  <div
                    key={stat.id || i}
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
            )}

            {/* Features grid */}
            {features.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {features.map((feat, i) => (
                  <motion.div
                    key={feat.id || i}
                    onClick={() => router.push(`/academy/${feat.id}`)}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.7 }}
                    className="relative glass-card p-6 group cursor-pointer border border-white/5 transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Hover Neon Border Overlay */}
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        border: `1px solid ${feat.color}80`,
                        boxShadow: `0 0 30px ${feat.color}30, inset 0 0 15px ${feat.color}15`
                      }}
                    />

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
                      >
                        {feat.title}
                      </h3>
                      <span
                        className="font-orbitron text-[10px] font-bold px-2 py-1 rounded"
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
                      className="mt-4 h-[2px] w-0 group-hover:w-full transition-all duration-500 rounded-full"
                      style={{ background: `linear-gradient(90deg, ${feat.color}, transparent)` }}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-white/30 font-space">
                Academy content coming soon!
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

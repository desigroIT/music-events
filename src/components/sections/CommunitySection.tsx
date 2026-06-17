"use client";
import { motion } from "framer-motion";
import { communityMusicians, communityStats } from "@/data/dummy";
import { UserPlus, Music, FileText, CheckCircle } from "lucide-react";
import NeonInstrumentsBg from "@/components/ui/NeonInstrumentsBg";

export default function CommunitySection() {
  return (
    <section id="community" className="section-padding relative overflow-hidden">
      <NeonInstrumentsBg variant="B" />
      <div
        className="absolute pointer-events-none"
        style={{
          width: "70vw",
          height: "70vh",
          top: "10%",
          left: "-20%",
          background: "radial-gradient(ellipse, rgba(157,78,221,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-[#9D4EDD]" />
            <span className="section-label text-[#9D4EDD]">Find Your Tribe</span>
            <span className="w-8 h-px bg-[#9D4EDD]" />
          </div>
          <h2 className="section-title text-3xl md:text-5xl text-white mb-4">
            Musician <span className="text-neon-purple">Community</span>
          </h2>
          <p className="font-space text-white/40 max-w-xl mx-auto text-sm md:text-base">
            Connect, collaborate, and grow with 50,000+ musicians from across the globe.
          </p>
        </motion.div>

        {/* Community stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {communityStats.map((stat, i) => (
            <div key={i} className="glass-card-purple p-5 text-center border border-[#9D4EDD]/10">
              <div className="font-orbitron font-black text-2xl md:text-3xl text-neon-purple mb-1">
                {stat.value}
              </div>
              <div className="font-space text-xs text-white/40 tracking-widest uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Musician cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {communityMusicians.map((musician, i) => (
            <motion.div
              key={musician.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 group cursor-pointer border border-white/5 hover-glow-purple"
            >
              {/* Avatar + name */}
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar placeholder with initials */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-orbitron font-black shrink-0 relative"
                  style={{
                    background: `${musician.color}20`,
                    border: `2px solid ${musician.color}50`,
                    boxShadow: `0 0 20px ${musician.color}30`,
                    color: musician.color,
                  }}
                >
                  {musician.name.charAt(0)}
                  {musician.verified && (
                    <CheckCircle
                      size={14}
                      className="absolute -bottom-1 -right-1 bg-[#050505] rounded-full"
                      style={{ color: "#4ade80" }}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-space font-bold text-sm text-white truncate">
                      {musician.name}
                    </h3>
                  </div>
                  <p className="font-space text-xs text-white/40">{musician.instrument}</p>
                  <p className="font-space text-xs text-white/30 mt-0.5">{musician.country}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-orbitron font-bold text-sm" style={{ color: musician.color }}>
                    {musician.followers}
                  </div>
                  <div className="font-space text-[10px] text-white/30">followers</div>
                </div>
              </div>

              {/* Bio */}
              <p className="font-space text-xs text-white/40 leading-relaxed mb-4 line-clamp-2">
                {musician.bio}
              </p>

              {/* Stats row */}
              <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center gap-1.5 text-white/30">
                  <Music size={11} />
                  <span className="font-space text-[10px]">{musician.tracks} tracks</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/30">
                  <FileText size={11} />
                  <span className="font-space text-[10px]">{musician.posts} posts</span>
                </div>
              </div>

              {/* Connect button */}
              <button
                className="w-full btn-neon text-[11px] py-2 rounded flex items-center justify-center gap-2 font-space"
                style={{
                  background: `${musician.color}15`,
                  color: musician.color,
                  border: `1px solid ${musician.color}40`,
                }}
              >
                <UserPlus size={13} />
                Connect
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="btn-neon btn-outline-orange text-xs">
            Explore All Musicians
          </button>
        </motion.div>
      </div>
    </section>
  );
}

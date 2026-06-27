"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { communityMusicians, communityStats } from "@/data/dummy";
import { UserPlus, Music, FileText, CheckCircle } from "lucide-react";
import NeonInstrumentsBg from "@/components/ui/NeonInstrumentsBg";
import { getCommunityMusiciansDb } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";

const formatFollowers = (val: string | undefined): string => {
  if (!val) return "0";
  if (val.includes("K") || val.includes("M")) return val;
  const num = parseInt(val);
  if (isNaN(num)) return val;
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

export default function CommunitySection() {
  const router = useRouter();
  const [musicians, setMusicians] = useState<any[]>([]);
  const { userProfile } = useAuth();
  const isUserCommunityMember = userProfile?.isCommunityMember === true;

  useEffect(() => {
    const loadCommunityMusicians = async () => {
      try {
        const dbMusicians = await getCommunityMusiciansDb();
        const mappedDbMusicians = dbMusicians.map((dm) => ({
          id: dm.id || `db-${Math.random()}`,
          name: dm.name,
          instrument: dm.instrument || "Musician",
          country: dm.district || "Colombo",
          followers: formatFollowers(dm.followers),
          bio: dm.aboutMe,
          color: dm.color || "#9D4EDD",
          profilePhoto: dm.profilePhoto,
          verified: dm.verified ?? true,
          tracks: Math.floor(Math.random() * 50 + 5),
          posts: Math.floor(Math.random() * 200 + 10),
        }));

        setMusicians(mappedDbMusicians);
      } catch (err) {
        console.error("Error loading community musicians for section:", err);
        setMusicians([]);
      }
    };

    loadCommunityMusicians();
  }, []);

  const dynamicStats = [
    { value: `${musicians.length}`, label: "Members" },
    { value: `${new Set(musicians.map(m => m.country)).size}`, label: "Regions" },
    { value: `${musicians.length > 0 ? musicians.length * 3 : 0}+`, label: "Collaborations" },
    { value: `${musicians.length > 0 ? musicians.length * 45 : 0}+`, label: "Track Plays" }
  ];

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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <h2 className="section-title text-3xl md:text-5xl text-white">
              Musician <span className="text-neon-purple">Community</span>
            </h2>
            <button
              onClick={() => router.push("/community")}
              className="btn-neon btn-orange text-xs px-5 py-2.5 font-space tracking-wider whitespace-nowrap"
            >
              Join Free Community
            </button>
          </div>
          <p className="font-space text-white/40 max-w-xl mx-auto text-sm md:text-base mt-2">
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
          {dynamicStats.map((stat, i) => (
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
          {musicians.map((musician, i) => (
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
                {/* Avatar image or initials */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-orbitron font-black shrink-0 relative overflow-hidden"
                  style={{
                    background: `${musician.color}20`,
                    border: `2px solid ${musician.color}50`,
                    boxShadow: `0 0 20px ${musician.color}30`,
                    color: musician.color,
                  }}
                >
                  {musician.profilePhoto ? (
                    <img src={musician.profilePhoto} alt="" className="w-full h-full object-cover" />
                  ) : (
                    musician.name.charAt(0)
                  )}
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
                onClick={() => router.push(`/community?artist=${musician.id}`)}
                className="w-full btn-neon text-[11px] py-2 rounded flex items-center justify-center gap-2 font-space"
                style={{
                  background: `${musician.color}15`,
                  color: musician.color,
                  border: `1px solid ${musician.color}40`,
                }}
              >
                {isUserCommunityMember ? <CheckCircle size={13} /> : <UserPlus size={13} />}
                {isUserCommunityMember ? "View My Community" : "Connect"}
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
          <button 
            onClick={() => router.push("/community")}
            className="btn-neon btn-outline-orange text-xs"
          >
            Explore All Musicians
          </button>
        </motion.div>
      </div>
    </section>
  );
}

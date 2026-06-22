"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { networkingMilestones } from "@/data/dummy";
import { ArrowRight, Plus } from "lucide-react";
import NeonInstrumentsBg from "@/components/ui/NeonInstrumentsBg";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getNetworkingPosts, NetworkingPost } from "@/lib/networking";
import NetworkingCard from "@/components/cards/NetworkingCard";

export default function NetworkingSection() {
  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<NetworkingPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const data = await getNetworkingPosts(undefined, 6);
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostClick = () => {
    if (!user) {
      router.push("?auth=true&redirect=/networking");
    } else {
      router.push("/networking");
    }
  };

  const handleShowMore = () => {
    router.push("/networking");
  };

  return (
    <section id="networking" className="section-padding relative overflow-hidden">
      <NeonInstrumentsBg variant="D" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-[#00D4FF]" />
            <span className="section-label text-[#00D4FF]">Build Your Career</span>
            <span className="w-8 h-px bg-[#00D4FF]" />
          </div>
          <h2 className="section-title text-3xl md:text-5xl text-white mb-4">
            Music Industry <span className="text-neon-blue">Networking</span>
          </h2>
          <p className="font-space text-white/40 max-w-xl mx-auto text-sm md:text-base mb-8">
            Real opportunities from real music companies. Find session work, tours, collaborations, and more.
          </p>
          
          <button 
            onClick={handlePostClick}
            className="group relative flex items-center gap-3 px-8 py-4 text-sm md:text-base font-orbitron font-bold text-black bg-[#00D4FF] rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-white shadow-[0_0_20px_rgba(0,212,255,0.5)] hover:shadow-[0_0_40px_rgba(0,212,255,0.8)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <Plus size={20} className="transition-transform group-hover:rotate-90 duration-300" />
            <span>POST YOUR REQUIREMENT / SELL ITEM</span>
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Opportunities */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : posts.length > 0 ? (
              <>
                {posts.map((post, i) => (
                  <NetworkingCard 
                    key={post.id} 
                    post={post} 
                    index={i} 
                    onUpdate={fetchPosts} 
                  />
                ))}
                
                <div className="pt-4 flex justify-center">
                  <button 
                    onClick={handleShowMore}
                    className="flex items-center gap-2 font-space text-sm text-[#00D4FF] hover:text-white transition-colors group"
                  >
                    View All Opportunities
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </>
            ) : (
              <div className="glass-card p-12 text-center border border-white/5">
                <p className="font-space text-white/50 mb-4">No opportunities posted yet.</p>
                <button 
                  onClick={handlePostClick}
                  className="font-space text-sm text-[#00D4FF] hover:underline"
                >
                  Be the first to post!
                </button>
              </div>
            )}
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

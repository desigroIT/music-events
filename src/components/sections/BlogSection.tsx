"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight, PenLine, BookOpen } from "lucide-react";
import NeonInstrumentsBg from "@/components/ui/NeonInstrumentsBg";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getBlogPosts, BlogPost } from "@/lib/blog";

const CATEGORY_COLORS: Record<string, string> = {
  Technique: "#FF5B00",
  Gear: "#00D4FF",
  Industry: "#9D4EDD",
  Culture: "#FFD60A",
  Practice: "#FF5B00",
  Career: "#9D4EDD",
  General: "#FFD60A",
};

function formatDate(ts: any): string {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BlogSection() {
  const { userProfile } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const isCommunityMember = userProfile?.isCommunityMember === true;

  useEffect(() => {
    const load = async () => {
      const data = await getBlogPosts();
      setPosts(data);
      setLoading(false);
    };
    load();
  }, []);

  const featured = posts[0] ?? null;
  const rest = showAll ? posts.slice(1) : posts.slice(1, 5);
  const color = featured ? (CATEGORY_COLORS[featured.category] ?? "#FFD60A") : "#FFD60A";

  return (
    <section id="blog" className="section-padding relative overflow-hidden">
      <NeonInstrumentsBg variant="A" />
      <div
        className="absolute pointer-events-none"
        style={{
          width: "50vw", height: "50vh", bottom: "10%", right: "-15%",
          background: "radial-gradient(ellipse, rgba(255,214,10,0.05) 0%, transparent 70%)",
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
            <span className="w-8 h-px bg-[#FFD60A]" />
            <span className="section-label text-[#FFD60A]">Knowledge Base</span>
            <span className="w-8 h-px bg-[#FFD60A]" />
          </div>
          <h2 className="section-title text-3xl md:text-5xl text-white mb-4">
            Blog & <span className="text-neon-gold">Articles</span>
          </h2>
          <p className="font-space text-white/40 max-w-xl mx-auto text-sm md:text-base mb-6">
            Deep-dives, gear reviews, career advice, and music culture — from the musicians who live it.
          </p>

          {/* Publish Article button — community members only */}
          {isCommunityMember && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => router.push("/blog")}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full font-space font-bold text-sm text-black bg-[#FFD60A] hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(255,214,10,0.4)] hover:shadow-[0_0_35px_rgba(255,214,10,0.7)]"
            >
              <PenLine size={16} className="transition-transform group-hover:rotate-12 duration-300" />
              Publish Article
            </motion.button>
          )}
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#FFD60A] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 glass-card border border-white/5 rounded-2xl">
            <BookOpen size={40} className="mx-auto text-white/20 mb-4" />
            <h3 className="font-space font-bold text-xl text-white mb-2">No articles yet</h3>
            <p className="font-space text-white/40 text-sm mb-6">
              Be the first community member to publish an article!
            </p>
            {isCommunityMember && (
              <button
                onClick={() => router.push("/blog")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-space font-bold text-sm text-black bg-[#FFD60A] hover:bg-white transition-all"
              >
                <PenLine size={15} />
                Write First Article
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured Horizontal Card */}
            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => router.push(`/blog/${featured.id}`)}
                className="glass-card p-6 md:p-8 group cursor-pointer border border-white/5 hover-glow-gold relative overflow-hidden flex flex-col lg:flex-row gap-6 items-center rounded-2xl"
              >
                {featured.images?.[0] && (
                  <div className="w-full lg:w-[45%] h-56 md:h-72 rounded-xl overflow-hidden shrink-0">
                    <img
                      src={featured.images[0]}
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div
                  className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500 pointer-events-none"
                  style={{ background: `linear-gradient(135deg, ${color}, transparent)` }}
                />
                <div className="flex-1 relative z-10 flex flex-col self-stretch justify-between py-2">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="badge"
                        style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
                      >
                        {featured.category}
                      </span>
                    </div>
                    <h3 className="font-space font-bold text-xl md:text-2xl lg:text-3xl text-white mb-3 leading-snug group-hover:text-[#FFD60A] transition-colors duration-300">
                      {featured.title}
                    </h3>
                    <p className="font-space text-xs md:text-sm text-white/45 leading-relaxed mb-6 line-clamp-3">
                      {featured.subDescription}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                    <div className="flex items-center gap-4 text-xs font-space text-white/30">
                      <span className="text-white/50">{featured.authorName}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {formatDate(featured.createdAt)}
                      </span>
                    </div>
                    <button className="flex items-center gap-2 text-[#FFD60A] text-xs font-space group-hover:gap-3 transition-all">
                      Read More <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Rest Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {rest.map((post, i) => {
                  const c = CATEGORY_COLORS[post.category] ?? "#FFD60A";
                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => router.push(`/blog/${post.id}`)}
                      className="glass-card p-6 group cursor-pointer border border-white/5 hover-glow-gold rounded-xl flex flex-col justify-between"
                    >
                      <div>
                        {post.images?.[0] ? (
                          <div className="w-full h-44 rounded-lg overflow-hidden mb-4">
                            <img
                              src={post.images[0]}
                              alt=""
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ) : (
                          <div
                            className="w-full h-44 rounded-lg flex items-center justify-center mb-4"
                            style={{ background: `${c}10` }}
                          >
                            <BookOpen size={28} style={{ color: c, opacity: 0.4 }} />
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className="text-[10px] font-space tracking-wider uppercase px-2 py-0.5 rounded"
                            style={{ background: `${c}15`, color: c, border: `1px solid ${c}30` }}
                          >
                            {post.category}
                          </span>
                        </div>
                        <h4 className="font-space font-bold text-base text-white mb-2 leading-snug group-hover:text-[#FFD60A] transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="font-space text-xs text-white/40 leading-relaxed line-clamp-2 mb-4">
                          {post.subDescription}
                        </p>
                      </div>
                      <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-auto">
                        <div className="flex items-center gap-3 text-[10px] font-space text-white/30">
                          <span className="text-white/45">{post.authorName}</span>
                          <span className="flex items-center gap-1">
                            <Clock size={9} /> {formatDate(post.createdAt)}
                          </span>
                        </div>
                        <button className="flex items-center gap-1.5 text-[#FFD60A] text-xs font-space group-hover:gap-2 transition-all">
                          Read <ArrowRight size={11} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* View All Button */}
        {!showAll && posts.length > 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button
              onClick={() => setShowAll(true)}
              className="btn-neon btn-outline-orange text-xs"
            >
              Browse All Articles
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

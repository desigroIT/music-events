"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, PenLine, BookOpen, Clock, Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/ui/Navbar";
import FooterSection from "@/components/sections/FooterSection";
import AuthModal from "@/components/auth/AuthModal";
import { useAuthModal } from "@/hooks/useAuthModal";
import NeonInstrumentsBg from "@/components/ui/NeonInstrumentsBg";
import WriteBlogModal from "@/components/modals/WriteBlogModal";
import { getBlogPosts, BlogPost } from "@/lib/blog";

const ACCENT = "#FFD60A";

const CATEGORY_COLORS: Record<string, string> = {
  Technique: "#FF5B00",
  Gear: "#00D4FF",
  Industry: "#9D4EDD",
  Culture: "#FFD60A",
  Practice: "#FF5B00",
  Career: "#9D4EDD",
  General: "#FFD60A",
};

const ALL_CATEGORIES = ["All", "Technique", "Gear", "Industry", "Culture", "Practice", "Career", "General"];

function formatDate(ts: any): string {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function AuthModalWrapper() {
  const { isOpen, redirectTo, mode, closeModal } = useAuthModal();
  return <AuthModal isOpen={isOpen} onClose={closeModal} redirectTo={redirectTo} mode={mode || "login"} />;
}

export default function BlogPage() {
  const { userProfile } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const isCommunityMember = userProfile?.isCommunityMember === true;

  const fetchPosts = async () => {
    setLoading(true);
    const data = await getBlogPosts();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filtered = posts.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.subDescription.toLowerCase().includes(search.toLowerCase()) ||
      p.authorName.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered[0] ?? null;
  const rest = filtered.slice(1);

  return (
    <>
      <div className="scan-line" />

      <Suspense fallback={null}>
        <AuthModalWrapper />
      </Suspense>

      <Navbar />

      <main className="page-content pt-24 min-h-screen flex flex-col bg-[#050505] relative">
        <NeonInstrumentsBg variant="A" />
        <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />

        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 relative z-10">
          {/* Back button */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors font-space text-sm mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>

          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div>
                <p className="text-xs font-space uppercase tracking-widest font-bold mb-2" style={{ color: ACCENT }}>
                  Knowledge Base
                </p>
                <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-3">
                  Blog & <span style={{ color: ACCENT }}>Articles</span>
                </h1>
                <p className="font-space text-white/50 max-w-xl">
                  Deep-dives, gear reviews, career advice, and music culture — from the musicians who live it.
                </p>
              </div>

              {/* Add New Blog Post — community members only */}
              {isCommunityMember && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsModalOpen(true)}
                  className="group shrink-0 flex items-center gap-3 px-7 py-4 font-orbitron font-bold text-sm text-black rounded-full overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(255,214,10,0.4)] hover:shadow-[0_0_40px_rgba(255,214,10,0.7)]"
                  style={{ background: ACCENT }}
                >
                  <PenLine size={18} className="transition-transform group-hover:rotate-12 duration-300" />
                  Add New Blog Post
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Filters */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-4 md:p-5 mb-10 flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FFD60A]/40 font-space"
              />
            </div>

            {/* Category filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} className="text-white/40 shrink-0" />
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-space font-bold transition-all ${
                    activeCategory === cat
                      ? "text-black"
                      : "text-white/40 hover:text-white bg-white/5"
                  }`}
                  style={activeCategory === cat ? { background: ACCENT } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-10 h-10 border-2 border-[#FFD60A] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 bg-white/5 border border-white/10 rounded-2xl">
              <BookOpen size={44} className="mx-auto text-white/20 mb-4" />
              <h3 className="font-space font-bold text-xl text-white mb-2">
                {posts.length === 0 ? "No articles yet" : "No results found"}
              </h3>
              <p className="font-space text-white/40 text-sm mb-6">
                {posts.length === 0
                  ? "Be the first to publish an article for the community!"
                  : "Try a different search or category filter."}
              </p>
              {isCommunityMember && posts.length === 0 && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-space font-bold text-sm text-black transition-all"
                  style={{ background: ACCENT }}
                >
                  <PenLine size={15} />
                  Write First Article
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-10">
              {/* Featured post */}
              {featured && (
                <motion.article
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card border border-white/5 rounded-2xl overflow-hidden hover-glow-gold transition-all duration-300"
                >
                  {featured.images?.[0] && (
                    <div className="w-full h-64 md:h-80 overflow-hidden">
                      <img
                        src={featured.images[0]}
                        alt={featured.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="badge text-xs"
                        style={{
                          background: `${CATEGORY_COLORS[featured.category] ?? ACCENT}20`,
                          color: CATEGORY_COLORS[featured.category] ?? ACCENT,
                          border: `1px solid ${CATEGORY_COLORS[featured.category] ?? ACCENT}40`,
                        }}
                      >
                        {featured.category}
                      </span>
                      <span className="badge bg-[#FFD60A]/10 text-[#FFD60A] border border-[#FFD60A]/20 text-xs">
                        Featured
                      </span>
                    </div>
                    <h2 className="font-space font-bold text-2xl md:text-3xl text-white mb-3 leading-snug hover:text-[#FFD60A] transition-colors">
                      {featured.title}
                    </h2>
                    <p className="font-space text-white/50 leading-relaxed mb-6 max-w-3xl">
                      {featured.subDescription}
                    </p>

                    {/* Full description */}
                    <p className="font-space text-white/30 text-sm leading-relaxed mb-6 max-w-3xl line-clamp-4 whitespace-pre-line">
                      {featured.description}
                    </p>

                    {/* Extra images */}
                    {featured.images && featured.images.length > 1 && (
                      <div className="flex gap-3 mb-6 flex-wrap">
                        {featured.images.slice(1).map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt=""
                            className="w-24 h-24 rounded-lg object-cover border border-white/10"
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4 text-sm font-space text-white/30">
                        <span className="text-white/50 font-medium">{featured.authorName}</span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} /> {formatDate(featured.createdAt)}
                        </span>
                      </div>
                      <button
                        onClick={() => router.push(`/blog/${featured.id}`)}
                        className="px-6 py-2 rounded-full font-space font-bold text-sm text-black transition-all shadow-[0_0_15px_rgba(255,214,10,0.6)] hover:shadow-[0_0_30px_rgba(255,214,10,1)] hover:-translate-y-1"
                        style={{ background: ACCENT }}
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                </motion.article>
              )}

              {/* Rest grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {rest.map((post, i) => {
                    const c = CATEGORY_COLORS[post.category] ?? ACCENT;
                    return (
                      <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="glass-card border border-white/5 rounded-2xl overflow-hidden hover-glow-gold transition-all duration-300 flex flex-col"
                      >
                        {post.images?.[0] ? (
                          <div className="w-full h-44 overflow-hidden">
                            <img
                              src={post.images[0]}
                              alt={post.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ) : (
                          <div
                            className="w-full h-44 flex items-center justify-center"
                            style={{ background: `${c}10` }}
                          >
                            <BookOpen size={32} style={{ color: c, opacity: 0.4 }} />
                          </div>
                        )}
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span
                              className="text-[10px] font-space tracking-wider uppercase px-2 py-0.5 rounded"
                              style={{ background: `${c}15`, color: c, border: `1px solid ${c}30` }}
                            >
                              {post.category}
                            </span>
                          </div>
                          <h3 className="font-space font-bold text-base text-white mb-2 leading-snug hover:text-[#FFD60A] transition-colors line-clamp-2 flex-1">
                            {post.title}
                          </h3>
                          <p className="font-space text-xs text-white/40 leading-relaxed mb-4 line-clamp-2">
                            {post.subDescription}
                          </p>
                          <div className="flex items-center justify-between text-[10px] font-space text-white/25 mt-auto mb-3">
                            <span>{post.authorName}</span>
                            <span className="flex items-center gap-1">
                              <Clock size={9} /> {formatDate(post.createdAt)}
                            </span>
                          </div>
                          <button
                            onClick={() => router.push(`/blog/${post.id}`)}
                            className="w-full py-2 rounded-full font-space font-bold text-xs text-black transition-all shadow-[0_0_10px_rgba(255,214,10,0.4)] hover:shadow-[0_0_20px_rgba(255,214,10,0.8)]"
                            style={{ background: ACCENT }}
                          >
                            Read More
                          </button>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <FooterSection />
      </main>

      {/* Write Blog Modal */}
      <WriteBlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchPosts();
        }}
      />
    </>
  );
}

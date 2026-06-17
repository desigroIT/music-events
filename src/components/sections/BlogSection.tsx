"use client";
import { motion } from "framer-motion";
import { blogPosts } from "@/data/dummy";
import { Clock, ArrowRight, Tag } from "lucide-react";
import NeonInstrumentsBg from "@/components/ui/NeonInstrumentsBg";

export default function BlogSection() {
  const featured = blogPosts.find((p) => p.featured);
  const rest = blogPosts.filter((p) => !p.featured);

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
          <p className="font-space text-white/40 max-w-xl mx-auto text-sm md:text-base">
            Deep-dives, gear reviews, career advice, and music culture — from the musicians who live it.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured post */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 glass-card p-8 group cursor-pointer border border-white/5 hover-glow-gold relative overflow-hidden"
            >
              {/* Background gradient */}
              <div
                className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, ${featured.color}40, transparent)` }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="badge"
                    style={{ background: `${featured.color}20`, color: featured.color, border: `1px solid ${featured.color}40` }}
                  >
                    {featured.tag}
                  </span>
                  <span className="badge bg-[#FFD60A]/10 text-[#FFD60A] border border-[#FFD60A]/30">
                    {featured.category}
                  </span>
                </div>

                <h3 className="font-space font-bold text-xl md:text-2xl text-white mb-4 leading-snug group-hover:text-[#FFD60A] transition-colors duration-300">
                  {featured.title}
                </h3>

                <p className="font-space text-sm text-white/40 leading-relaxed mb-6">
                  {featured.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs font-space text-white/30">
                    <span>{featured.author}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {featured.readTime} read
                    </span>
                    <span>{featured.date}</span>
                  </div>
                  <button className="flex items-center gap-2 text-[#FFD60A] text-xs font-space group-hover:gap-3 transition-all">
                    Read More <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Side posts */}
          <div className="space-y-4">
            {rest.slice(0, 4).map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5 group cursor-pointer border border-white/5 hover-glow-gold"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-space tracking-wider uppercase px-2 py-0.5 rounded border border-white/10 text-white/40">
                    {post.category}
                  </span>
                </div>
                <h4 className="font-space font-bold text-sm text-white mb-1 leading-snug group-hover:text-[#FFD60A] transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <div className="flex items-center gap-3 text-[10px] font-space text-white/25 mt-2">
                  <span>{post.author}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={9} />
                    {post.readTime}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <button className="btn-neon btn-outline-orange text-xs">
            View All Articles
          </button>
        </motion.div>
      </div>
    </section>
  );
}

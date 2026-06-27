"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  FileText,
  Clock,
  Eye,
} from "lucide-react";
import { BlogPost, getBlogPosts, deleteBlogPost } from "@/lib/blog";
import WriteBlogModal from "@/components/modals/WriteBlogModal";

export default function BlogPanel() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");

  // Create Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Delete
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notification
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const data = await getBlogPosts();
    setPosts(data);
    setLoading(false);
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const success = await deleteBlogPost(deleteId);
    if (success) {
      showNotification("success", "Deleted successfully!");
      setPosts((prev) => prev.filter((p) => p.id !== deleteId));
    } else {
      showNotification("error", "Failed to delete.");
    }
    setIsDeleting(false);
    setDeleteId(null);
  };

  // Filtered list
  const filtered = posts.filter((p) => {
    return p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           p.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           p.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* --- Stats Row --- */}
      <div className="flex flex-wrap items-center gap-3">
        <StatCard label="Total Articles" value={posts.length} color="#FFD60A" />
      </div>

      {/* --- Notification --- */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg backdrop-blur-xl border ${
              notification.type === "success"
                ? "bg-[#00FF85]/10 border-[#00FF85]/30 text-[#00FF85]"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {notification.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-space">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Controls Bar --- */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search by title, author, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FFD60A]/50 transition-all font-space"
          />
        </div>

        {/* Refresh */}
        <button
          onClick={loadPosts}
          disabled={loading}
          className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin text-white/60" : "text-white/60"} />
        </button>

        {/* Create Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-space font-bold text-sm text-black transition-all"
          style={{
            background: "linear-gradient(135deg, #FFD60A, #FFB703)",
            boxShadow: "0 4px 20px rgba(255, 214, 10, 0.3)",
          }}
        >
          <Plus size={16} />
          Write Article
        </motion.button>
      </div>

      {/* --- Cards Grid --- */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-[#FFD60A]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-white/5 bg-white/2 rounded-2xl p-12 text-center">
          <FileText size={48} className="mx-auto mb-4 text-white/15" />
          <h3 className="font-orbitron text-lg text-white/50 mb-2">No articles found</h3>
          <p className="text-sm text-white/30 font-space">Try adjusting your filters or write a new article.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                onDelete={() => setDeleteId(post.id as string)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* --- Write Blog Modal --- */}
      <WriteBlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          loadPosts();
          setIsModalOpen(false);
          showNotification("success", "Article published successfully!");
        }}
      />

      {/* --- Delete Confirm Modal --- */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => !isDeleting && setDeleteId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-space font-bold text-white mb-2">Delete Article?</h3>
                <p className="text-sm font-space text-white/50 mb-6">
                  This action cannot be undone. The article will be permanently removed.
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setDeleteId(null)}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-space text-sm font-bold text-white transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-space text-sm font-bold text-white transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Stat Card ---
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="rounded-xl px-4 py-3 min-w-[110px] border"
      style={{
        background: `${color}10`,
        borderColor: `${color}30`,
      }}
    >
      <div className="text-xs text-white/40 font-space mb-1">{label}</div>
      <div className="text-2xl font-orbitron font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

// --- Blog Card ---
function BlogCard({ post, onDelete }: { post: BlogPost; onDelete: () => void }) {
  function formatDate(ts: any): string {
    if (!ts) return "";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      className="glass-card border border-white/5 hover:border-[#FFD60A]/30 transition-all group relative flex flex-col h-[280px] overflow-hidden"
    >
      {post.images?.[0] ? (
        <div className="h-32 w-full shrink-0 overflow-hidden relative">
          <img src={post.images[0]} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
        </div>
      ) : (
        <div className="h-20 w-full shrink-0 bg-[#FFD60A]/10 flex items-center justify-center relative">
          <FileText size={24} className="text-[#FFD60A]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
        </div>
      )}

      <div className="p-4 flex flex-col flex-1 relative z-10 -mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-space font-bold uppercase tracking-wider bg-[#FFD60A]/20 text-[#FFD60A] border border-[#FFD60A]/40">
            {post.category}
          </span>
          <button
            onClick={onDelete}
            className="p-1.5 bg-black/50 hover:bg-red-500/20 backdrop-blur-md rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={13} className="text-red-400" />
          </button>
        </div>

        <h4 className="font-space font-bold text-sm text-white mb-1 line-clamp-2 leading-snug">
          {post.title}
        </h4>
        <p className="text-xs text-white/40 mb-3 font-space line-clamp-2">
          {post.subDescription}
        </p>

        <div className="mt-auto flex items-center justify-between text-[10px] font-space text-white/30 border-t border-white/5 pt-3">
          <span>By {post.authorName}</span>
          <span className="flex items-center gap-1"><Clock size={10} /> {formatDate(post.createdAt)}</span>
        </div>
      </div>
    </motion.div>
  );
}

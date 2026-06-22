"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Edit2, Trash2, AlertCircle, CheckCircle, Loader2, RefreshCw, Briefcase, Tag, X } from "lucide-react";
import { NetworkingPost, getNetworkingPosts, deleteNetworkingPost } from "@/lib/networking";
import PostNetworkingModal from "@/components/modals/PostNetworkingModal";

export default function NetworkingPanel() {
  const [posts, setPosts] = useState<NetworkingPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<NetworkingPost | null>(null);
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const data = await getNetworkingPosts();
    setPosts(data);
    setLoading(false);
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleEdit = (post: NetworkingPost) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    
    const success = await deleteNetworkingPost(deleteId);
    if (success) {
      showNotification("success", "Post deleted successfully!");
      setPosts(posts.filter((p) => p.id !== deleteId));
    } else {
      showNotification("error", "Failed to delete post");
    }
    
    setIsDeleting(false);
    setDeleteId(null);
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.description && post.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="flex items-center gap-3 mb-8">
        <div className="glass-card border border-white/10 rounded-xl px-4 py-3 min-w-[120px]">
          <div className="text-xs text-white/40 font-space mb-1">Total Posts</div>
          <div className="text-2xl font-orbitron font-bold text-white">{posts.length}</div>
        </div>
        <div className="glass-card border border-[#00D4FF]/20 rounded-xl px-4 py-3 min-w-[120px]">
          <div className="text-xs text-white/40 font-space mb-1">Jobs</div>
          <div className="text-2xl font-orbitron font-bold text-[#00D4FF]">
            {posts.filter(p => p.type === 'job').length}
          </div>
        </div>
        <div className="glass-card border border-[#FFD60A]/20 rounded-xl px-4 py-3 min-w-[120px]">
          <div className="text-xs text-white/40 font-space mb-1">Items for Sale</div>
          <div className="text-2xl font-orbitron font-bold text-[#FFD60A]">
            {posts.filter(p => p.type === 'item').length}
          </div>
        </div>
      </div>

      {/* Notification */}
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

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search by title, location, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00D4FF]/50 focus:bg-white/10 transition-all font-space"
          />
        </div>
        <button
          onClick={loadPosts}
          disabled={loading}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-[#00D4FF]" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="glass-card border border-white/5 p-12 text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-white/20" />
          <h3 className="font-orbitron text-lg text-white/60 mb-2">No posts found</h3>
          <p className="text-sm text-white/40 font-space">Try a different search term or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card p-6 border border-white/5 hover:border-[#00D4FF]/30 transition-all group relative overflow-hidden flex flex-col"
            >
              {/* Header: Type & Actions */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {post.type === "job" ? (
                    <span className="px-3 py-1 rounded-full text-[10px] font-space font-bold bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 flex items-center gap-1.5 uppercase tracking-wider">
                      <Briefcase size={10} /> Job
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-[10px] font-space font-bold bg-[#FFD60A]/10 text-[#FFD60A] border border-[#FFD60A]/20 flex items-center gap-1.5 uppercase tracking-wider">
                      <Tag size={10} /> Item
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(post)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={14} className="text-[#00D4FF]" />
                  </button>
                  <button
                    onClick={() => setDeleteId(post.id as string)}
                    className="p-2 bg-white/5 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>

              {/* Title & Location */}
              <h4 className="font-space font-bold text-base text-white mb-2 leading-snug">
                {post.title}
              </h4>
              <p className="text-xs text-white/50 mb-4 font-space flex items-center gap-2">
                <span className="text-white/30">Location:</span> {post.location}
              </p>

              {/* Description / Extra info */}
              <div className="flex-1">
                {post.type === "job" ? (
                  <p className="text-xs text-white/35 mb-4 line-clamp-3 font-space leading-relaxed">
                    {post.description}
                  </p>
                ) : (
                  <div className="text-xl font-orbitron font-bold text-[#FFD60A] mb-4">
                    Rs. {post.price}
                  </div>
                )}
              </div>

              {/* Meta */}
              <div className="border-t border-white/5 pt-4 mt-auto">
                <div className="text-xs font-space text-white/40">
                  Contact: <span className="text-white/70">{post.contactNumber}</span>
                </div>
                {post.type === "job" && post.dueDate && (
                  <div className="text-xs font-space text-white/40 mt-1">
                    Due: <span className="text-white/70">{post.dueDate}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Modal reusing PostNetworkingModal */}
      <PostNetworkingModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingPost(null);
        }}
        postToEdit={editingPost}
        onSuccess={loadPosts}
      />

      {/* Center Screen Delete Confirmation Modal */}
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
                <h3 className="text-xl font-space font-bold text-white mb-2">Delete Post?</h3>
                <p className="text-sm font-space text-white/50 mb-6">
                  Are you sure you want to delete this networking post? This action cannot be undone.
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

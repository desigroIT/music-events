"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Tag, Calendar, Phone, Edit, Trash2, Clock } from "lucide-react";
import { NetworkingPost, deleteNetworkingPost } from "@/lib/networking";
import { useAuth } from "@/contexts/AuthContext";

interface NetworkingCardProps {
  post: NetworkingPost;
  onUpdate?: () => void;
  index?: number;
}

export default function NetworkingCard({ post, onUpdate, index = 0 }: NetworkingCardProps) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user?.uid === post.userId;
  const isJob = post.type === "job";
  const color = isJob ? "#00D4FF" : "#9D4EDD"; // Blue for Job, Purple for Item

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    setIsDeleting(true);
    try {
      if (post.id) {
        await deleteNetworkingPost(post.id);
        onUpdate?.();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    // For now, we'll just alert. A full implementation would open the modal with this data.
    alert("Edit functionality coming soon!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`glass-card p-5 group border border-white/5 flex flex-col sm:flex-row gap-4 relative overflow-hidden transition-all duration-300 ${
        isDeleting ? "opacity-50 pointer-events-none" : "hover:border-[#00D4FF]/30"
      }`}
    >
      {/* Type badge */}
      <div
        className="shrink-0 w-20 h-20 rounded-lg flex items-center justify-center font-space font-bold text-xs text-center leading-tight px-2 uppercase tracking-wider"
        style={{
          background: `${color}15`,
          border: `1px solid ${color}30`,
          color: color,
        }}
      >
        {isJob ? "Job" : "Sell Item"}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-space font-bold text-lg text-white mb-2 group-hover:text-[#00D4FF] transition-colors line-clamp-1">
            {post.title}
          </h3>
          
          {isOwner && (
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={handleEdit}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#00D4FF]/20 text-white/50 hover:text-[#00D4FF] flex items-center justify-center transition-colors"
                title="Edit Post"
              >
                <Edit size={14} />
              </button>
              <button 
                onClick={handleDelete}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-500 flex items-center justify-center transition-colors"
                title="Delete Post"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {isJob ? (
          <p className="font-space text-sm text-white/60 mb-3 line-clamp-2">
            {post.description}
          </p>
        ) : (
          <div className="font-space font-bold text-xl text-white mb-3 flex items-center gap-2">
            <span className="text-white/40 text-sm font-normal">Price:</span> 
            Rs. {post.price}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 text-xs font-space text-white/40">
          <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded">
            <MapPin size={12} className="text-[#00D4FF]" />
            {post.location}
          </span>
          <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded">
            <Phone size={12} className="text-[#00D4FF]" />
            {post.contactNumber}
          </span>
          
          {isJob && post.dueDate && (
            <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded">
              <Clock size={12} className="text-[#00D4FF]" />
              Due: {new Date(post.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { getBlogPostById, BlogPost, toggleLikeBlogPost, addComment, getComments, BlogComment } from "@/lib/blog";
import Navbar from "@/components/ui/Navbar";
import FooterSection from "@/components/sections/FooterSection";
import NeonInstrumentsBg from "@/components/ui/NeonInstrumentsBg";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModal } from "@/hooks/useAuthModal";
import { Heart, Send, MessageCircle } from "lucide-react";

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

function formatDate(ts: any): string {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { userProfile } = useAuth();
  const { openModal } = useAuthModal();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const resolvedParams = use(params);

  const fetchPostAndComments = async () => {
    if (resolvedParams.id) {
      const [postData, commentsData] = await Promise.all([
        getBlogPostById(resolvedParams.id),
        getComments(resolvedParams.id)
      ]);
      setPost(postData);
      setComments(commentsData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPostAndComments();
  }, [resolvedParams.id]);

  const isLiked = userProfile && post?.likes?.includes(userProfile.uid);
  const likesCount = post?.likes?.length || 0;

  const handleLike = async () => {
    if (!userProfile) {
      openModal(`/blog/${resolvedParams.id}`);
      return;
    }
    if (!post || !post.id) return;

    // Optimistic UI update
    const wasLiked = !!isLiked;
    const newLikes = wasLiked
      ? (post.likes || []).filter(id => id !== userProfile.uid)
      : [...(post.likes || []), userProfile.uid];

    setPost({ ...post, likes: newLikes });

    // Backend update
    await toggleLikeBlogPost(post.id, userProfile.uid, wasLiked);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) {
      openModal(`/blog/${resolvedParams.id}`);
      return;
    }
    if (!newComment.trim() || !post || !post.id) return;

    setIsSubmitting(true);
    const commentData = {
      userId: userProfile.uid,
      userName: userProfile.displayName || "Anonymous",
      content: newComment.trim(),
    };

    const newCommentId = await addComment(post.id, commentData);
    if (newCommentId) {
      // Optimistic update
      setComments([
        { ...commentData, id: newCommentId, createdAt: new Date() },
        ...comments
      ]);
      setNewComment("");
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-10 h-10 border-2 border-[#FFD60A] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white">
        <h1 className="text-2xl font-space font-bold mb-4">Article Not Found</h1>
        <button
          onClick={() => router.push("/blog")}
          className="flex items-center gap-2 text-[#FFD60A] hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Blog
        </button>
      </main>
    );
  }

  const categoryColor = CATEGORY_COLORS[post.category] || ACCENT;

  return (
    <>
      <div className="scan-line" />
      <Navbar />

      <main className="page-content pt-24 min-h-screen flex flex-col bg-[#050505] relative">
        <NeonInstrumentsBg variant="A" />
        <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />

        <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 relative z-10">
          {/* Back button with neon styling */}
          <button
            onClick={() => router.push("/blog")}
            className="flex items-center gap-2 mb-10 px-5 py-2.5 rounded-full font-space font-bold text-sm transition-all text-black shadow-[0_0_15px_rgba(255,214,10,0.5)] hover:shadow-[0_0_30px_rgba(255,214,10,0.9)] hover:-translate-x-1"
            style={{ background: ACCENT }}
          >
            <ArrowLeft size={16} />
            Back to Articles
          </button>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 md:p-10 rounded-3xl border border-white/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <span
                className="badge text-sm px-3 py-1"
                style={{
                  background: `${categoryColor}20`,
                  color: categoryColor,
                  border: `1px solid ${categoryColor}40`,
                }}
              >
                {post.category}
              </span>
            </div>

            <h1 className="font-orbitron font-bold text-3xl md:text-5xl text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm font-space text-white/50 mb-10 pb-10 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 font-bold uppercase">
                  {post.authorName.charAt(0)}
                </div>
                <span className="font-medium text-white/80">{post.authorName}</span>
              </div>
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> {formatDate(post.createdAt)}
              </span>
            </div>

            {post.images?.[0] && (
              <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-10">
                <img
                  src={post.images[0]}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="font-space text-white/80 leading-relaxed space-y-6 whitespace-pre-line text-lg">
              <p className="font-bold text-xl text-white/90 mb-8 border-l-4 pl-4" style={{ borderColor: categoryColor }}>
                {post.subDescription}
              </p>
              {post.description}
            </div>

            {post.images && post.images.length > 1 && (
              <div className="mt-12 pt-10 border-t border-white/10">
                <h3 className="font-space font-bold text-xl text-white mb-6">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {post.images.slice(1).map((img, i) => (
                    <div key={i} className="rounded-xl overflow-hidden aspect-video">
                      <img
                        src={img}
                        alt="Gallery"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Likes & Comments Section */}
            <div className="mt-16 pt-10 border-t border-white/10">
              {/* Like Button */}
              <div className="flex items-center gap-4 mb-10">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-space font-bold text-sm transition-all ${
                    isLiked
                      ? "bg-[#FF5B00] text-black shadow-[0_0_15px_rgba(255,91,0,0.5)] hover:shadow-[0_0_30px_rgba(255,91,0,0.8)]"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Heart size={18} className={isLiked ? "fill-black" : ""} />
                  {isLiked ? "Liked" : "Like Article"}
                </button>
                <span className="font-space text-white/50 text-sm">
                  {likesCount} {likesCount === 1 ? "like" : "likes"}
                </span>
              </div>

              {/* Comments */}
              <div className="space-y-8">
                <h3 className="font-space font-bold text-2xl text-white flex items-center gap-3">
                  <MessageCircle className="text-[#FFD60A]" />
                  Comments ({comments.length})
                </h3>

                {/* Comment Input */}
                <form onSubmit={handleCommentSubmit} className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={userProfile ? "Add a comment..." : "Login to add a comment..."}
                      disabled={isSubmitting}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FFD60A]/40 font-space transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isSubmitting}
                    className="shrink-0 flex items-center justify-center w-14 h-14 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: newComment.trim() ? ACCENT : "rgba(255,255,255,0.1)" }}
                  >
                    <Send size={20} className={newComment.trim() ? "text-black" : "text-white/30"} />
                  </button>
                </form>

                {/* Comment List */}
                <div className="space-y-6 mt-8">
                  {comments.map((comment) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={comment.id}
                      className="bg-white/5 p-5 rounded-2xl border border-white/5"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 font-bold uppercase text-xs">
                          {comment.userName.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-space font-bold text-sm text-white/90">
                            {comment.userName}
                          </span>
                          <span className="font-space text-[10px] text-white/40">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="font-space text-white/70 text-sm leading-relaxed pl-11">
                        {comment.content}
                      </p>
                    </motion.div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-center font-space text-white/40 py-8">
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.article>
        </div>

        <FooterSection />
      </main>
    </>
  );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Loader2, ImagePlus, Trash2, CheckCircle, FileText, AlignLeft, Tag
} from "lucide-react";
import { createBlogPost, uploadImageToCloudinary } from "@/lib/blog";
import { useAuth } from "@/contexts/AuthContext";

interface WriteBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ACCENT = "#FFD60A";
const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FFD60A]/60 transition-all font-space";
const labelCls = "block text-xs font-space text-white/50 uppercase tracking-wider mb-1.5";

const CATEGORIES = ["Technique", "Gear", "Industry", "Culture", "Practice", "Career", "General"];

export default function WriteBlogModal({ isOpen, onClose, onSuccess }: WriteBlogModalProps) {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    subDescription: "",
    description: "",
    category: "General",
  });

  useEffect(() => {
    if (isOpen) {
      setForm({ title: "", subDescription: "", description: "", category: "General" });
      setError(null);
      setSuccess(false);
      setImageFiles([]);
      setImagePreviews([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remaining = 5 - imageFiles.length;
    const selected = files.slice(0, remaining);

    setImageFiles((prev) => [...prev, ...selected]);
    selected.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!user || !userProfile) return;

    if (!form.title.trim() || !form.subDescription.trim() || !form.description.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Upload images to Cloudinary
      let uploadedUrls: string[] = [];
      if (imageFiles.length > 0) {
        setUploadingImages(true);
        const uploads = await Promise.all(imageFiles.map((f) => uploadImageToCloudinary(f)));
        uploadedUrls = uploads.filter((u): u is string => u !== null);
        setUploadingImages(false);
      }

      const id = await createBlogPost({
        title: form.title.trim(),
        subDescription: form.subDescription.trim(),
        description: form.description.trim(),
        images: uploadedUrls,
        authorName: userProfile.displayName || user.email || "Anonymous",
        authorId: user.uid,
        category: form.category,
      });

      if (id) {
        setSuccess(true);
        onSuccess?.();
      } else {
        throw new Error("Failed to publish article. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setUploadingImages(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!loading ? onClose : undefined}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
          style={{ boxShadow: `0 0 80px ${ACCENT}18, 0 30px 60px rgba(0,0,0,0.7)` }}
        >
          {/* Top accent bar */}
          <div
            className="h-0.5 w-full shrink-0"
            style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }}
          />

          {/* SUCCESS STATE */}
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center px-8 py-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ background: `${ACCENT}20`, border: `2px solid ${ACCENT}50` }}
              >
                <CheckCircle size={40} style={{ color: ACCENT }} />
              </motion.div>
              <h3 className="text-2xl font-orbitron font-bold text-white mb-3">Article Published!</h3>
              <p className="text-sm font-space text-white/50 mb-8 leading-relaxed max-w-xs">
                Your article has been published to the Blog & Articles section.
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-xl font-space font-bold text-sm text-black transition-all hover:scale-105"
                style={{ background: ACCENT }}
              >
                Done
              </button>
            </motion.div>
          ) : (
            <>
              {/* HEADER */}
              <div className="px-6 pt-6 pb-4 border-b border-white/5 shrink-0">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-space uppercase tracking-widest font-bold" style={{ color: ACCENT }}>
                      Community
                    </p>
                    <h2 className="text-lg font-orbitron font-bold text-white">Write New Article</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* BODY */}
              <div className="overflow-y-auto flex-1 px-6 py-5">
                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl font-space">
                    {error}
                  </div>
                )}

                <form id="blog-form" onSubmit={handleSubmit} className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className={labelCls}>
                      <span className="flex items-center gap-1.5">
                        <FileText size={10} />Post Title <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={set("title")}
                      className={inputCls}
                      placeholder="Enter your article title..."
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className={labelCls}>
                      <span className="flex items-center gap-1.5">
                        <Tag size={10} />Category
                      </span>
                    </label>
                    <select
                      value={form.category}
                      onChange={set("category")}
                      className={inputCls + " appearance-none cursor-pointer"}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c} className="bg-[#111]">{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sub Description */}
                  <div>
                    <label className={labelCls}>
                      <span className="flex items-center gap-1.5">
                        <AlignLeft size={10} />Sub Description <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.subDescription}
                      onChange={set("subDescription")}
                      className={inputCls}
                      placeholder="A short summary for your article..."
                    />
                  </div>

                  {/* Images */}
                  <div>
                    <label className={labelCls}>
                      <span className="flex items-center gap-1.5">
                        <ImagePlus size={10} />Images (up to 5)
                      </span>
                    </label>

                    {imagePreviews.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-3">
                        {imagePreviews.map((src, i) => (
                          <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10 group">
                            <img src={src} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={16} className="text-red-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {imageFiles.length < 5 && (
                      <>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageSelect}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-4 border-2 border-dashed border-white/15 rounded-xl text-white/40 hover:text-[#FFD60A] hover:border-[#FFD60A]/40 transition-all flex items-center justify-center gap-2 font-space text-sm"
                        >
                          <ImagePlus size={18} />
                          Click to add images ({imageFiles.length}/5)
                        </button>
                      </>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className={labelCls}>
                      <span className="flex items-center gap-1.5">
                        <AlignLeft size={10} />Article Content <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <textarea
                      required
                      rows={8}
                      value={form.description}
                      onChange={set("description")}
                      className={inputCls + " resize-none leading-relaxed"}
                      placeholder="Write your article content here..."
                    />
                  </div>
                </form>
              </div>

              {/* FOOTER */}
              <div className="px-6 py-4 border-t border-white/5 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl font-space text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  form="blog-form"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl font-space font-bold text-sm text-black flex items-center gap-2 disabled:opacity-50 transition-all"
                  style={{ background: ACCENT }}
                >
                  {loading && <Loader2 size={15} className="animate-spin" />}
                  {uploadingImages ? "Uploading images..." : loading ? "Publishing..." : "Publish Article"}
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

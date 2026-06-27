import { useState, useEffect } from "react";
import { X, Save, Type, PaintBucket, Hash, Info, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AcademyFeature } from "@/lib/academy";

interface AcademyFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<AcademyFeature, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  initialData?: AcademyFeature | null;
}

export default function AcademyFeatureModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AcademyFeatureModalProps) {
  const [icon, setIcon] = useState("🎬");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#00D4FF");
  const [stats, setStats] = useState("");
  const [order, setOrder] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setIcon(initialData.icon || "🎬");
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setColor(initialData.color || "#00D4FF");
      setStats(initialData.stats || "");
      setOrder(initialData.order || 0);
    } else {
      // Reset form
      setIcon("🎬");
      setTitle("");
      setDescription("");
      setColor("#00D4FF");
      setStats("");
      setOrder(0);
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !stats) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    await onSave({
      icon,
      title,
      description,
      color,
      stats,
      order,
    });
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl glass-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
            <h2 className="font-orbitron font-bold text-xl text-white">
              {initialData ? "Edit Academy Feature" : "Create Academy Feature"}
            </h2>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar">
            <form id="featureForm" onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-xs font-space text-white/50 uppercase tracking-wider flex items-center gap-2">
                    <Type size={14} /> Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Video Library"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-space text-sm focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                    required
                  />
                </div>

                {/* Icon Emoji */}
                <div className="space-y-2">
                  <label className="text-xs font-space text-white/50 uppercase tracking-wider flex items-center gap-2">
                    <PaintBucket size={14} /> Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="e.g. 🎬"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-space text-sm focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-space text-white/50 uppercase tracking-wider flex items-center gap-2">
                  <FileText size={14} /> Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Access 2,000+ HD lessons..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-space text-sm focus:outline-none focus:border-[#00D4FF]/50 transition-colors min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Stats */}
                <div className="space-y-2">
                  <label className="text-xs font-space text-white/50 uppercase tracking-wider flex items-center gap-2">
                    <Info size={14} /> Stats Badge
                  </label>
                  <input
                    type="text"
                    value={stats}
                    onChange={(e) => setStats(e.target.value)}
                    placeholder="e.g. 2,000+ videos"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-space text-sm focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                    required
                  />
                </div>

                {/* Order */}
                <div className="space-y-2">
                  <label className="text-xs font-space text-white/50 uppercase tracking-wider flex items-center gap-2">
                    <Hash size={14} /> Order
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-space text-sm focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                  />
                </div>
              </div>

              {/* Color Picker */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                <label className="text-xs font-space text-white/50 uppercase tracking-wider flex items-center gap-2">
                  <PaintBucket size={14} /> Theme Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    "#00D4FF", // Blue
                    "#FF5B00", // Orange
                    "#9D4EDD", // Purple
                    "#FFD60A", // Yellow
                    "#00FF85", // Green
                    "#FF003C", // Red
                  ].map((presetColor) => (
                    <button
                      key={presetColor}
                      type="button"
                      onClick={() => setColor(presetColor)}
                      className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${
                        color === presetColor ? "ring-2 ring-white scale-110" : "opacity-50 hover:opacity-100 hover:scale-105"
                      }`}
                      style={{ backgroundColor: presetColor }}
                    />
                  ))}
                  <div className="flex items-center gap-2 ml-2">
                    <span className="text-xs text-white/30 font-space">Custom:</span>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                  </div>
                </div>
              </div>

            </form>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/5 bg-black/40 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg font-space text-xs text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="featureForm"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-space text-xs font-bold rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Save size={16} />
              {isSubmitting ? "Saving..." : "Save Feature"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

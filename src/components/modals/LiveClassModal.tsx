import { useState, useEffect } from "react";
import { X, Save, Type, Calendar, Clock, Link, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LiveClass } from "@/lib/academy";

interface LiveClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<LiveClass, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  initialData?: LiveClass | null;
}

export default function LiveClassModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: LiveClassModalProps) {
  const [className, setClassName] = useState("");
  const [grade, setGrade] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [meetLink, setMeetLink] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setClassName(initialData.className || "");
      setGrade(initialData.grade || "");
      setDate(initialData.date || "");
      setTime(initialData.time || "");
      setDescription(initialData.description || "");
      setMeetLink(initialData.meetLink || "");
    } else {
      // Reset form
      setClassName("");
      setGrade("");
      setDate("");
      setTime("");
      setDescription("");
      setMeetLink("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className || !date || !time || !meetLink) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        className,
        grade: grade || undefined,
        date,
        time,
        description,
        meetLink,
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error saving live class");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg glass-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
            <h2 className="font-orbitron font-bold text-xl text-white">
              {initialData ? "Edit Live Class" : "Add Live Class"}
            </h2>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <form id="liveClassForm" onSubmit={handleSubmit} className="space-y-5">
              
              {/* Class Name */}
              <div className="space-y-2">
                <label className="text-xs font-space text-white/50 uppercase tracking-wider flex items-center gap-2">
                  <Type size={14} /> Class Name *
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. Masterclass: Advanced Drum Fills"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-space text-sm focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                  required
                />
              </div>

              {/* Grade / Level (Optional) */}
              <div className="space-y-2">
                <label className="text-xs font-space text-white/50 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen size={14} /> Grade / level (Optional)
                </label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="e.g. Grade 3 / Intermediate"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-space text-sm focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-space text-white/50 uppercase tracking-wider flex items-center gap-2">
                    <Calendar size={14} /> Date *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-space text-sm focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-space text-white/50 uppercase tracking-wider flex items-center gap-2">
                    <Clock size={14} /> Time *
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 10:00 AM (IST)"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-space text-sm focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-space text-white/50 uppercase tracking-wider flex items-center gap-2">
                  <Type size={14} /> Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell students what they will learn in this session..."
                  rows={4}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-space text-sm focus:outline-none focus:border-[#00D4FF]/50 transition-colors resize-none"
                />
              </div>

              {/* Meet / Zoom Link */}
              <div className="space-y-2">
                <label className="text-xs font-space text-white/50 uppercase tracking-wider flex items-center gap-2">
                  <Link size={14} /> Zoom or Google Meet Link *
                </label>
                <input
                  type="url"
                  value={meetLink}
                  onChange={(e) => setMeetLink(e.target.value)}
                  placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-space text-sm focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                  required
                />
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
              form="liveClassForm"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-space text-xs font-bold rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Save size={16} />
              {isSubmitting ? "Saving..." : "Save Class"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

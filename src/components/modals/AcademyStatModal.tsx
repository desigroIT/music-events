import { useState, useEffect } from "react";
import { X, Save, Type, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AcademyStat } from "@/lib/academy";

interface AcademyStatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<AcademyStat, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  initialData?: AcademyStat | null;
}

export default function AcademyStatModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AcademyStatModalProps) {
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");
  const [order, setOrder] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setValue(initialData.value || "");
      setLabel(initialData.label || "");
      setOrder(initialData.order || 0);
    } else {
      // Reset form
      setValue("");
      setLabel("");
      setOrder(0);
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value || !label) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    await onSave({
      value,
      label,
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
          className="relative w-full max-w-sm glass-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
            <h2 className="font-orbitron font-bold text-xl text-white">
              {initialData ? "Edit Stat" : "Add Stat"}
            </h2>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <form id="statForm" onSubmit={handleSubmit} className="space-y-5">
              
              {/* Value */}
              <div className="space-y-2">
                <label className="text-xs font-space text-white/50 uppercase tracking-wider flex items-center gap-2">
                  <Type size={14} /> Big Value
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g. 50,000+"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-space text-sm focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                  required
                />
              </div>

              {/* Label */}
              <div className="space-y-2">
                <label className="text-xs font-space text-white/50 uppercase tracking-wider flex items-center gap-2">
                  <Type size={14} /> Label
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Students Enrolled"
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
              form="statForm"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-space text-xs font-bold rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Save size={16} />
              {isSubmitting ? "Saving..." : "Save Stat"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Edit2, Save, X } from "lucide-react";

interface EditableSectionHeaderProps {
  sectionLabel: string;
  mainTitle: string;
  subtitle: string;
  onSave: (data: { sectionLabel: string; mainTitle: string; subtitle: string }) => Promise<void>;
}

export default function EditableSectionHeader({
  sectionLabel: initialLabel,
  mainTitle: initialTitle,
  subtitle: initialSubtitle,
  onSave,
}: EditableSectionHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sectionLabel, setSectionLabel] = useState(initialLabel);
  const [mainTitle, setMainTitle] = useState(initialTitle);
  const [subtitle, setSubtitle] = useState(initialSubtitle);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ sectionLabel, mainTitle, subtitle });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving header:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setSectionLabel(initialLabel);
    setMainTitle(initialTitle);
    setSubtitle(initialSubtitle);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 border border-white/5 group relative"
      >
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          title="Edit section header"
        >
          <Edit2 size={16} className="text-[#00D4FF]" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-px bg-[#FF5B00]" />
          <span className="text-[10px] font-space text-[#FF5B00] uppercase tracking-widest">
            {sectionLabel}
          </span>
          <span className="w-8 h-px bg-[#FF5B00]" />
        </div>
        <h3 className="text-3xl font-orbitron font-bold text-white mb-2">
          Drum <span className="text-[#FF5B00]">Courses</span>
        </h3>
        <p className="text-sm text-white/40 font-space max-w-2xl">
          {subtitle}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 border border-[#00D4FF]/30 bg-[#00D4FF]/5"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-space text-white/60 mb-2 uppercase tracking-wider">
            Section Label
          </label>
          <input
            type="text"
            value={sectionLabel}
            onChange={(e) => setSectionLabel(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 focus:bg-white/10 transition-all font-space"
            placeholder="e.g., Master Your Rhythm"
          />
        </div>

        <div>
          <label className="block text-xs font-space text-white/60 mb-2 uppercase tracking-wider">
            Main Title
          </label>
          <input
            type="text"
            value={mainTitle}
            onChange={(e) => setMainTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 focus:bg-white/10 transition-all font-space"
            placeholder="e.g., Drum Courses"
          />
        </div>

        <div>
          <label className="block text-xs font-space text-white/60 mb-2 uppercase tracking-wider">
            Subtitle
          </label>
          <textarea
            rows={2}
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 focus:bg-white/10 transition-all font-space resize-none"
            placeholder="e.g., From tabla foundations to metal blast beats..."
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-gradient-to-r from-[#00D4FF] to-[#0099CC] rounded-lg font-space text-xs font-medium text-black hover:shadow-lg hover:shadow-[#00D4FF]/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={14} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleCancel}
            disabled={saving}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg font-space text-xs transition-colors disabled:opacity-50"
          >
            <X size={14} className="inline mr-1" />
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Calendar, Clock, Users, MapPin, DollarSign, Tag, Zap } from "lucide-react";
import { createEvent, updateEvent, AppEvent } from "@/lib/events";

type ModalMode = "event" | "workshop";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode: ModalMode;
  eventToEdit?: AppEvent | null;
}

const EVENT_TYPES = ["Masterclass", "Concert", "Jam Session", "Live Show", "Open Mic"];
const WORKSHOP_TYPES = ["Workshop", "Bootcamp", "Tutorial", "Mentorship Session", "Studio Session"];

const MODES = ["Live", "Online", "In-Person", "Hybrid"];
const COLORS = ["#FF5B00", "#00D4FF", "#9D4EDD", "#FFD60A", "#00FF85", "#FF3366"];
const TAGS = ["Live", "Workshop", "In-Person", "Free", "Business", "Online", "Featured"];

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00D4FF]/60 focus:bg-white/8 transition-all font-space [color-scheme:dark]";
const labelCls = "block text-xs font-space text-white/50 uppercase tracking-wider mb-1.5";

export default function EventModal({ isOpen, onClose, onSuccess, mode, eventToEdit }: EventModalProps) {
  const isEdit = !!eventToEdit;
  const typeOptions = mode === "event" ? EVENT_TYPES : WORKSHOP_TYPES;
  const accentColor = mode === "event" ? "#FF5B00" : "#00D4FF";
  const modeLabel = mode === "event" ? "Event" : "Workshop";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    type: typeOptions[0],
    title: "",
    host: "",
    date: "",
    time: "",
    mode: "Live",
    price: "",
    spots: "",
    spotsLeft: "",
    color: accentColor,
    tag: "Live",
  });

  useEffect(() => {
    if (isOpen) {
      if (eventToEdit) {
        setForm({
          type: eventToEdit.type || typeOptions[0],
          title: eventToEdit.title || "",
          host: eventToEdit.host || "",
          date: eventToEdit.date || "",
          time: eventToEdit.time || "",
          mode: eventToEdit.mode || "Live",
          price: eventToEdit.price || "",
          spots: String(eventToEdit.spots || ""),
          spotsLeft: String(eventToEdit.spotsLeft || ""),
          color: eventToEdit.color || accentColor,
          tag: eventToEdit.tag || "Live",
        });
      } else {
        setForm({
          type: typeOptions[0],
          title: "",
          host: "",
          date: "",
          time: "",
          mode: "Live",
          price: "",
          spots: "",
          spotsLeft: "",
          color: accentColor,
          tag: mode === "event" ? "Live" : "Workshop",
        });
      }
      setError(null);
    }
  }, [isOpen, eventToEdit]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.host || !form.date || !form.time) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: Omit<AppEvent, "id" | "createdAt" | "updatedAt"> = {
        type: form.type,
        title: form.title,
        host: form.host,
        date: form.date,
        time: form.time,
        mode: form.mode,
        price: form.price || "Free",
        spots: Number(form.spots) || 0,
        spotsLeft: Number(form.spotsLeft) || 0,
        color: form.color,
        tag: form.tag,
      };

      let success = false;
      if (isEdit && eventToEdit?.id) {
        success = await updateEvent(eventToEdit.id, payload);
      } else {
        const id = await createEvent(payload);
        success = !!id;
      }

      if (success) {
        onSuccess?.();
        onClose();
      } else {
        throw new Error(`Failed to ${isEdit ? "update" : "create"} ${modeLabel}.`);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
          style={{ boxShadow: `0 0 60px ${accentColor}15, 0 25px 50px rgba(0,0,0,0.6)` }}
        >
          {/* Top accent line */}
          <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 shrink-0">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}40` }}
              >
                {mode === "event" ? <Zap size={18} style={{ color: accentColor }} /> : <Tag size={18} style={{ color: accentColor }} />}
              </div>
              <div>
                <h2 className="text-lg font-orbitron font-bold text-white">
                  {isEdit ? `Edit ${modeLabel}` : `Create ${modeLabel}`}
                </h2>
                <p className="text-xs text-white/40 font-space">Fill in the details below</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="overflow-y-auto flex-1 px-6 py-6 space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg font-space">
                {error}
              </div>
            )}

            <form id="event-form" onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1: Type + Tag */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>{modeLabel} Type <span className="text-red-500">*</span></label>
                  <select value={form.type} onChange={set("type")} className={inputCls + " bg-[#111] appearance-none"}>
                    {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Tag / Badge</label>
                  <select value={form.tag} onChange={set("tag")} className={inputCls + " bg-[#111] appearance-none"}>
                    {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className={labelCls}>
                  <span className="flex items-center gap-1.5"><Zap size={11} />Title <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={set("title")}
                  className={inputCls}
                  placeholder={mode === "event" ? "e.g. Studio Musicians Live — Chicago" : "e.g. Advanced Pocket Playing Masterclass"}
                />
              </div>

              {/* Host */}
              <div>
                <label className={labelCls}>Host / Instructor <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={form.host}
                  onChange={set("host")}
                  className={inputCls}
                  placeholder="e.g. Marcus Webb"
                />
              </div>

              {/* Row: Date + Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>
                    <span className="flex items-center gap-1.5"><Calendar size={11} />Date <span className="text-red-500">*</span></span>
                  </label>
                  <input type="date" required value={form.date} onChange={set("date")} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>
                    <span className="flex items-center gap-1.5"><Clock size={11} />Time <span className="text-red-500">*</span></span>
                  </label>
                  <input type="time" required value={form.time} onChange={set("time")} className={inputCls} />
                </div>
              </div>

              {/* Row: Mode + Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>
                    <span className="flex items-center gap-1.5"><MapPin size={11} />Mode</span>
                  </label>
                  <select value={form.mode} onChange={set("mode")} className={inputCls + " bg-[#111] appearance-none"}>
                    {MODES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>
                    <span className="flex items-center gap-1.5"><DollarSign size={11} />Price</span>
                  </label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={set("price")}
                    className={inputCls}
                    placeholder="e.g. $25 or Free"
                  />
                </div>
              </div>

              {/* Row: Total Spots + Spots Left */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>
                    <span className="flex items-center gap-1.5"><Users size={11} />Total Spots</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.spots}
                    onChange={set("spots")}
                    className={inputCls}
                    placeholder="e.g. 100"
                  />
                </div>
                <div>
                  <label className={labelCls}>Spots Left</label>
                  <input
                    type="number"
                    min="0"
                    value={form.spotsLeft}
                    onChange={set("spotsLeft")}
                    className={inputCls}
                    placeholder="e.g. 42"
                  />
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className={labelCls}>Accent Color</label>
                <div className="flex items-center gap-3 flex-wrap">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, color: c }))}
                      className="w-8 h-8 rounded-full border-2 transition-all hover:scale-110"
                      style={{
                        background: c,
                        borderColor: form.color === c ? "white" : "transparent",
                        boxShadow: form.color === c ? `0 0 10px ${c}` : "none",
                      }}
                    />
                  ))}
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                    className="w-8 h-8 rounded-full border border-white/20 cursor-pointer overflow-hidden bg-transparent"
                    title="Custom color"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/5 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg font-space text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="event-form"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg font-space font-bold text-sm text-black flex items-center gap-2 disabled:opacity-50 transition-all hover:scale-105"
              style={{ background: accentColor }}
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {isEdit ? "Save Changes" : `Publish ${modeLabel}`}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Users,
  MessageSquare,
  CheckCircle,
  Calendar,
  Clock,
} from "lucide-react";
import { AppEvent, createRegistration } from "@/lib/events";

interface RegisterEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: AppEvent | null;
}

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none transition-all font-space";
const labelCls = "block text-xs font-space text-white/50 uppercase tracking-wider mb-1.5";

export default function RegisterEventModal({ isOpen, onClose, event }: RegisterEventModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    participants: "1",
    message: "",
  });

  useEffect(() => {
    if (isOpen) {
      setForm({ name: "", email: "", phone: "", address: "", participants: "1", message: "" });
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen || !event) return null;

  const accentColor = event.color || "#FF5B00";
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!event.id) return;

    if (!form.name || !form.email || !form.phone || !form.address) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const id = await createRegistration(event.id, {
        eventId: event.id,
        eventTitle: event.title,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        participants: Number(form.participants) || 1,
        message: form.message.trim() || undefined,
      });

      if (id) {
        setSuccess(true);
      } else {
        throw new Error("Registration failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
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
          className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
          style={{ boxShadow: `0 0 80px ${accentColor}18, 0 30px 60px rgba(0,0,0,0.7)` }}
        >
          {/* Top accent */}
          <div
            className="h-0.5 w-full shrink-0"
            style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
          />

          {/* Success State */}
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center px-8 py-14"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ background: `${accentColor}20`, border: `2px solid ${accentColor}50` }}
              >
                <CheckCircle size={40} style={{ color: accentColor }} />
              </motion.div>
              <h3 className="text-2xl font-orbitron font-bold text-white mb-3">You're Registered!</h3>
              <p className="text-sm font-space text-white/50 mb-2 leading-relaxed">
                Successfully registered for <span className="text-white font-bold">{event.title}</span>.
              </p>
              <p className="text-xs text-white/30 font-space mb-8">
                Check your email for confirmation details.
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-xl font-space font-bold text-sm text-black transition-all hover:scale-105"
                style={{ background: accentColor }}
              >
                Done
              </button>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-white/5 shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p
                      className="text-[10px] font-space uppercase tracking-widest mb-1 font-bold"
                      style={{ color: accentColor }}
                    >
                      {event.type}
                    </p>
                    <h2 className="text-lg font-orbitron font-bold text-white leading-tight mb-2">
                      {event.title}
                    </h2>
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
                      <span className="flex items-center gap-1.5 text-white/40 text-xs font-space">
                        <Calendar size={11} /> {event.date}
                      </span>
                      <span className="flex items-center gap-1.5 text-white/40 text-xs font-space">
                        <Clock size={11} /> {event.time}
                      </span>
                      <span className="flex items-center gap-1.5 text-white/40 text-xs font-space">
                        <MapPin size={11} /> {event.mode}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="overflow-y-auto flex-1 px-6 py-5">
                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl font-space">
                    {error}
                  </div>
                )}

                <form id="register-form" onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className={labelCls}>
                      <span className="flex items-center gap-1.5">
                        <User size={10} />Full Name <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={set("name")}
                      className={inputCls}
                      style={{ "--tw-ring-color": accentColor } as any}
                      onFocus={(e) => (e.target.style.borderColor = `${accentColor}60`)}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                      placeholder="Your full name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className={labelCls}>
                      <span className="flex items-center gap-1.5">
                        <Mail size={10} />Email Address <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={set("email")}
                      className={inputCls}
                      onFocus={(e) => (e.target.style.borderColor = `${accentColor}60`)}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                      placeholder="you@example.com"
                    />
                  </div>

                  {/* Phone + Participants row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>
                        <span className="flex items-center gap-1.5">
                          <Phone size={10} />Phone <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={set("phone")}
                        className={inputCls}
                        onFocus={(e) => (e.target.style.borderColor = `${accentColor}60`)}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                        placeholder="07X XXX XXXX"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>
                        <span className="flex items-center gap-1.5">
                          <Users size={10} />No. of Participants <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        required
                        value={form.participants}
                        onChange={set("participants")}
                        className={inputCls}
                        onFocus={(e) => (e.target.style.borderColor = `${accentColor}60`)}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className={labelCls}>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={10} />Address <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.address}
                      onChange={set("address")}
                      className={inputCls}
                      onFocus={(e) => (e.target.style.borderColor = `${accentColor}60`)}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                      placeholder="Your city / full address"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className={labelCls}>
                      <span className="flex items-center gap-1.5">
                        <MessageSquare size={10} />Message / Special Requests
                      </span>
                    </label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={set("message")}
                      className={inputCls + " resize-none"}
                      onFocus={(e) => (e.target.style.borderColor = `${accentColor}60`)}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                      placeholder="Any questions or special requirements..."
                    />
                  </div>
                </form>
              </div>

              {/* Footer */}
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
                  form="register-form"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl font-space font-bold text-sm text-black flex items-center gap-2 disabled:opacity-50 transition-all"
                  style={{ background: accentColor }}
                >
                  {loading && <Loader2 size={15} className="animate-spin" />}
                  {loading ? "Registering..." : "Confirm Registration"}
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

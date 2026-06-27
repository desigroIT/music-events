"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  Plus,
  Trash2,
  Check,
  AlignLeft,
  DollarSign,
  Tag,
  Palette,
  AlertCircle
} from "lucide-react";
import { MembershipPlan, MembershipFeature, createMembershipPlan, updateMembershipPlan } from "@/lib/membership";

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  planToEdit: MembershipPlan | null;
}

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FFD60A]/50 transition-all font-space";
const labelCls = "block text-xs font-space text-white/50 uppercase tracking-wider mb-1.5";

export default function MembershipModal({
  isOpen,
  onClose,
  onSuccess,
  planToEdit,
}: MembershipModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tier, setTier] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [period, setPeriod] = useState("month");
  const [color, setColor] = useState("#FFD60A");
  const [description, setDescription] = useState("");
  const [cta, setCta] = useState("");
  const [popular, setPopular] = useState(false);
  const [order, setOrder] = useState<number>(0);
  const [features, setFeatures] = useState<MembershipFeature[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (planToEdit) {
        setTier(planToEdit.tier || "");
        setPrice(planToEdit.price || 0);
        setPeriod(planToEdit.period || "month");
        setColor(planToEdit.color || "#FFD60A");
        setDescription(planToEdit.description || "");
        setCta(planToEdit.cta || "");
        setPopular(planToEdit.popular || false);
        setOrder(planToEdit.order || 0);
        setFeatures(planToEdit.features || []);
      } else {
        setTier("");
        setPrice("");
        setPeriod("month");
        setColor("#FFD60A");
        setDescription("");
        setCta("Get Started");
        setPopular(false);
        setOrder(0);
        setFeatures([
          { label: "Community forum access", included: true },
          { label: "HD video quality", included: false }
        ]);
      }
      setError(null);
    }
  }, [isOpen, planToEdit]);

  if (!isOpen) return null;

  const handleAddFeature = () => {
    setFeatures([...features, { label: "", included: true }]);
  };

  const handleFeatureChange = (index: number, key: keyof MembershipFeature, value: any) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [key]: value };
    setFeatures(updated);
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tier || price === "" || !description || !cta) {
      setError("Please fill in all required fields.");
      return;
    }

    if (features.some(f => !f.label.trim())) {
      setError("Please fill in all feature labels or remove empty ones.");
      return;
    }

    setLoading(true);
    setError(null);

    const planData: Omit<MembershipPlan, "id" | "createdAt" | "updatedAt"> = {
      tier,
      price: Number(price),
      period,
      color,
      description,
      cta,
      popular,
      order: Number(order),
      features,
    };

    try {
      if (planToEdit?.id) {
        await updateMembershipPlan(planToEdit.id, planData);
      } else {
        await createMembershipPlan(planData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => !loading && onClose()}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/5 shrink-0 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-orbitron font-bold text-white">
                {planToEdit ? "Edit Plan" : "Create New Plan"}
              </h2>
              <p className="text-xs text-white/40 font-space mt-1">
                Define the pricing, details, and features for this tier.
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Form Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm font-space text-red-400">{error}</p>
              </div>
            )}

            <form id="membership-form" onSubmit={handleSubmit} className="space-y-6">
              
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>
                    <span className="flex items-center gap-1.5"><Tag size={12} /> Tier Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    placeholder="e.g. Free, Pro, Elite"
                    className={inputCls}
                  />
                </div>
                
                <div>
                  <label className={labelCls}>
                    <span className="flex items-center gap-1.5"><Palette size={12} /> Accent Color *</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      required
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-12 h-[46px] rounded-lg cursor-pointer bg-white/5 border border-white/10"
                    />
                    <input
                      type="text"
                      required
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>
                    <span className="flex items-center gap-1.5"><DollarSign size={12} /> Price *</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 29"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>
                    Billing Period *
                  </label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className={inputCls}
                  >
                    <option value="month">Per Month (/month)</option>
                    <option value="year">Per Year (/year)</option>
                    <option value="forever">Forever (One-time or Free)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>
                  <span className="flex items-center gap-1.5"><AlignLeft size={12} /> Description *</span>
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. For serious musicians ready to level up"
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>CTA Button Text *</label>
                  <input
                    type="text"
                    required
                    value={cta}
                    onChange={(e) => setCta(e.target.value)}
                    placeholder="e.g. Start Pro Trial"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Display Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className={inputCls}
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={popular}
                  onChange={(e) => setPopular(e.target.checked)}
                  className="w-5 h-5 rounded border-white/20 text-[#FFD60A] focus:ring-[#FFD60A]/50 bg-black"
                />
                <span className="font-space text-sm text-white">Mark as "Most Popular"</span>
              </label>

              {/* Features List */}
              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <label className={labelCls + " !mb-0"}>Features List</label>
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="flex items-center gap-1.5 text-xs font-space text-[#FFD60A] hover:text-[#FFD60A]/80 transition-colors"
                  >
                    <Plus size={14} /> Add Feature
                  </button>
                </div>

                <div className="space-y-3">
                  {features.map((feature, i) => (
                    <div key={i} className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleFeatureChange(i, "included", !feature.included)}
                        className={`w-11 h-11 shrink-0 flex items-center justify-center rounded-xl border transition-colors ${
                          feature.included 
                            ? "bg-[#00FF85]/10 border-[#00FF85]/30 text-[#00FF85]" 
                            : "bg-red-500/10 border-red-500/30 text-red-400"
                        }`}
                      >
                        {feature.included ? <Check size={18} /> : <X size={18} />}
                      </button>
                      <input
                        type="text"
                        value={feature.label}
                        onChange={(e) => handleFeatureChange(i, "label", e.target.value)}
                        placeholder="Feature description..."
                        className={inputCls + " flex-1"}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(i)}
                        className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {features.length === 0 && (
                    <p className="text-sm font-space text-white/30 text-center py-4">
                      No features added yet.
                    </p>
                  )}
                </div>
              </div>

            </form>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-white/5 shrink-0 flex items-center justify-end gap-3 bg-[#050505] rounded-b-2xl">
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
              form="membership-form"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl font-space font-bold text-sm text-black flex items-center gap-2 disabled:opacity-50 transition-all"
              style={{ background: color }}
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? "Saving..." : planToEdit ? "Update Plan" : "Create Plan"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Zap, Check, X, Loader2, AlertCircle, RefreshCw, Eye, EyeOff } from "lucide-react";
import { MembershipPlan, getMembershipPlans, deleteMembershipPlan, createMembershipPlan, getMembershipSettings, updateMembershipSettings } from "@/lib/membership";
import MembershipModal from "@/components/modals/MembershipModal";
import { membershipPlans as dummyPlans } from "@/data/dummy";

export default function MembershipPanel() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSectionEnabled, setIsSectionEnabled] = useState(true);
  const [toggling, setToggling] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    const [data, settings] = await Promise.all([
      getMembershipPlans(),
      getMembershipSettings()
    ]);
    setPlans(data);
    setIsSectionEnabled(settings.isEnabled);
    setLoading(false);
  };

  const handleToggleSection = async () => {
    setToggling(true);
    const newState = !isSectionEnabled;
    await updateMembershipSettings({ isEnabled: newState });
    setIsSectionEnabled(newState);
    setToggling(false);
  };

  const handleEdit = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await deleteMembershipPlan(deleteId);
    await loadPlans();
    setIsDeleting(false);
    setDeleteId(null);
  };

  const handleSeedData = async () => {
    if (plans.length > 0) {
      if (!confirm("You already have plans. Seeding will add duplicates. Proceed?")) return;
    }
    setIsSeeding(true);
    let orderCounter = 1;
    for (const plan of dummyPlans) {
      const { id, ...rest } = plan;
      await createMembershipPlan({
        ...rest,
        order: orderCounter++,
      });
    }
    await loadPlans();
    setIsSeeding(false);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/2 p-4 rounded-xl border border-white/5">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="font-space text-white/50 text-sm">
              {plans.length} Membership {plans.length === 1 ? 'Plan' : 'Plans'} Active
            </h3>
            <p className="text-xs text-white/30 font-space mt-0.5">Control public visibility of the section</p>
          </div>
          <button
            onClick={handleToggleSection}
            disabled={toggling || loading}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-space text-xs font-bold transition-all disabled:opacity-50 ${
              isSectionEnabled 
                ? "bg-[#00FF85]/10 border-[#00FF85]/30 text-[#00FF85]" 
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {toggling ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isSectionEnabled ? (
              <Eye size={14} />
            ) : (
              <EyeOff size={14} />
            )}
            {isSectionEnabled ? "Section Enabled" : "Section Disabled"}
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={loadPlans}
            disabled={loading || isSeeding}
            className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={(loading || isSeeding) ? "animate-spin text-white/60" : "text-white/60"} />
          </button>
          
          <button
            onClick={handleSeedData}
            disabled={isSeeding || loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 font-space text-sm transition-colors text-white disabled:opacity-50"
          >
            {isSeeding ? "Seeding..." : "Seed Default Data"}
          </button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setEditingPlan(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-space font-bold text-sm text-black transition-all"
            style={{
              background: "linear-gradient(135deg, #FFD60A, #FFC300)",
              boxShadow: "0 4px 20px rgba(255, 214, 10, 0.3)",
            }}
          >
            <Plus size={16} /> Create Plan
          </motion.button>
        </div>
      </div>

      {/* Plans Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-[#FFD60A]" />
        </div>
      ) : plans.length === 0 ? (
        <div className="border border-white/5 bg-white/2 rounded-2xl p-12 text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-white/15" />
          <h3 className="font-orbitron text-lg text-white/50 mb-2">No Plans Found</h3>
          <p className="text-sm text-white/30 font-space mb-6">Create your first membership tier to get started.</p>
          <button
            onClick={() => { setEditingPlan(null); setIsModalOpen(true); }}
            className="px-6 py-2 rounded-full bg-[#FFD60A] text-black font-space font-bold text-sm"
          >
            Create Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.1 }}
                className={`relative glass-card p-6 border flex flex-col rounded-2xl overflow-hidden ${
                  plan.popular
                    ? "border-[#FF5B00]/40 shadow-[0_0_30px_rgba(255,91,0,0.1)]"
                    : "border-white/5"
                }`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-[#FF5B00] text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-bl-xl flex items-center gap-1 z-10">
                    <Zap size={10} fill="white" /> POPULAR
                  </div>
                )}
                
                {/* Actions */}
                <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  
                </div>

                <div className="flex items-start justify-between mb-2">
                  <div className="font-orbitron font-black text-xs tracking-widest uppercase" style={{ color: plan.color }}>
                    {plan.tier}
                  </div>
                  
                  {/* Edit / Delete */}
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(plan)} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => setDeleteId(plan.id as string)} className="p-1.5 bg-white/5 hover:bg-red-500/10 rounded-lg text-white/40 hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  {plan.price === 0 || plan.price === "0" ? (
                    <div className="font-orbitron font-black text-3xl text-white">Free</div>
                  ) : (
                    <div className="flex items-end gap-1">
                      <span className="font-orbitron font-black text-3xl" style={{ color: plan.color }}>
                        ${plan.price}
                      </span>
                      <span className="font-space text-xs text-white/30 mb-1">/{plan.period}</span>
                    </div>
                  )}
                </div>

                <p className="font-space text-xs text-white/40 mb-5 min-h-[32px] line-clamp-2">
                  {plan.description}
                </p>

                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.slice(0, 5).map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-2">
                      {feat.included ? (
                        <Check size={12} className="text-[#00FF85] mt-0.5 shrink-0" />
                      ) : (
                        <X size={12} className="text-white/20 mt-0.5 shrink-0" />
                      )}
                      <span className={`font-space text-[11px] ${feat.included ? "text-white/60" : "text-white/20"}`}>
                        {feat.label}
                      </span>
                    </li>
                  ))}
                  {plan.features.length > 5 && (
                    <li className="font-space text-[10px] text-white/30 italic pt-1">
                      + {plan.features.length - 5} more features
                    </li>
                  )}
                </ul>

                <div 
                  className="w-full text-center text-xs py-2.5 font-space font-bold rounded-lg transition-colors border"
                  style={
                    plan.popular
                      ? { background: `${plan.color}20`, color: plan.color, borderColor: `${plan.color}40` }
                      : { background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.1)" }
                  }
                >
                  {plan.cta}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <MembershipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadPlans}
        planToEdit={editingPlan}
      />

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => !isDeleting && setDeleteId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-2xl p-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-space font-bold text-white mb-2">Delete Plan?</h3>
              <p className="text-sm font-space text-white/50 mb-6">
                Are you sure you want to delete this membership plan? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-space text-sm font-bold text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 flex justify-center items-center gap-2 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-space text-sm font-bold text-white transition-colors"
                >
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

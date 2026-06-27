import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Zap, Loader2 } from "lucide-react";
import NeonInstrumentsBg from "@/components/ui/NeonInstrumentsBg";
import { getMembershipPlans, MembershipPlan, getMembershipSettings } from "@/lib/membership";
import { useRouter } from "next/navigation";

export default function MembershipSection() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPlans = async () => {
      const [data, settings] = await Promise.all([
        getMembershipPlans(),
        getMembershipSettings()
      ]);
      setPlans(data);
      setEnabled(settings.isEnabled);
      setLoading(false);
    };
    fetchPlans();
  }, []);

  if (!enabled && !loading) return null;

  return (
    <section id="membership" className="section-padding relative overflow-hidden">
      <NeonInstrumentsBg variant="C" />
      {/* Gold center glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "80vw", height: "80vh", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          background: "radial-gradient(ellipse, rgba(255,214,10,0.05) 0%, rgba(255,91,0,0.03) 40%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-[#FFD60A]" />
            <span className="section-label text-[#FFD60A]">Choose Your Path</span>
            <span className="w-8 h-px bg-[#FFD60A]" />
          </div>
          <h2 className="section-title text-3xl md:text-5xl text-white mb-4">
            Premium <span className="text-neon-gold">Membership</span>
          </h2>
          <p className="font-space text-white/40 max-w-xl mx-auto text-sm md:text-base">
            Unlock the full Studio Musicians experience. Cancel anytime.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 size={36} className="animate-spin text-[#FFD60A]" />
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-16 text-white/30 font-space">
            Membership plans coming soon. Check back later!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                className={`relative glass-card p-7 flex flex-col rounded-2xl transition-all duration-500 hover:scale-105 ${
                  plan.popular ? "z-10 scale-105 hover:scale-110" : ""
                }`}
                style={{
                  border: `1px solid ${plan.color}60`,
                  boxShadow: plan.popular 
                    ? `0 0 40px ${plan.color}30, inset 0 0 20px ${plan.color}15`
                    : `0 0 20px ${plan.color}15, inset 0 0 10px ${plan.color}05`,
                }}
              >
                {/* Top glow line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-70"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${plan.color}, transparent)`,
                  }}
                />
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <span 
                      className="badge text-black text-[10px] font-bold flex items-center gap-1 px-4 py-1.5"
                      style={{ 
                        background: plan.color,
                        boxShadow: `0 0 15px ${plan.color}`
                      }}
                    >
                      <Zap size={10} fill="black" /> MOST POPULAR
                    </span>
                  </div>
                )}

                {/* Tier */}
                <div className="mb-5">
                  <div
                    className="font-orbitron font-black text-xs tracking-widest uppercase mb-1"
                    style={{ color: plan.color }}
                  >
                    {plan.tier}
                  </div>
                  <p className="font-space text-xs text-white/35 min-h-[32px]">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {plan.price === 0 || plan.price === "0" ? (
                    <div className="font-orbitron font-black text-4xl text-white">Free</div>
                  ) : (
                    <div className="flex items-end gap-1">
                      <span className="font-orbitron font-black text-4xl" style={{ color: plan.color }}>
                        ${plan.price}
                      </span>
                      <span className="font-space text-sm text-white/30 mb-1.5">/{plan.period}</span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-3">
                      {feat.included ? (
                        <Check size={14} className="check-included mt-0.5 shrink-0" />
                      ) : (
                        <X size={14} className="check-excluded mt-0.5 shrink-0" />
                      )}
                      <span
                        className={`font-space text-xs leading-relaxed ${
                          feat.included ? "text-white/70" : "text-white/20"
                        }`}
                      >
                        {feat.label}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => router.push(`/payment/membership/${plan.id}`)}
                  className="w-full text-xs py-3.5 font-space font-bold rounded-lg transition-all duration-300 hover:brightness-110 active:scale-95 text-black"
                  style={{ 
                    background: plan.color, 
                    boxShadow: `0 0 20px ${plan.color}40` 
                  }}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 font-space text-xs text-white/25"
        >
          No credit card required for Free plan · 30-day money-back guarantee on paid plans
        </motion.p>
      </div>
    </section>
  );
}

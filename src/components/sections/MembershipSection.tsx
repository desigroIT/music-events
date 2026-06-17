"use client";
import { motion } from "framer-motion";
import { membershipPlans } from "@/data/dummy";
import { Check, X, Zap } from "lucide-react";
import NeonInstrumentsBg from "@/components/ui/NeonInstrumentsBg";

export default function MembershipSection() {
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {membershipPlans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className={`relative glass-card p-7 border flex flex-col ${
                plan.popular
                  ? "border-[#FF5B00]/40 neon-border-orange scale-105"
                  : plan.tier === "Elite"
                  ? "border-[#FFD60A]/40 neon-border-gold"
                  : "border-white/5"
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="badge bg-[#FF5B00] text-white text-[10px] flex items-center gap-1 px-4">
                    <Zap size={10} fill="white" /> Most Popular
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
                <p className="font-space text-xs text-white/35">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                {plan.price === 0 ? (
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
                className="btn-neon w-full text-xs py-3 font-space"
                style={
                  plan.popular
                    ? { background: "#FF5B00", color: "#fff" }
                    : plan.tier === "Elite"
                    ? { background: "#FFD60A", color: "#000" }
                    : { background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }
                }
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

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

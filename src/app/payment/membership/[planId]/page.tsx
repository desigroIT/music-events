"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getMembershipPlanById, MembershipPlan } from "@/lib/membership";
import { Loader2, CreditCard, Lock, ArrowLeft, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function MembershipPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.planId as string;
  const { user } = useAuth();

  const [plan, setPlan] = useState<MembershipPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const loadPlan = async () => {
      if (planId) {
        const data = await getMembershipPlanById(planId);
        setPlan(data);
        setLoading(false);
      }
    };
    loadPlan();
  }, [planId]);

  // Format card number with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    const formatted = value.replace(/(\d{4})/g, "$1 ").trim();
    if (value.length <= 16) {
      setCardNumber(formatted);
    }
  };

  // Format expiry date MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      const formatted = value.length >= 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
      setExpiryDate(formatted);
    }
  };

  // CVV only numbers
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.email) {
      alert("Please login first to complete your checkout.");
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // In a real app, you would save the membership subscription to the user's profile here
      
      // Success! Redirect to a success page or back home
      alert(`Payment successful! You are now subscribed to the ${plan?.tier} plan.`);
      router.push("/");
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-[#FFD60A]" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/40 font-space">Membership plan not found.</p>
      </div>
    );
  }

  const isFree = plan.price === 0 || plan.price === "0";

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: plan.color }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: plan.color }}
        />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-space text-sm mb-8"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Payment Form - Left (3 columns) */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card border rounded-2xl p-8"
              style={{ borderColor: `${plan.color}30` }}
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${plan.color}E6, ${plan.color}80)` }}
                >
                  <CreditCard size={24} className="text-black" />
                </div>
                <div>
                  <h1 className="font-orbitron font-bold text-2xl text-white">
                    {isFree ? "Complete Registration" : "Payment Details"}
                  </h1>
                  <p className="text-white/60 font-space text-sm">
                    {isFree ? "Almost there!" : "Complete your purchase securely"}
                  </p>
                </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isFree && (
                  <>
                    {/* Card Number */}
                    <div>
                      <label className="block text-white font-space text-sm mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-space text-sm focus:outline-none focus:border-white/30 transition-all"
                      />
                    </div>

                    {/* Card Name */}
                    <div>
                      <label className="block text-white font-space text-sm mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-space text-sm focus:outline-none focus:border-white/30 transition-all"
                      />
                    </div>

                    {/* Expiry & CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white font-space text-sm mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          required
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-space text-sm focus:outline-none focus:border-white/30 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-space text-sm mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cvv}
                          onChange={handleCvvChange}
                          placeholder="123"
                          required
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-space text-sm focus:outline-none focus:border-white/30 transition-all"
                        />
                      </div>
                    </div>
                    
                    {/* Security Notice */}
                    <div className="flex items-start gap-3 bg-[#00FF85]/5 border border-[#00FF85]/20 rounded-xl p-4">
                      <Lock size={16} className="text-[#00FF85] flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-white/60 font-space leading-relaxed">
                        Your payment information is encrypted and secure. We never store your card details.
                      </p>
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-4 text-black font-orbitron font-bold rounded-xl transition-all duration-300 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                  style={{
                    background: plan.color,
                    boxShadow: `0 0 20px ${plan.color}40`,
                  }}
                >
                  {processing ? (
                    <>
                      <Loader2 size={20} className="animate-spin text-black" />
                      Processing...
                    </>
                  ) : (
                    `Complete Checkout`
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Order Summary - Right (2 columns) */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card border border-white/10 rounded-2xl p-6 sticky top-24"
            >
              <h2 className="font-orbitron font-bold text-xl text-white mb-6">
                Summary
              </h2>

              <div className="space-y-4">
                {/* Plan Info */}
                <div>
                  <h3 className="font-orbitron font-bold text-lg mb-1" style={{ color: plan.color }}>
                    {plan.tier} Membership
                  </h3>
                  <p className="text-white/60 font-space text-xs leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm font-space">
                    <span className="text-white/60">Subscription:</span>
                    <span className="text-white capitalize">{plan.period}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-space text-white/60">Total:</span>
                    <span className="font-orbitron font-bold text-2xl" style={{ color: plan.color }}>
                      {isFree ? "Free" : `$${plan.price}`}
                    </span>
                  </div>
                </div>

                {/* What's Included */}
                <div className="border-t border-white/10 pt-4 mt-2">
                  <p className="text-xs font-space text-white/40 mb-3">Top Features:</p>
                  <ul className="space-y-3">
                    {plan.features.filter(f => f.included).slice(0, 5).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs font-space text-white/70">
                        <Check size={14} className="mt-0.5 shrink-0" style={{ color: plan.color }} />
                        {feat.label}
                      </li>
                    ))}
                    {plan.features.filter(f => f.included).length > 5 && (
                      <li className="text-xs font-space text-white/30 italic pl-6">
                        + {plan.features.filter(f => f.included).length - 5} more
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

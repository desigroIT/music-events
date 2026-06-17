"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getCourseContent, CourseContent } from "@/lib/courseContent";
import { addRegisteredStudent } from "@/lib/coursePayment";
import { Loader2, CreditCard, Lock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const { user } = useAuth();

  const [courseContent, setCourseContent] = useState<CourseContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const loadCourse = async () => {
      if (courseId) {
        const data = await getCourseContent(courseId);
        setCourseContent(data);
        setLoading(false);
      }
    };
    loadCourse();
  }, [courseId]);

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
      alert("Please login first");
      return;
    }

    setProcessing(true);

    // Simulate payment processing (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // Add user to registered students in Firebase
      await addRegisteredStudent(courseId, user.email);

      // Success! Redirect to course page
      alert("Payment successful! You now have access to all lessons.");
      router.push(`/course/${courseId}`);
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-[#FF4500]" />
      </div>
    );
  }

  if (!courseContent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/40 font-space">Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF4500]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#BF00FF]/10 rounded-full blur-3xl"
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
          Back to Course
        </button>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Payment Form - Left (3 columns) */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card border border-[#FF4500]/30 rounded-2xl p-8"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8C00] flex items-center justify-center">
                  <CreditCard size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="font-orbitron font-bold text-2xl text-white">
                    Payment Details
                  </h1>
                  <p className="text-white/60 font-space text-sm">
                    Complete your purchase securely
                  </p>
                </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-space text-sm focus:outline-none focus:border-[#FF4500]/50 focus:shadow-[0_0_15px_rgba(255,69,0,0.1)] transition-all"
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-space text-sm focus:outline-none focus:border-[#FF4500]/50 focus:shadow-[0_0_15px_rgba(255,69,0,0.1)] transition-all"
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
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-space text-sm focus:outline-none focus:border-[#FF4500]/50 focus:shadow-[0_0_15px_rgba(255,69,0,0.1)] transition-all"
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
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-space text-sm focus:outline-none focus:border-[#FF4500]/50 focus:shadow-[0_0_15px_rgba(255,69,0,0.1)] transition-all"
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-4 bg-gradient-to-r from-[#FF4500] to-[#FF8C00] text-white font-orbitron font-bold rounded-xl hover:shadow-2xl hover:shadow-[#FF4500]/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay $${courseContent.offerPrice || courseContent.price}`
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
                Order Summary
              </h2>

              <div className="space-y-4">
                {/* Course Info */}
                <div>
                  <h3 className="font-space font-bold text-sm text-white mb-2">
                    {courseContent.courseName}
                  </h3>
                  <p className="text-white/60 font-space text-xs leading-relaxed">
                    {courseContent.description}
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm font-space">
                    <span className="text-white/60">Subtotal:</span>
                    <span className="text-white">${courseContent.price}</span>
                  </div>

                  {courseContent.offerPrice && courseContent.offerPrice < courseContent.price && (
                    <div className="flex items-center justify-between text-sm font-space">
                      <span className="text-[#00FF85]">Discount:</span>
                      <span className="text-[#00FF85]">
                        -${(courseContent.price - courseContent.offerPrice).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-space text-white/60">Total:</span>
                    <span className="font-orbitron font-bold text-2xl text-[#FF4500]">
                      ${courseContent.offerPrice || courseContent.price}
                    </span>
                  </div>
                </div>

                {/* What's Included */}
                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs font-space text-white/40 mb-2">What's included:</p>
                  <ul className="space-y-2 text-xs font-space text-white/60">
                    <li>✓ Full access to all {courseContent.numberOfLessons || courseContent.lessons?.length || 0} lessons</li>
                    <li>✓ Lifetime access</li>
                    <li>✓ HD video quality</li>
                    {courseContent.enableCertificate && (
                      <li>✓ Certificate of completion</li>
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

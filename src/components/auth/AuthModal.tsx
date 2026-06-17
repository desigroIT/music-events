"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, MapPin, Phone, GraduationCap, Calendar, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { registerUser, loginUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string;
  mode?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, redirectTo, mode = "login" }: AuthModalProps) {
  const router = useRouter();
  const [currentMode, setCurrentMode] = useState<"login" | "register">(mode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    district: "",
    age: "",
    phone: "",
    schoolOrUniversity: "",
  });

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
      district: "",
      age: "",
      phone: "",
      schoolOrUniversity: "",
    });
    setError(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const toggleMode = () => {
    setCurrentMode(currentMode === "login" ? "register" : "login");
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (currentMode === "register") {
        // Validation
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        if (!formData.displayName.trim()) {
          setError("Name is required");
          setLoading(false);
          return;
        }

        // Register
        const result = await registerUser(
          formData.email,
          formData.password,
          formData.displayName,
          {
            district: formData.district || undefined,
            age: formData.age ? parseInt(formData.age) : undefined,
            phone: formData.phone || undefined,
            schoolOrUniversity: formData.schoolOrUniversity || undefined,
          }
        );

        if (result.success) {
          handleClose();
          if (redirectTo) {
            router.push(redirectTo);
          }
        } else {
          setError(result.error || "Registration failed");
        }
      } else {
        // Login
        const result = await loginUser(formData.email, formData.password);

        if (result.success) {
          handleClose();
          if (redirectTo) {
            router.push(redirectTo);
          }
        } else {
          setError(result.error || "Login failed");
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Animated neon background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg max-h-[90vh] bg-[#0A0A0A] rounded-2xl border border-[#FF4500]/20 shadow-2xl shadow-[#FF4500]/10 overflow-hidden flex flex-col"
            style={{
              boxShadow: "0 0 60px rgba(255, 69, 0, 0.15), 0 0 100px rgba(191, 0, 255, 0.1)",
            }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors z-10 group"
            >
              <X size={20} className="text-white/60 group-hover:text-white transition-colors" />
            </button>

            {/* Header */}
            <div className="px-8 pt-10 pb-6 border-b border-white/5">
              <motion.h2
                key={currentMode}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-orbitron font-bold text-3xl bg-gradient-to-r from-[#FF4500] via-[#FF8C00] to-[#BF00FF] bg-clip-text text-transparent"
              >
                {currentMode === "login" ? "Welcome Back" : "Join Studio Musicians"}
              </motion.h2>
              <p className="text-white/40 font-space text-sm mt-2">
                {currentMode === "login"
                  ? "Sign in to access your courses"
                  : "Create an account to start learning"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6">
              <div className="space-y-5">
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                  >
                    <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
                    <span className="text-sm text-red-400 font-space">{error}</span>
                  </motion.div>
                )}

                {/* Email (Required) */}
                <div className="relative group">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#FF4500] transition-colors"
                  />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF4500]/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(255,69,0,0.1)] transition-all font-space"
                    placeholder="Email address"
                    style={{
                      boxShadow: "0 0 0 0 rgba(255, 69, 0, 0)",
                    }}
                  />
                </div>

                {/* Password (Required) */}
                <div className="relative group">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#FF4500] transition-colors"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-12 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF4500]/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(255,69,0,0.1)] transition-all font-space"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Confirm Password (Register Only - Required) */}
                {currentMode === "register" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative group"
                  >
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#FF4500] transition-colors"
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-12 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF4500]/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(255,69,0,0.1)] transition-all font-space"
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </motion.div>
                )}

                {/* Display Name (Register Only - Required) */}
                {currentMode === "register" && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="relative group"
                    >
                      <User
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#FF4500] transition-colors"
                      />
                      <input
                        type="text"
                        required
                        value={formData.displayName}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF4500]/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(255,69,0,0.1)] transition-all font-space"
                        placeholder="Your name"
                      />
                    </motion.div>

                    {/* Optional Fields Divider */}
                    <div className="flex items-center gap-4 py-2">
                      <div className="flex-1 h-px bg-white/5" />
                      <span className="text-xs text-white/30 font-space uppercase tracking-wider">
                        Optional Details
                      </span>
                      <div className="flex-1 h-px bg-white/5" />
                    </div>

                    {/* District (Optional) */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="relative group"
                    >
                      <MapPin
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#BF00FF] transition-colors"
                      />
                      <input
                        type="text"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#BF00FF]/50 focus:bg-white/10 transition-all font-space"
                        placeholder="District"
                      />
                    </motion.div>

                    {/* Age & Phone (Optional) */}
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="relative group"
                      >
                        <Calendar
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#BF00FF] transition-colors"
                        />
                        <input
                          type="number"
                          min="1"
                          max="120"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#BF00FF]/50 focus:bg-white/10 transition-all font-space"
                          placeholder="Age"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="relative group"
                      >
                        <Phone
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#BF00FF] transition-colors"
                        />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#BF00FF]/50 focus:bg-white/10 transition-all font-space"
                          placeholder="Phone"
                        />
                      </motion.div>
                    </div>

                    {/* School/University (Optional) */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="relative group"
                    >
                      <GraduationCap
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#BF00FF] transition-colors"
                      />
                      <input
                        type="text"
                        value={formData.schoolOrUniversity}
                        onChange={(e) =>
                          setFormData({ ...formData, schoolOrUniversity: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#BF00FF]/50 focus:bg-white/10 transition-all font-space"
                        placeholder="School / University"
                      />
                    </motion.div>
                  </>
                )}
              </div>
            </form>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-white/5 space-y-4">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[#FF4500] via-[#FF8C00] to-[#BF00FF] rounded-lg font-space font-bold text-sm text-black hover:shadow-2xl hover:shadow-[#FF4500]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                style={{
                  animation: loading ? "none" : "glow 2s infinite alternate",
                }}
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <span className="uppercase tracking-wider">
                    {currentMode === "login" ? "Sign In" : "Create Account"}
                  </span>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={toggleMode}
                  disabled={loading}
                  className="text-sm font-space text-white/50 hover:text-white transition-colors disabled:opacity-50"
                >
                  {currentMode === "login" ? (
                    <>
                      Don't have an account?{" "}
                      <span className="text-[#FF4500] font-bold">Register</span>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <span className="text-[#FF4500] font-bold">Sign In</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

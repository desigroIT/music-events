"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Clock, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseName: string;
  description: string;
  price: number;
  offerPrice?: number;
  completionTime?: string;
  numberOfLessons?: number;
}

export default function PaymentModal({
  isOpen,
  onClose,
  courseId,
  courseName,
  description,
  price,
  offerPrice,
  completionTime,
  numberOfLessons,
}: PaymentModalProps) {
  const router = useRouter();

  const handlePayNow = () => {
    onClose();
    router.push(`/payment/${courseId}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-card border border-[#FF4500]/30 rounded-2xl max-w-lg w-full p-8 relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              {/* Content */}
              <div className="space-y-6">
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8C00] flex items-center justify-center mx-auto">
                  <DollarSign size={32} className="text-white" />
                </div>

                {/* Title */}
                <div className="text-center">
                  <h2 className="font-orbitron font-bold text-2xl text-white mb-2">
                    Unlock This Course
                  </h2>
                  <p className="text-white/60 font-space text-sm">
                    Purchase to get full access to all lessons
                  </p>
                </div>

                {/* Course Details */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                  <h3 className="font-orbitron font-bold text-lg text-white">
                    {courseName}
                  </h3>

                  <p className="text-white/70 font-space text-sm leading-relaxed">
                    {description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs font-space text-white/50">
                    {completionTime && (
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>{completionTime}</span>
                      </div>
                    )}
                    {numberOfLessons && (
                      <div className="flex items-center gap-2">
                        <BookOpen size={14} />
                        <span>{numberOfLessons} lessons</span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 font-space text-sm">Price:</span>
                      <div className="flex items-center gap-3">
                        {offerPrice && offerPrice < price ? (
                          <>
                            <span className="text-white/30 line-through font-space text-lg">
                              ${price}
                            </span>
                            <span className="text-[#FF4500] font-orbitron font-bold text-2xl">
                              ${offerPrice}
                            </span>
                          </>
                        ) : (
                          <span className="text-[#FF4500] font-orbitron font-bold text-2xl">
                            ${price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pay Now Button */}
                <button
                  onClick={handlePayNow}
                  className="w-full py-4 bg-gradient-to-r from-[#FF4500] to-[#FF8C00] text-white font-orbitron font-bold rounded-xl hover:shadow-2xl hover:shadow-[#FF4500]/50 transition-all duration-300 hover:scale-105"
                >
                  Pay Now
                </button>

                {/* Cancel Button */}
                <button
                  onClick={onClose}
                  className="w-full py-3 text-white/60 hover:text-white font-space text-sm transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

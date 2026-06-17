"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Play } from "lucide-react";

interface EnrollButtonProps {
  courseId: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * EnrollButton - Handles course enrollment with auth check
 * If user is not authenticated, redirects to home with auth modal
 * If authenticated, navigates to course detail page
 */
export default function EnrollButton({ courseId, className = "", style, children }: EnrollButtonProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleEnroll = () => {
    if (isAuthenticated) {
      // User is authenticated, go to course page
      router.push(`/course/${courseId}`);
    } else {
      // User not authenticated, redirect to home with auth modal
      router.push(`/?auth=true&redirect=${encodeURIComponent(`/course/${courseId}`)}`);
    }
  };

  return (
    <button
      onClick={handleEnroll}
      className={
        className ||
        "w-full px-6 py-3 bg-gradient-to-r from-[#FF4500] to-[#FF8C00] rounded-lg font-space font-bold text-sm text-black hover:shadow-lg hover:shadow-[#FF4500]/30 transition-all flex items-center justify-center gap-2 group"
      }
      style={style}
    >
      {children || (
        <>
          <Play size={16} fill="black" className="group-hover:scale-110 transition-transform" />
          <span>ENROLL NOW</span>
        </>
      )}
    </button>
  );
}

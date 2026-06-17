"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  fallbackUrl?: string;
}

/**
 * AuthGuard - Protects routes that require authentication
 * Redirects to login with current path as redirect parameter
 */
export default function AuthGuard({ children, fallbackUrl = "/" }: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Store intended destination and redirect to fallback
        // The fallback page should handle showing the auth modal
        const redirectUrl = encodeURIComponent(pathname);
        router.push(`${fallbackUrl}?redirect=${redirectUrl}&auth=true`);
      } else {
        setShouldRender(true);
      }
    }
  }, [isAuthenticated, loading, router, pathname, fallbackUrl]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#FF4500] mx-auto mb-4" />
          <p className="text-white/40 font-space text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render children if authenticated
  return shouldRender ? <>{children}</> : null;
}

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Custom hook to manage auth modal state
 * Automatically opens modal if ?auth=true is in URL
 */
export const useAuthModal = () => {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | undefined>(undefined);
  const [mode, setMode] = useState<"login" | "register" | undefined>(undefined);

  useEffect(() => {
    const authParam = searchParams.get("auth");
    const redirectParam = searchParams.get("redirect");
    const modeParam = searchParams.get("mode") as "login" | "register" | null;

    if (authParam === "true") {
      setIsOpen(true);
      if (redirectParam) {
        setRedirectTo(decodeURIComponent(redirectParam));
      }
      if (modeParam) {
        setMode(modeParam);
      }
    }
  }, [searchParams]);

  const openModal = (redirect?: string) => {
    setIsOpen(true);
    if (redirect) {
      setRedirectTo(redirect);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    // Clear URL params
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("auth");
      url.searchParams.delete("redirect");
      url.searchParams.delete("mode");
      window.history.replaceState({}, "", url.toString());
    }
  };

  return {
    isOpen,
    redirectTo,
    mode,
    openModal,
    closeModal,
  };
};

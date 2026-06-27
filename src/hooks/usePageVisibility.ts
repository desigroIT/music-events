"use client";
import { useEffect } from "react";

/**
 * Pauses all CSS animations when the browser tab is hidden (not focused).
 * This prevents the GPU/CPU from rendering invisible animations, reducing heat.
 * Adds/removes the `.animations-paused` class on <body>.
 */
export function usePageVisibility() {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.body.classList.add("animations-paused");
      } else {
        document.body.classList.remove("animations-paused");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.body.classList.remove("animations-paused");
    };
  }, []);
}

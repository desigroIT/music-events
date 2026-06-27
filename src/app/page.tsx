"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/ui/Navbar";
import ScrollProgress from "@/components/ui/ScrollProgress";
import HeroSection from "@/components/sections/HeroSection";
import AuthModal from "@/components/auth/AuthModal";
import { useAuthModal } from "@/hooks/useAuthModal";
import { usePageVisibility } from "@/hooks/usePageVisibility";

// ── Lazy-load all below-fold sections (reduces initial JS bundle + mount cost)
const DrumCoursesSection  = dynamic(() => import("@/components/sections/DrumCoursesSection"),  { ssr: false });
const MyCoursesSection    = dynamic(() => import("@/components/sections/MyCoursesSection"),    { ssr: false });
const AcademySection      = dynamic(() => import("@/components/sections/AcademySection"),      { ssr: false });
const CommunitySection    = dynamic(() => import("@/components/sections/CommunitySection"),    { ssr: false });
const NetworkingSection   = dynamic(() => import("@/components/sections/NetworkingSection"),   { ssr: false });
const BlogSection         = dynamic(() => import("@/components/sections/BlogSection"),         { ssr: false });
const EventsSection       = dynamic(() => import("@/components/sections/EventsSection"),       { ssr: false });
const MembershipSection   = dynamic(() => import("@/components/sections/MembershipSection"),   { ssr: false });
const FooterSection       = dynamic(() => import("@/components/sections/FooterSection"),       { ssr: false });

function SectionFallback() {
  return (
    <div className="section-padding flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#FF5B00] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function AuthModalWrapper() {
  const { isOpen, redirectTo, mode, closeModal } = useAuthModal();
  return <AuthModal isOpen={isOpen} onClose={closeModal} redirectTo={redirectTo} mode={mode || "login"} />;
}

export default function HomePage() {
  // Pause all CSS animations when tab is not visible — reduces CPU/GPU heat
  usePageVisibility();

  return (
    <>
      {/* Scan line effect */}
      <div className="scan-line" />

      {/* Auth Modal - Wrapped in Suspense */}
      <Suspense fallback={null}>
        <AuthModalWrapper />
      </Suspense>

      {/* Fixed UI */}
      <Navbar />
      <ScrollProgress />

      {/* Page content */}
      <main className="page-content">
        {/* Hero — always eager loaded */}
        <HeroSection />

        {/* Content sections — lazy loaded as chunks */}
        <div className="relative bg-[#050505]">
          {/* Grid overlay */}
          <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />

          <Suspense fallback={<SectionFallback />}>
            <DrumCoursesSection />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <MyCoursesSection />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <AcademySection />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <CommunitySection />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <NetworkingSection />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <BlogSection />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <EventsSection />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <MembershipSection />
          </Suspense>
          <Suspense fallback={null}>
            <FooterSection />
          </Suspense>
        </div>
      </main>
    </>
  );
}

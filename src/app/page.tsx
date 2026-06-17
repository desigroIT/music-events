"use client";
import { Suspense } from "react";
import Navbar from "@/components/ui/Navbar";
import ScrollProgress from "@/components/ui/ScrollProgress";
import HeroSection from "@/components/sections/HeroSection";
import DrumCoursesSection from "@/components/sections/DrumCoursesSection";
import MyCoursesSection from "@/components/sections/MyCoursesSection";
import AcademySection from "@/components/sections/AcademySection";
import CommunitySection from "@/components/sections/CommunitySection";
import NetworkingSection from "@/components/sections/NetworkingSection";
import BlogSection from "@/components/sections/BlogSection";
import EventsSection from "@/components/sections/EventsSection";
import MembershipSection from "@/components/sections/MembershipSection";
import FooterSection from "@/components/sections/FooterSection";
import AuthModal from "@/components/auth/AuthModal";
import { useAuthModal } from "@/hooks/useAuthModal";

function AuthModalWrapper() {
  const { isOpen, redirectTo, closeModal } = useAuthModal();
  return <AuthModal isOpen={isOpen} onClose={closeModal} redirectTo={redirectTo} />;
}

export default function HomePage() {
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
        {/* Hero */}
        <HeroSection />

        {/* Content sections */}
        <div className="relative bg-[#050505]">
          {/* Grid overlay */}
          <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />

          <DrumCoursesSection />
          <MyCoursesSection />
          <AcademySection />
          <CommunitySection />
          <NetworkingSection />
          <BlogSection />
          <EventsSection />
          <MembershipSection />
          <FooterSection />
        </div>
      </main>
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Users,
  Network,
  FileText,
  Calendar,
  CreditCard,
  BookOpen,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import CoursesPanel from "./panels/CoursesPanel";
import { getCourses } from "@/lib/firestore";

const menuItems = [
  { id: "courses", label: "Courses", icon: GraduationCap, color: "#FF5B00" },
  { id: "academy", label: "Academy", icon: BookOpen, color: "#00D4FF" },
  { id: "community", label: "Community", icon: Users, color: "#9D4EDD" },
  { id: "networking", label: "Networking", icon: Network, color: "#FFD60A" },
  { id: "blog", label: "Blog", icon: FileText, color: "#FF5B00" },
  { id: "events", label: "Events", icon: Calendar, color: "#00D4FF" },
  { id: "membership", label: "Membership", icon: CreditCard, color: "#9D4EDD" },
];

export default function AdminDashboard() {
  const [activePanel, setActivePanel] = useState("courses");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalEnrolled: 0,
    totalEarnings: 0,
  });

  const activeItem = menuItems.find((item) => item.id === activePanel);

  // Load stats from Firebase
  useEffect(() => {
    const loadStats = async () => {
      const courses = await getCourses();

      const totalCourses = courses.length;
      const totalEnrolled = courses.reduce((sum, course) => {
        return sum + ((course as any).registeredStudents?.length || 0);
      }, 0);
      const totalEarnings = courses.reduce((sum, course) => {
        const enrolled = (course as any).registeredStudents?.length || 0;
        return sum + (enrolled * course.price);
      }, 0);

      setStats({
        totalCourses,
        totalEnrolled,
        totalEarnings,
      });
    };

    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-black/40 backdrop-blur-xl border-b border-white/5 z-50">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors lg:hidden"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF5B00] to-[#FF8C00] flex items-center justify-center">
                <LayoutDashboard size={20} />
              </div>
              <div>
                <h1 className="font-orbitron font-bold text-sm">Admin Dashboard</h1>
                <p className="text-[10px] text-white/40 font-space">Studio Musicians</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-[#00FF85] animate-pulse" />
              <span className="text-xs font-space text-white/60">Live</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed lg:sticky top-16 left-0 w-72 h-[calc(100vh-4rem)] bg-black/20 backdrop-blur-xl border-r border-white/5 overflow-y-auto z-40"
            >
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xs font-space text-white/40 uppercase tracking-wider mb-3">
                    Dashboard Menu
                  </h2>
                </div>

                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePanel === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActivePanel(item.id);
                          if (window.innerWidth < 1024) setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                          isActive
                            ? "bg-white/10 text-white"
                            : "text-white/50 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 rounded-lg"
                            style={{
                              background: `linear-gradient(90deg, ${item.color}15 0%, transparent 100%)`,
                              borderLeft: `3px solid ${item.color}`,
                            }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                          />
                        )}
                        <Icon
                          size={18}
                          className="relative z-10"
                          style={{ color: isActive ? item.color : undefined }}
                        />
                        <span className="font-space text-sm relative z-10">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* Stats Card */}
                <div className="mt-8 p-4 rounded-lg bg-gradient-to-br from-[#FF5B00]/10 to-[#9D4EDD]/10 border border-white/5">
                  <h3 className="text-xs font-space text-white/60 mb-3">Quick Stats</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40">Total Courses</span>
                      <span className="text-sm font-bold text-[#FF5B00]">
                        {stats.totalCourses}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40">Total Enrolled</span>
                      <span className="text-sm font-bold text-[#00D4FF]">
                        {stats.totalEnrolled.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40">Total Earnings</span>
                      <span className="text-sm font-bold text-[#00FF85]">
                        ${stats.totalEarnings.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main
          className={`flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300 ${
            sidebarOpen ? "lg:ml-0" : "ml-0"
          }`}
        >
          <div className="p-6 lg:p-8">
            {/* Panel Header */}
            <motion.div
              key={activePanel}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-2">
                {activeItem && (
                  <>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${activeItem.color}20, ${activeItem.color}10)`,
                        border: `1px solid ${activeItem.color}30`,
                      }}
                    >
                      <activeItem.icon size={24} style={{ color: activeItem.color }} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-orbitron font-bold">{activeItem.label}</h2>
                      <p className="text-xs text-white/40 font-space">
                        Manage {activeItem.label.toLowerCase()} content
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Panel Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePanel}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activePanel === "courses" && <CoursesPanel />}
                {activePanel === "academy" && <ComingSoonPanel section="Academy" />}
                {activePanel === "community" && <ComingSoonPanel section="Community" />}
                {activePanel === "networking" && <ComingSoonPanel section="Networking" />}
                {activePanel === "blog" && <ComingSoonPanel section="Blog" />}
                {activePanel === "events" && <ComingSoonPanel section="Events" />}
                {activePanel === "membership" && <ComingSoonPanel section="Membership" />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function ComingSoonPanel({ section }: { section: string }) {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 flex items-center justify-center">
          <LayoutDashboard size={32} className="text-white/20" />
        </div>
        <h3 className="text-xl font-orbitron font-bold text-white/80 mb-2">{section} Panel</h3>
        <p className="text-sm text-white/40 font-space">Coming soon...</p>
      </div>
    </div>
  );
}

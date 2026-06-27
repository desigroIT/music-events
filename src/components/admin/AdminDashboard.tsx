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
  LogOut,
  Lock,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import CoursesPanel from "./panels/CoursesPanel";
import NetworkingPanel from "./panels/NetworkingPanel";
import EventsPanel from "./panels/EventsPanel";
import CommunityPanel from "./panels/CommunityPanel";
import BlogPanel from "./panels/BlogPanel";
import MembershipPanel from "./panels/MembershipPanel";
import AcademyPanel from "./panels/AcademyPanel";
import { getCourses } from "@/lib/firestore";

const menuItems = [
  { id: "courses", label: "Courses", icon: GraduationCap, color: "#FF5B00" },
  { id: "academy", label: "Academy", icon: BookOpen, color: "#00D4FF" },
  { id: "community", label: "Register Musicians Community", icon: Users, color: "#9D4EDD" },
  { id: "networking", label: "Networking", icon: Network, color: "#FFD60A" },
  { id: "blog", label: "Blog", icon: FileText, color: "#FF5B00" },
  { id: "events", label: "Events", icon: Calendar, color: "#00D4FF" },
  { id: "membership", label: "Membership", icon: CreditCard, color: "#9D4EDD" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  // Login Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard Panel States
  const [activePanel, setActivePanel] = useState("courses");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalEnrolled: 0,
    totalEarnings: 0,
  });

  const activeItem = menuItems.find((item) => item.id === activePanel);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem("admin_logged_in") === "true";
    setIsAuthenticated(isLoggedIn);
  }, []);

  // Load stats from Firebase when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

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
  }, [isAuthenticated]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    // Simulate small network delay for premium feel
    setTimeout(() => {
      if (email.trim() === "studiomusic@admin98.com" && password === "Studio98Admin") {
        sessionStorage.setItem("admin_logged_in", "true");
        setIsAuthenticated(true);
      } else {
        setLoginError("Invalid username or password.");
      }
      setLoginLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_logged_in");
    setIsAuthenticated(false);
    router.push("/");
  };

  // If initial auth status is checking, show premium loader
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#FF5B00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ─── LOGIN PAGE ───
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
        {/* Background Image from Hero Section */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero.png"
            alt="Admin Login Background"
            className="w-full h-full object-cover object-center scale-105 filter blur-[2px]"
          />
          {/* Overlay matching Hero section styling */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(5,5,5,0.6) 0%, rgba(5,5,5,0.4) 40%, rgba(5,5,5,0.85) 90%, #050505 100%)",
            }}
          />
          <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(255,91,0,0.15) 0%, rgba(0,212,255,0.08) 50%, transparent 80%)",
            }}
          />
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md px-6"
        >
          <div className="glass-card p-8 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden">
            {/* Ambient cyan/orange glow inside card */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FF5B00]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#00D4FF]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#FF5B00] to-[#FF8C00] flex items-center justify-center shadow-lg shadow-[#FF5B00]/25">
                <Lock size={24} className="text-black" />
              </div>
              <h2 className="font-orbitron font-black text-2xl text-white tracking-wider uppercase">
                Admin <span className="text-neon-orange">Portal</span>
              </h2>
              <p className="font-space text-xs text-white/40 mt-1">
                Authorized personnel only
              </p>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-space p-3 rounded-lg mb-5 flex items-center gap-2"
                >
                  <X size={14} className="shrink-0" />
                  <span>{loginError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-space text-white/50 uppercase tracking-widest mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF5B00]/60 focus:bg-white/8 transition-all font-space"
                    placeholder="studiomusic@admin98.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-space text-white/50 uppercase tracking-widest mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF5B00]/60 focus:bg-white/8 transition-all font-space"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-gradient-to-r from-[#FF5B00] to-[#FF8C00] hover:from-[#FF6D1B] hover:to-[#FF9D1E] text-black font-space font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-[#FF5B00]/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                {loginLoading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── ADMIN DASHBOARD PANEL ───
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
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 mr-2">
              <div className="w-2 h-2 rounded-full bg-[#00FF85] animate-pulse" />
              <span className="text-xs font-space text-white/60">Live</span>
            </div>

            {/* Logout Header Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-space transition-all active:scale-95"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
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
              <div className="p-6 flex flex-col justify-between h-full min-h-[calc(100vh-6rem)]">
                <div>
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

                {/* Sidebar Bottom Logout */}
                <div className="mt-auto pt-6 border-t border-white/5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group relative overflow-hidden"
                  >
                    <LogOut size={18} className="relative z-10 group-hover:rotate-12 transition-transform" />
                    <span className="font-space text-sm relative z-10 font-medium">Logout</span>
                  </button>
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
                {activePanel === "academy" && <AcademyPanel />}
                {activePanel === "community" && <CommunityPanel />}
                {activePanel === "networking" && <NetworkingPanel />}
                {activePanel === "blog" && <BlogPanel />}
                {activePanel === "events" && <EventsPanel />}
                {activePanel === "membership" && <MembershipPanel />}
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

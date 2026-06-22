"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "@/data/dummy";
import { Menu, X, Music, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/auth";

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-2xl border-b border-white/5 bg-[#050505]/80"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-[#FF5B00]/50 group-hover:border-[#FF5B00] transition-colors duration-300" />
              <div className="absolute inset-0 rounded-full bg-[#FF5B00]/10 group-hover:bg-[#FF5B00]/20 transition-colors duration-300" />
              <Music size={16} className="text-[#FF5B00] relative z-10" />
            </div>
            <span className="font-orbitron font-bold text-sm tracking-widest text-white">
              STUDIO <span className="text-[#FF5B00]">MUSICIANS</span>
            </span>
          </a>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-space text-xs tracking-widest text-white/50 hover:text-[#FF5B00] transition-all duration-300 uppercase relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#FF5B00] group-hover:w-full transition-all duration-300" />
                </a>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {!user ? (
              <>
                <button 
                  onClick={() => router.push("?auth=true&mode=login")}
                  className="btn-neon btn-outline-orange text-xs px-5 py-2"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => router.push("?auth=true&mode=register")}
                  className="btn-neon btn-orange text-xs px-5 py-2"
                >
                  Join Free
                </button>
              </>
            ) : (
              <button 
                onClick={async () => {
                  await logoutUser();
                  router.push("/");
                }}
                className="btn-neon btn-outline-orange flex items-center gap-2 text-xs px-5 py-2"
              >
                <LogOut size={14} />
                Logout
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-white/70 hover:text-[#FF5B00] transition-colors"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-y-0 right-0 w-80 z-40 mobile-menu bg-[#080808]/95 border-l border-white/5"
          >
            <div className="p-8 pt-24 flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => setMenuOpen(false)}
                  className="font-space text-sm tracking-widest text-white/60 hover:text-[#FF5B00] transition-colors uppercase border-b border-white/5 pb-4"
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="flex flex-col gap-3 mt-4">
                {!user ? (
                  <>
                    <button 
                      onClick={() => {
                        setMenuOpen(false);
                        router.push("?auth=true&mode=login");
                      }}
                      className="btn-neon btn-outline-orange w-full text-xs"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => {
                        setMenuOpen(false);
                        router.push("?auth=true&mode=register");
                      }}
                      className="btn-neon btn-orange w-full text-xs"
                    >
                      Join Free
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={async () => {
                      setMenuOpen(false);
                      await logoutUser();
                      router.push("/");
                    }}
                    className="btn-neon btn-outline-orange flex items-center justify-center gap-2 w-full text-xs"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";
import { motion } from "framer-motion";
import { footerLinks, socialLinks } from "@/data/dummy";
import { Music, Instagram, Youtube, Twitter, MessageCircle, Music2 } from "lucide-react";
import NeonInstrumentsBg from "@/components/ui/NeonInstrumentsBg";

const SocialIcon = ({ icon }: { icon: string }) => {
  const icons: Record<string, React.ReactNode> = {
    instagram: <Instagram size={16} />,
    youtube: <Youtube size={16} />,
    twitter: <Twitter size={16} />,
    discord: <MessageCircle size={16} />,
    tiktok: <Music2 size={16} />,
  };
  return <>{icons[icon] || <Music size={16} />}</>;
};

export default function FooterSection() {
  return (
    <footer
      id="footer"
      className="relative border-t border-white/5 overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #050505, #020202)",
      }}
    >
      <NeonInstrumentsBg variant="D" />
      {/* Background grid */}
      <div className="absolute inset-0 grid-overlay opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        {/* Top: Logo + tagline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-start gap-12 mb-16"
        >
          {/* Brand */}
          <div className="lg:w-64 shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full border border-[#FF5B00]/50 bg-[#FF5B00]/10 flex items-center justify-center">
                <Music size={16} className="text-[#FF5B00]" />
              </div>
              <span className="font-orbitron font-bold text-sm tracking-widest text-white">
                STUDIO <span className="text-[#FF5B00]">MUSICIANS</span>
              </span>
            </div>
            <p className="font-space text-xs text-white/35 leading-relaxed mb-5">
              The world's most immersive music learning and networking platform. Built by musicians, for musicians.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.icon}
                  href={s.href}
                  className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-white/40 hover:text-[#FF5B00] hover:border-[#FF5B00]/30 transition-all duration-300 border border-white/5"
                >
                  <SocialIcon icon={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-space font-bold text-xs text-white/50 uppercase tracking-widest mb-4">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="font-space text-xs text-white/30 hover:text-[#FF5B00] transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card border border-white/5 p-6 md:p-8 rounded-2xl mb-12 flex flex-col md:flex-row items-center gap-6"
        >
          <div className="flex-1">
            <h3 className="font-space font-bold text-base text-white mb-1">
              Get the{" "}
              <span className="text-[#FF5B00]">Studio Weekly</span> newsletter
            </h3>
            <p className="font-space text-xs text-white/35">
              Music tips, new courses, events, and community highlights — every Friday.
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 md:w-56 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 font-space text-xs text-white placeholder:text-white/25 outline-none focus:border-[#FF5B00]/50 transition-colors"
            />
            <button className="btn-neon btn-orange text-xs px-5 py-2.5 shrink-0">
              Subscribe
            </button>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-space text-xs text-white/20">
            © 2025 Studio Musicians. All rights reserved.
          </p>
          <p className="font-space text-xs text-white/20">
            Made with ❤️ for musicians everywhere 🌍
          </p>
          <div className="flex gap-4">
            <a href="#" className="font-space text-xs text-white/20 hover:text-white/40 transition-colors">Privacy</a>
            <a href="#" className="font-space text-xs text-white/20 hover:text-white/40 transition-colors">Terms</a>
            <a href="#" className="font-space text-xs text-white/20 hover:text-white/40 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

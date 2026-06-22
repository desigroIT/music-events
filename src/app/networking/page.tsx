"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Filter, Search, ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/ui/Navbar";
import FooterSection from "@/components/sections/FooterSection";
import AuthModal from "@/components/auth/AuthModal";
import { useAuthModal } from "@/hooks/useAuthModal";
import { getNetworkingPosts, NetworkingPost, NetworkingPostType } from "@/lib/networking";
import NetworkingCard from "@/components/cards/NetworkingCard";
import NeonInstrumentsBg from "@/components/ui/NeonInstrumentsBg";
import PostNetworkingModal from "@/components/modals/PostNetworkingModal";

function AuthModalWrapper() {
  const { isOpen, redirectTo, mode, closeModal } = useAuthModal();
  return <AuthModal isOpen={isOpen} onClose={closeModal} redirectTo={redirectTo} mode={mode || "login"} />;
}

const SRI_LANKA_DISTRICTS = [
  "All Locations", "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle",
  "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle",
  "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala",
  "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura",
  "Trincomalee", "Vavuniya"
];

export default function NetworkingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<NetworkingPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filters
  const [category, setCategory] = useState<NetworkingPostType | "all">("all");
  const [location, setLocation] = useState<string>("All Locations");
  
  const fetchPosts = async () => {
    setLoading(true);
    const data = await getNetworkingPosts({
      category,
      location: location === "All Locations" ? undefined : location,
    });
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [category, location]);

  const handlePostClick = () => {
    if (!user) {
      router.push("?auth=true&redirect=/networking");
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="scan-line" />

      <Suspense fallback={null}>
        <AuthModalWrapper />
      </Suspense>

      <Navbar />

      <main className="page-content pt-24 min-h-screen flex flex-col bg-[#050505] relative">
        <NeonInstrumentsBg variant="D" />
        <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />

        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 relative z-10">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors font-space text-sm mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-4">
              Music Industry <span className="text-[#00D4FF]">Networking</span>
            </h1>
            <p className="font-space text-white/50 text-lg max-w-2xl mb-8">
              Real opportunities from real music companies. Find session work, tours, collaborations, and more.
            </p>
            
            <button 
              onClick={handlePostClick}
              className="group relative flex items-center gap-3 px-8 py-4 text-sm md:text-base font-orbitron font-bold text-black bg-[#00D4FF] rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-white shadow-[0_0_20px_rgba(0,212,255,0.5)] hover:shadow-[0_0_40px_rgba(0,212,255,0.8)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              <Plus size={20} className="transition-transform group-hover:rotate-90 duration-300" />
              <span>POST YOUR REQUIREMENT / SELL ITEM</span>
            </button>
          </motion.div>

          {/* Filters */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-4 md:p-6 mb-12 flex flex-col md:flex-row gap-6">
            <div className="flex items-center gap-3 mb-2 md:mb-0">
              <Filter className="text-[#00D4FF]" size={20} />
              <span className="font-space font-bold text-white uppercase tracking-wider">Filters</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1">
                <label className="block text-xs font-space text-white/50 uppercase tracking-wider mb-2">Category</label>
                <div className="flex bg-[#0a0a0a] border border-white/10 rounded-lg p-1">
                  <button
                    onClick={() => setCategory("all")}
                    className={`flex-1 py-2 px-4 rounded text-sm font-space font-bold transition-colors ${category === "all" ? "bg-[#00D4FF] text-black" : "text-white/50 hover:text-white"}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setCategory("job")}
                    className={`flex-1 py-2 px-4 rounded text-sm font-space font-bold transition-colors ${category === "job" ? "bg-[#00D4FF] text-black" : "text-white/50 hover:text-white"}`}
                  >
                    Jobs
                  </button>
                  <button
                    onClick={() => setCategory("item")}
                    className={`flex-1 py-2 px-4 rounded text-sm font-space font-bold transition-colors ${category === "item" ? "bg-[#00D4FF] text-black" : "text-white/50 hover:text-white"}`}
                  >
                    Items
                  </button>
                </div>
              </div>
              
              <div className="flex-1">
                <label className="block text-xs font-space text-white/50 uppercase tracking-wider mb-2">Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white font-space focus:outline-none focus:border-[#00D4FF] appearance-none"
                >
                  {SRI_LANKA_DISTRICTS.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center py-20">
                <div className="w-10 h-10 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : posts.length > 0 ? (
              posts.map((post, i) => (
                <NetworkingCard 
                  key={post.id} 
                  post={post} 
                  index={i} 
                  onUpdate={fetchPosts} 
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
                <Search size={40} className="mx-auto text-white/20 mb-4" />
                <h3 className="font-space font-bold text-xl text-white mb-2">No opportunities found</h3>
                <p className="font-space text-white/50">
                  Try adjusting your filters or check back later.
                </p>
              </div>
            )}
          </div>
        </div>

        <FooterSection />
        
        <PostNetworkingModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchPosts}
        />
      </main>
    </>
  );
}

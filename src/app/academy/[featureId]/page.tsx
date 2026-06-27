"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, Play, Video as VideoIcon, ChevronDown, ChevronUp, X } from "lucide-react";
import { getAcademyFeatureById, getAcademyModules, AcademyFeature, AcademyModule, AcademyLesson, LiveClass } from "@/lib/academy";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/ui/Navbar";
import FooterSection from "@/components/sections/FooterSection";
import "plyr/dist/plyr.css";

export default function AcademyFeaturePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const featureId = params.featureId as string;

  const [feature, setFeature] = useState<AcademyFeature | null>(null);
  const [modules, setModules] = useState<AcademyModule[]>([]);
  const [loading, setLoading] = useState(true);

  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<AcademyLesson | null>(null);
  
  // Live Classes state
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [activeClass, setActiveClass] = useState<LiveClass | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const featData = await getAcademyFeatureById(featureId);
      setFeature(featData);
      
      if (featData) {
        const isLive = featData.id === "af-2" || featData.title.toLowerCase().includes("live class");
        if (isLive) {
          const { getLiveClasses } = await import("@/lib/academy");
          const classesData = await getLiveClasses(featureId);
          setLiveClasses(classesData);
        } else {
          const modsData = await getAcademyModules(featureId);
          setModules(modsData);
          if (modsData.length > 0) {
            setExpandedModuleId(modsData[0].id!);
          }
        }
      }
      setLoading(false);
    };

    if (featureId) fetchData();
  }, [featureId]);

  // Helper to extract video details
  const getVideoDetails = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0];
      } else if (url.includes("youtube.com/watch?v=")) {
        videoId = url.split("v=")[1]?.split("&")[0];
      }
      return { provider: "youtube" as const, id: videoId };
    }
    
    if (url.includes("vimeo.com")) {
      const vimeoId = url.split("vimeo.com/")[1]?.split("?")[0];
      return { provider: "vimeo" as const, id: vimeoId };
    }

    return { provider: "html5" as const, id: url };
  };

  useEffect(() => {
    let player: any;
    
    if (activeVideo) {
      // Dynamic import to avoid SSR issues
      import("plyr").then((module) => {
        const Plyr = module.default;
        player = new Plyr("#plyr-player", {
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "settings",
            "fullscreen"
          ],
          youtube: {
            noCookie: true,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            modestbranding: 1
          }
        });

        // Anti-piracy fullscreen watermark injection helper
        player.on("ready", () => {
          const container = document.querySelector(".plyr");
          const watermark = document.getElementById("video-watermark");
          if (container && watermark) {
            container.appendChild(watermark);
          }
        });
      });
    }

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [activeVideo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-[#00D4FF]" />
      </div>
    );
  }

  if (!feature) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white/50 space-y-4">
        <p>Content not found.</p>
        <button onClick={() => router.push("/")} className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/10 selection:text-white">
      <Navbar />

      {/* Header section */}
      <section className="pt-32 pb-16 relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/80 to-black z-0" />
        <div 
          className="absolute inset-0 opacity-10 blur-3xl z-0"
          style={{ background: `radial-gradient(circle at 50% 0%, ${feature.color}, transparent 60%)` }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button
            onClick={() => router.push("/#academy")}
            className="flex items-center gap-2 text-xs font-space text-white/50 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={14} /> Back to Academy
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: `${feature.color}15`, border: `1px solid ${feature.color}30`, boxShadow: `0 0 30px ${feature.color}30` }}
            >
              {feature.icon}
            </div>
            <div>
              <h1 className="font-orbitron font-black text-4xl md:text-5xl">{feature.title}</h1>
            </div>
          </div>
          
          <p className="font-space text-white/60 max-w-2xl text-lg leading-relaxed">
            {feature.description}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(feature.id === "af-2" || feature.title.toLowerCase().includes("live class")) ? (
          liveClasses.length === 0 ? (
            <div className="text-center py-24 border border-white/5 rounded-2xl border-dashed">
              <VideoIcon size={48} className="mx-auto text-white/10 mb-4" style={{ color: feature.color }} />
              <h3 className="font-orbitron text-xl text-white/50 mb-2">No live classes scheduled</h3>
              <p className="font-space text-white/30">Check back later for upcoming live sessions.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {liveClasses.map((lc, index) => (
                <motion.div
                  key={lc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-6 flex flex-col justify-between hover:border-white/20 transition-all group relative"
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${feature.color}10, transparent 70%)` }}
                  />

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <span 
                        className="font-orbitron font-bold text-[10px] uppercase px-2.5 py-1 rounded tracking-wider"
                        style={{ color: feature.color, background: `${feature.color}15`, border: `1px solid ${feature.color}20` }}
                      >
                        {lc.grade || "All Levels"}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    </div>

                    <div>
                      <h3 className="font-space font-bold text-xl text-white group-hover:text-white transition-colors line-clamp-1">{lc.className}</h3>
                      <p className="font-space text-xs text-white/50 mt-2 line-clamp-3 leading-relaxed">{lc.description}</p>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-white/5 text-sm font-space text-white/70">
                      <div className="flex items-center gap-2">
                        <span className="text-white/40 text-xs uppercase">Date:</span>
                        <span className="font-bold">{lc.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/40 text-xs uppercase">Time:</span>
                        <span className="font-bold text-white">{lc.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex gap-3 relative z-10">
                    <button
                      onClick={() => setActiveClass(lc)}
                      className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-space text-xs font-bold transition-all border border-white/10 text-center"
                    >
                      View Details
                    </button>
                    <a
                      href={lc.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 rounded-xl font-space text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                      style={{ 
                        background: `${feature.color}20`, 
                        color: "white", 
                        border: `1px solid ${feature.color}40`,
                        boxShadow: `0 0 15px ${feature.color}10`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = feature.color;
                        e.currentTarget.style.color = "black";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = `${feature.color}20`;
                        e.currentTarget.style.color = "white";
                      }}
                    >
                      Join Class
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          modules.length === 0 ? (
            <div className="text-center py-24 border border-white/5 rounded-2xl border-dashed">
              <VideoIcon size={48} className="mx-auto text-white/10 mb-4" />
              <h3 className="font-orbitron text-xl text-white/50 mb-2">No content available yet</h3>
              <p className="font-space text-white/30">Check back later for new modules in {feature.title}.</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {modules.map((mod, index) => {
                const isExpanded = expandedModuleId === mod.id;
                
                return (
                  <motion.div 
                    key={mod.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                  >
                    {/* Module Header (Clickable) */}
                    <div 
                      onClick={() => setExpandedModuleId(isExpanded ? null : mod.id!)}
                      className="relative p-6 cursor-pointer group flex flex-col md:flex-row gap-6 items-start md:items-center"
                    >
                      {/* Hover Glow */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{ background: `linear-gradient(to right, ${feature.color}05, transparent)` }}
                      />
  
                      <div className="w-full md:w-64 aspect-video rounded-xl overflow-hidden shrink-0 border border-white/10 relative">
                        {mod.bannerImage ? (
                          <img src={mod.bannerImage} alt={mod.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-black/50 flex items-center justify-center">
                            <VideoIcon className="text-white/20" size={32} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                      </div>
  
                      <div className="flex-1 relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                          <span 
                            className="font-orbitron font-bold text-[10px] uppercase px-2 py-1 rounded"
                            style={{ color: feature.color, background: `${feature.color}15` }}
                          >
                            Module {index + 1}
                          </span>
                          <span className="font-space text-xs text-white/40">
                            {mod.lessons.length} Lesson{mod.lessons.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <h2 className="font-space font-bold text-2xl text-white mb-2">{mod.title}</h2>
                        <p className="font-space text-sm text-white/50 line-clamp-2">{mod.description}</p>
                      </div>
  
                      <div className="hidden md:flex shrink-0 w-10 h-10 rounded-full bg-white/5 items-center justify-center text-white/50 group-hover:text-white transition-colors">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
  
                    {/* Lessons List (Accordion Content) */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-black/40 border-t border-white/5"
                        >
                          <div className="p-6 space-y-3">
                            {mod.lessons.map((lesson, lIndex) => (
                              <button
                                key={lesson.id}
                                onClick={() => setActiveVideo(lesson)}
                                className="w-full text-left p-4 rounded-xl border border-white/5 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all group flex items-center gap-4"
                              >
                                <div 
                                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors"
                                  style={{ background: `${feature.color}15`, color: feature.color }}
                                >
                                  <Play size={16} className="ml-1 group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-space font-bold text-white mb-1">
                                    {lIndex + 1}. {lesson.name}
                                  </h4>
                                  {lesson.description && (
                                    <p className="font-space text-xs text-white/40">{lesson.description}</p>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )
        )}
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-5xl bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
              style={{ 
                "--plyr-color-main": feature.color,
                "--plyr-video-background": "black"
              } as React.CSSProperties}
            >
              <div className="aspect-video bg-black w-full relative overflow-hidden pointer-events-auto">
                {getVideoDetails(activeVideo.videoLink).provider === "html5" ? (
                  <video id="plyr-player" playsInline controls className="w-full h-full">
                    <source src={getVideoDetails(activeVideo.videoLink).id} type="video/mp4" />
                  </video>
                ) : (
                  <div 
                    key={activeVideo.id}
                    id="plyr-player" 
                    data-plyr-provider={getVideoDetails(activeVideo.videoLink).provider} 
                    data-plyr-embed-id={getVideoDetails(activeVideo.videoLink).id}
                  />
                )}
                
                {/* Anti-piracy Watermark */}
                {user && (
                  <motion.div
                    id="video-watermark"
                    className="absolute z-50 pointer-events-none whitespace-nowrap opacity-[0.15] text-white font-space text-lg md:text-2xl font-bold tracking-widest drop-shadow-lg"
                    animate={{
                      left: ["10%", "60%", "20%", "70%", "10%"],
                      top: ["10%", "70%", "20%", "80%", "10%"],
                    }}
                    transition={{
                      duration: 25,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    {user.email || user.displayName || "Student User"}
                  </motion.div>
                )}
              </div>
              <div className="p-6 border-t border-white/5 bg-[#0a0a0a]">
                <h3 className="font-space font-bold text-xl text-white mb-2">{activeVideo.name}</h3>
                {activeVideo.description && (
                  <p className="font-space text-sm text-white/50">{activeVideo.description}</p>
                )}
                <button
                  onClick={() => setActiveVideo(null)}
                  className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-space text-sm rounded-lg transition-colors"
                >
                  Close Player
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Live Class Details Modal */}
      <AnimatePresence>
        {activeClass && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveClass(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg glass-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-6"
            >
              <div className="absolute top-0 left-0 w-full h-[2px]" style={{ backgroundColor: feature.color, boxShadow: `0 0 10px ${feature.color}` }} />

              <div className="flex justify-between items-start mb-6">
                <div>
                  <span 
                    className="font-orbitron font-bold text-[9px] uppercase px-2 py-0.5 rounded tracking-widest mb-2 inline-block"
                    style={{ color: feature.color, background: `${feature.color}15`, border: `1px solid ${feature.color}20` }}
                  >
                    {activeClass.grade || "All Levels"}
                  </span>
                  <h3 className="font-space font-black text-2xl text-white">{activeClass.className}</h3>
                </div>
                <button
                  onClick={() => setActiveClass(null)}
                  className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white/2 rounded-xl border border-white/5 space-y-3 font-space text-sm text-white/80">
                  <div className="flex justify-between">
                    <span className="text-white/40">Scheduled Date:</span>
                    <span className="font-bold text-white">{activeClass.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Scheduled Time:</span>
                    <span className="font-bold text-white">{activeClass.time}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-orbitron font-bold text-white/40 uppercase tracking-widest">Class Description</h4>
                  <p className="font-space text-sm text-white/70 leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5 max-h-40 overflow-y-auto">
                    {activeClass.description || "No description provided for this live class."}
                  </p>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => setActiveClass(null)}
                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-space text-sm font-bold transition-colors border border-white/5"
                  >
                    Close
                  </button>
                  <a
                    href={activeClass.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 rounded-xl font-space text-sm font-bold text-center flex items-center justify-center gap-2"
                    style={{ 
                      backgroundColor: feature.color, 
                      color: "black",
                      boxShadow: `0 0 20px ${feature.color}30`
                    }}
                  >
                    Join Session Now
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <FooterSection />
    </main>
  );
}

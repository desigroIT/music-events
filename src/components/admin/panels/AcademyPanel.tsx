import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, AlertCircle, RefreshCw, BarChart2, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AcademyFeature, 
  AcademyStat, 
  getAcademyFeatures, 
  getAcademyStats, 
  deleteAcademyFeature, 
  deleteAcademyStat,
  createAcademyFeature,
  createAcademyStat
} from "@/lib/academy";
import AcademyFeatureModal from "@/components/modals/AcademyFeatureModal";
import AcademyStatModal from "@/components/modals/AcademyStatModal";
import AcademyModuleModal from "@/components/modals/AcademyModuleModal";
import { academyFeatures as dummyFeatures, academyStats as dummyStats } from "@/data/dummy";
import { AcademyModule, getAcademyModules, deleteAcademyModule, createAcademyModule } from "@/lib/academy";
import { 
  LiveClass, 
  getLiveClasses, 
  createLiveClass, 
  updateLiveClass, 
  deleteLiveClass 
} from "@/lib/academy";
import { ArrowLeft, Video, ListVideo } from "lucide-react";
import LiveClassModal from "@/components/modals/LiveClassModal";

export default function AcademyPanel() {
  const [features, setFeatures] = useState<AcademyFeature[]>([]);
  const [stats, setStats] = useState<AcademyStat[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  
  const [editingFeature, setEditingFeature] = useState<AcademyFeature | null>(null);
  const [editingStat, setEditingStat] = useState<AcademyStat | null>(null);
  
  const [isSeeding, setIsSeeding] = useState(false);

  // Nested Modules View State
  const [selectedFeature, setSelectedFeature] = useState<AcademyFeature | null>(null);
  const [modules, setModules] = useState<AcademyModule[]>([]);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<AcademyModule[] | any>(null);
  const [loadingModules, setLoadingModules] = useState(false);

  // Live Classes View State
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [isLiveClassModalOpen, setIsLiveClassModalOpen] = useState(false);
  const [editingLiveClass, setEditingLiveClass] = useState<LiveClass | null>(null);
  const [loadingLiveClasses, setLoadingLiveClasses] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [featuresData, statsData] = await Promise.all([
      getAcademyFeatures(),
      getAcademyStats()
    ]);
    setFeatures(featuresData);
    setStats(statsData);
    setLoading(false);
  };

  const handleSeedData = async () => {
    if (!window.confirm("This will add default dummy data to your database. Continue?")) return;
    
    setIsSeeding(true);
    try {
      // Seed features
      for (const feat of dummyFeatures) {
        await createAcademyFeature({
          icon: feat.icon,
          title: feat.title,
          description: feat.description,
          color: feat.color,
          stats: feat.stats,
          order: 0,
        });
      }
      // Seed stats
      for (const stat of dummyStats) {
        await createAcademyStat({
          value: stat.value,
          label: stat.label,
          order: 0,
        });
      }
      await loadData();
    } catch (error) {
      console.error("Error seeding data", error);
      alert("Failed to seed data");
    } finally {
      setIsSeeding(false);
    }
  };

  // --- Features Handlers ---

  const handleEditFeature = (feat: AcademyFeature) => {
    setEditingFeature(feat);
    setIsFeatureModalOpen(true);
  };

  const handleDeleteFeature = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this feature?")) {
      const success = await deleteAcademyFeature(id);
      if (success) {
        setFeatures(features.filter((f) => f.id !== id));
      }
    }
  };

  // --- Stats Handlers ---

  const handleEditStat = (stat: AcademyStat) => {
    setEditingStat(stat);
    setIsStatModalOpen(true);
  };

  const handleDeleteStat = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this stat?")) {
      const success = await deleteAcademyStat(id);
      if (success) {
        setStats(stats.filter((s) => s.id !== id));
      }
    }
  };

  // --- Modules Handlers ---

  const handleManageContent = async (feat: AcademyFeature) => {
    setSelectedFeature(feat);
    const isLive = feat.id === "af-2" || feat.title.toLowerCase().includes("live class");
    
    if (isLive) {
      setLoadingLiveClasses(true);
      const data = await getLiveClasses(feat.id!);
      setLiveClasses(data);
      setLoadingLiveClasses(false);
    } else {
      setLoadingModules(true);
      const data = await getAcademyModules(feat.id!);
      setModules(data);
      setLoadingModules(false);
    }
  };

  const handleEditModule = (mod: AcademyModule) => {
    setEditingModule(mod);
    setIsModuleModalOpen(true);
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!selectedFeature?.id) return;
    if (window.confirm("Are you sure you want to delete this module and all its lessons?")) {
      const success = await deleteAcademyModule(selectedFeature.id, moduleId);
      if (success) {
        setModules(modules.filter((m) => m.id !== moduleId));
      }
    }
  };

  // --- Live Classes Handlers ---

  const handleEditLiveClass = (lc: LiveClass) => {
    setEditingLiveClass(lc);
    setIsLiveClassModalOpen(true);
  };

  const handleDeleteLiveClass = async (classId: string) => {
    if (!selectedFeature?.id) return;
    if (window.confirm("Are you sure you want to delete this live class?")) {
      const success = await deleteLiveClass(selectedFeature.id, classId);
      if (success) {
        setLiveClasses(liveClasses.filter((c) => c.id !== classId));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-[#00D4FF]" />
      </div>
    );
  }

  if (selectedFeature) {
    const isLive = selectedFeature.id === "af-2" || selectedFeature.title.toLowerCase().includes("live class");

    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/2 p-4 rounded-xl border border-white/5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedFeature(null)}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h3 className="font-space text-white/50 text-sm flex items-center gap-2">
                Manage Content <span className="text-white/20">/</span> <span style={{ color: selectedFeature.color }}>{selectedFeature.title}</span>
              </h3>
              <p className="text-xs text-white/30 font-space mt-0.5">
                {isLive ? "Schedule and manage live classes" : "Create modules and video lessons"}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => {
              if (isLive) {
                setEditingLiveClass(null);
                setIsLiveClassModalOpen(true);
              } else {
                setEditingModule(null);
                setIsModuleModalOpen(true);
              }
            }}
            className="px-4 py-2 bg-[#00D4FF]/10 text-[#00D4FF] hover:bg-[#00D4FF]/20 text-xs font-space font-bold rounded-lg transition-all border border-[#00D4FF]/20 flex items-center gap-2"
          >
            <Plus size={14} /> {isLive ? "Add Live Class" : "Create Content Module"}
          </button>
        </div>

        {isLive ? (
          loadingLiveClasses ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 size={24} className="animate-spin text-[#00D4FF]" />
            </div>
          ) : liveClasses.length === 0 ? (
            <div className="text-center py-16 border border-white/5 rounded-xl border-dashed">
              <Video size={32} className="mx-auto text-white/20 mb-3" />
              <p className="font-space text-sm text-white/40 mb-1">No live classes scheduled for {selectedFeature.title}.</p>
              <p className="font-space text-xs text-white/30">Click "Add Live Class" to schedule one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveClasses.map((lc) => (
                <div key={lc.id} className="glass-card border border-white/5 rounded-2xl overflow-hidden group p-6 flex flex-col justify-between relative">
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditLiveClass(lc)} className="p-2 bg-black/60 hover:bg-black text-white/70 hover:text-white rounded-lg backdrop-blur border border-white/10">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDeleteLiveClass(lc.id!)} className="p-2 bg-black/60 hover:bg-black text-white/70 hover:text-red-400 rounded-lg backdrop-blur border border-white/10">
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-orbitron font-bold px-2.5 py-1 rounded bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 uppercase">
                        {lc.grade || "All Levels"}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-space font-bold text-lg text-white group-hover:text-[#00D4FF] transition-colors line-clamp-1">{lc.className}</h3>
                      <p className="font-space text-xs text-white/40 mt-1 line-clamp-3 leading-relaxed">{lc.description}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/5 text-xs font-space text-white/60">
                      <div className="flex items-center gap-2">
                        <span className="text-white/40">Date:</span>
                        <span>{lc.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/40">Time:</span>
                        <span>{lc.time}</span>
                      </div>
                      <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                        <span className="text-white/40">Link:</span>
                        <a href={lc.meetLink} target="_blank" rel="noopener noreferrer" className="text-[#00D4FF] hover:underline truncate">
                          {lc.meetLink}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          loadingModules ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 size={24} className="animate-spin text-[#00D4FF]" />
            </div>
          ) : modules.length === 0 ? (
            <div className="text-center py-16 border border-white/5 rounded-xl border-dashed">
              <ListVideo size={32} className="mx-auto text-white/20 mb-3" />
              <p className="font-space text-sm text-white/40 mb-1">No modules found for {selectedFeature.title}.</p>
              <p className="font-space text-xs text-white/30">Click "Create Content Module" to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {modules.map((mod) => (
                <div key={mod.id} className="glass-card border border-white/5 rounded-2xl overflow-hidden group">
                  <div className="h-40 w-full relative">
                    {mod.bannerImage ? (
                      <img src={mod.bannerImage} alt={mod.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-black/50 flex items-center justify-center">
                        <Video className="text-white/20" size={32} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditModule(mod)} className="p-2 bg-black/60 hover:bg-black text-white/70 hover:text-white rounded-lg backdrop-blur border border-white/10">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDeleteModule(mod.id!)} className="p-2 bg-black/60 hover:bg-black text-white/70 hover:text-red-400 rounded-lg backdrop-blur border border-white/10">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-4">
                      <span className="text-[10px] font-orbitron font-bold px-2 py-1 rounded bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/30">
                        {mod.lessons.length} Lesson{mod.lessons.length !== 1 && 's'}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-space font-bold text-lg text-white mb-2">{mod.title}</h3>
                    <p className="font-space text-xs text-white/40 line-clamp-2 leading-relaxed">{mod.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
  
        <AcademyModuleModal
          isOpen={isModuleModalOpen}
          onClose={() => setIsModuleModalOpen(false)}
          initialData={editingModule}
          onSave={async (data) => {
            if (editingModule?.id) {
              await import("@/lib/academy").then(m => m.updateAcademyModule(selectedFeature.id!, editingModule.id!, data));
            } else {
              await createAcademyModule(selectedFeature.id!, data);
            }
            // Reload
            const updated = await getAcademyModules(selectedFeature.id!);
            setModules(updated);
          }}
        />

        <LiveClassModal
          isOpen={isLiveClassModalOpen}
          onClose={() => setIsLiveClassModalOpen(false)}
          initialData={editingLiveClass}
          onSave={async (data) => {
            if (editingLiveClass?.id) {
              await updateLiveClass(selectedFeature.id!, editingLiveClass.id!, data);
            } else {
              await createLiveClass(selectedFeature.id!, data);
            }
            // Reload
            const updated = await getLiveClasses(selectedFeature.id!);
            setLiveClasses(updated);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/2 p-4 rounded-xl border border-white/5">
        <div>
          <h3 className="font-space text-white/50 text-sm">
            Manage Academy Section
          </h3>
          <p className="text-xs text-white/30 font-space mt-0.5">Edit stats and feature cards</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2 text-white/40 hover:text-white bg-white/5 rounded-lg transition-colors border border-white/5"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          
          {(features.length === 0 && stats.length === 0) && (
            <button
              onClick={handleSeedData}
              disabled={isSeeding}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-space rounded-lg transition-all border border-white/10 flex items-center gap-2"
            >
              {isSeeding ? <Loader2 size={14} className="animate-spin" /> : null}
              {isSeeding ? "Seeding..." : "Seed Default Data"}
            </button>
          )}
        </div>
      </div>

      {/* --- STATS SECTION --- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-orbitron font-bold text-lg text-white flex items-center gap-2">
            <BarChart2 size={18} className="text-[#00D4FF]" /> Top Statistics
          </h2>
          <button
            onClick={() => {
              setEditingStat(null);
              setIsStatModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#00D4FF]/10 text-[#00D4FF] rounded-lg font-space text-xs font-bold hover:bg-[#00D4FF]/20 transition-all border border-[#00D4FF]/20"
          >
            <Plus size={14} /> Add Stat
          </button>
        </div>

        {stats.length === 0 ? (
          <div className="text-center py-8 border border-white/5 rounded-xl border-dashed">
            <AlertCircle size={24} className="mx-auto text-white/20 mb-2" />
            <p className="font-space text-sm text-white/40">No stats found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="glass-card-blue p-5 text-center border border-[#00D4FF]/10 relative group"
              >
                {/* Actions overlay */}
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 rounded-md p-1 border border-white/10 z-10">
                  <button onClick={() => handleEditStat(stat)} className="p-1.5 text-white/40 hover:text-white">
                    <Edit2 size={12} />
                  </button>
                  <button onClick={() => handleDeleteStat(stat.id!)} className="p-1.5 text-white/40 hover:text-red-400">
                    <Trash2 size={12} />
                  </button>
                </div>

                <div className="font-orbitron font-black text-2xl md:text-3xl text-neon-blue mb-1">
                  {stat.value}
                </div>
                <div className="font-space text-xs text-white/40 tracking-widest uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full h-px bg-white/5" />

      {/* --- FEATURES SECTION --- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-orbitron font-bold text-lg text-white flex items-center gap-2">
            <BookOpen size={18} className="text-[#00D4FF]" /> Feature Cards
          </h2>
          <button
            onClick={() => {
              setEditingFeature(null);
              setIsFeatureModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#00D4FF]/10 text-[#00D4FF] rounded-lg font-space text-xs font-bold hover:bg-[#00D4FF]/20 transition-all border border-[#00D4FF]/20"
          >
            <Plus size={14} /> Add Feature
          </button>
        </div>

        {features.length === 0 ? (
          <div className="text-center py-12 border border-white/5 rounded-xl border-dashed">
            <AlertCircle size={24} className="mx-auto text-white/20 mb-2" />
            <p className="font-space text-sm text-white/40">No feature cards found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => (
              <div
                key={feat.id}
                className="glass-card p-6 border border-white/5 relative group hover:border-white/10 transition-colors"
              >
                {/* Actions overlay */}
                <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 rounded-md p-1 border border-white/10 z-10">
                  <button onClick={() => handleEditFeature(feat)} className="p-1.5 text-white/40 hover:text-white">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDeleteFeature(feat.id!)} className="p-1.5 text-white/40 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
                  style={{
                    background: `${feat.color}15`,
                    border: `1px solid ${feat.color}30`,
                    boxShadow: `0 0 20px ${feat.color}20`,
                  }}
                >
                  {feat.icon}
                </div>

                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-space font-bold text-white pr-10">{feat.title}</h3>
                </div>
                
                <span
                  className="inline-block font-orbitron text-[10px] font-bold px-2 py-0.5 rounded mb-3"
                  style={{ color: feat.color, background: `${feat.color}15` }}
                >
                  {feat.stats}
                </span>

                <p className="font-space text-xs text-white/40 leading-relaxed line-clamp-3 mb-6">
                  {feat.description}
                </p>

                <button
                  onClick={() => handleManageContent(feat)}
                  className="w-full py-2.5 rounded-lg font-space text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/5 hover:border-white/20"
                  style={{ color: feat.color, background: `${feat.color}05` }}
                >
                  <ListVideo size={14} /> Manage Content
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AcademyFeatureModal
        isOpen={isFeatureModalOpen}
        onClose={() => setIsFeatureModalOpen(false)}
        initialData={editingFeature}
        onSave={async (data) => {
          if (editingFeature?.id) {
            // Update via utility (not strictly necessary to await here if we just reload, but good practice)
            await import("@/lib/academy").then(m => m.updateAcademyFeature(editingFeature.id!, data));
          } else {
            await createAcademyFeature(data);
          }
          await loadData();
        }}
      />
      
      <AcademyStatModal
        isOpen={isStatModalOpen}
        onClose={() => setIsStatModalOpen(false)}
        initialData={editingStat}
        onSave={async (data) => {
          if (editingStat?.id) {
            await import("@/lib/academy").then(m => m.updateAcademyStat(editingStat.id!, data));
          } else {
            await createAcademyStat(data);
          }
          await loadData();
        }}
      />
    </div>
  );
}

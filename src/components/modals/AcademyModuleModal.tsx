import { useState, useEffect } from "react";
import { X, Save, Type, FileText, Image as ImageIcon, Video, Plus, Trash2, GripVertical, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AcademyModule, AcademyLesson } from "@/lib/academy";

interface AcademyModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<AcademyModule, "id" | "featureId" | "createdAt" | "updatedAt">) => Promise<void>;
  initialData?: AcademyModule | null;
}

export default function AcademyModuleModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AcademyModuleModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [lessons, setLessons] = useState<AcademyLesson[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setBannerImage(initialData.bannerImage || "");
      setLessons(initialData.lessons || []);
    } else {
      // Reset form
      setTitle("");
      setDescription("");
      setBannerImage("");
      setLessons([]);
    }
  }, [initialData, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "drum_platform";
      formData.append("upload_preset", uploadPreset); 

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        setBannerImage(data.secure_url);
        setError(null);
      } else {
        throw new Error(data.error?.message || "Failed to upload image.");
      }
    } catch (err: any) {
      console.error("Error uploading image:", err);
      setError(err.message || "Failed to upload image. Please check your Cloudinary config.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddLesson = () => {
    const newId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : Date.now().toString() + Math.random().toString(36).substring(2);
      
    setLessons([
      ...lessons,
      { id: newId, name: "", description: "", videoLink: "" }
    ]);
  };

  const handleUpdateLesson = (id: string, field: keyof AcademyLesson, value: string) => {
    setLessons(lessons.map(lesson => 
      lesson.id === id ? { ...lesson, [field]: value } : lesson
    ));
  };

  const handleDeleteLesson = (id: string) => {
    setLessons(lessons.filter(lesson => lesson.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title || !description || !bannerImage) {
      setError("Please fill in all required fields (Title, Description, Banner Image).");
      return;
    }

    // Validate lessons
    const emptyLesson = lessons.find(l => !l.name || !l.videoLink);
    if (emptyLesson) {
      setError("Please ensure all lessons have a name and a video link.");
      return;
    }

    setIsSubmitting(true);
    await onSave({
      title,
      description,
      bannerImage,
      lessons,
    });
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] glass-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5 shrink-0">
            <h2 className="font-orbitron font-bold text-xl text-white">
              {initialData ? "Edit Module" : "Create Content Module"}
            </h2>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            <form id="moduleForm" onSubmit={handleSubmit} className="space-y-8">
              
              {/* --- Basic Info --- */}
              <div className="space-y-5">
                <h3 className="font-orbitron font-bold text-[#00D4FF] border-b border-white/5 pb-2">Basic Info</h3>
                
                <div className="space-y-2">
                  <label className="text-xs font-space text-white/50 uppercase tracking-wider flex items-center gap-2">
                    <Type size={14} /> Module Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Master the Drum Basics"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-space text-sm focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-space text-white/50 uppercase tracking-wider flex items-center gap-2">
                    <FileText size={14} /> Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What will students learn in this module?"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-space text-sm focus:outline-none focus:border-[#00D4FF]/50 transition-colors min-h-[100px]"
                    required
                  />
                </div>

                {/* Banner Image */}
                <div className="space-y-2">
                  <label className="text-xs font-space text-white/50 uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon size={14} /> Banner Image
                  </label>
                  
                  {bannerImage ? (
                    <div className="relative rounded-xl overflow-hidden group aspect-video max-h-64 border border-white/10 bg-black">
                      <img src={bannerImage} alt="Banner Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-space rounded-lg transition-all border border-white/20">
                          {isUploading ? "Uploading..." : "Change Image"}
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl hover:border-[#00D4FF]/50 hover:bg-[#00D4FF]/5 transition-all cursor-pointer">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isUploading ? (
                          <Loader2 size={24} className="animate-spin text-white/50 mb-2" />
                        ) : (
                          <ImageIcon size={24} className="text-white/30 mb-2" />
                        )}
                        <p className="font-space text-xs text-white/50">
                          {isUploading ? "Uploading to Cloudinary..." : "Click to upload banner image"}
                        </p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                    </label>
                  )}
                </div>
              </div>

              {/* --- Lessons --- */}
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h3 className="font-orbitron font-bold text-[#00FF85]">Lessons List</h3>
                  <button
                    type="button"
                    onClick={handleAddLesson}
                    className="flex items-center gap-2 text-xs font-space font-bold text-[#00FF85] bg-[#00FF85]/10 px-3 py-1.5 rounded-lg hover:bg-[#00FF85]/20 transition-colors"
                  >
                    <Plus size={14} /> Add Lesson
                  </button>
                </div>

                {lessons.length === 0 ? (
                  <div className="text-center py-8 border border-white/5 rounded-xl border-dashed">
                    <Video size={24} className="mx-auto text-white/20 mb-2" />
                    <p className="font-space text-sm text-white/40">No lessons added yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lessons.map((lesson, index) => (
                      <div key={lesson.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-4">
                        <div className="pt-3 text-white/20 cursor-grab active:cursor-grabbing">
                          <GripVertical size={20} />
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-space text-white/40 uppercase tracking-wider mb-1 block">Lesson Name</label>
                              <input
                                type="text"
                                value={lesson.name}
                                onChange={(e) => handleUpdateLesson(lesson.id, "name", e.target.value)}
                                placeholder={`Lesson ${index + 1}`}
                                className="w-full bg-black/30 border border-white/5 rounded-lg px-3 py-2 text-white font-space text-sm focus:outline-none focus:border-[#00FF85]/50 transition-colors"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-space text-white/40 uppercase tracking-wider mb-1 block">Video Link (YouTube/Vimeo)</label>
                              <input
                                type="url"
                                value={lesson.videoLink}
                                onChange={(e) => handleUpdateLesson(lesson.id, "videoLink", e.target.value)}
                                placeholder="https://..."
                                className="w-full bg-black/30 border border-white/5 rounded-lg px-3 py-2 text-white font-space text-sm focus:outline-none focus:border-[#00FF85]/50 transition-colors"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-space text-white/40 uppercase tracking-wider mb-1 block">Short Description</label>
                            <input
                              type="text"
                              value={lesson.description}
                              onChange={(e) => handleUpdateLesson(lesson.id, "description", e.target.value)}
                              placeholder="Brief overview of the lesson..."
                              className="w-full bg-black/30 border border-white/5 rounded-lg px-3 py-2 text-white font-space text-sm focus:outline-none focus:border-[#00FF85]/50 transition-colors"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteLesson(lesson.id)}
                          className="text-white/20 hover:text-red-500 transition-colors p-2 h-fit"
                          title="Remove Lesson"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </form>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/5 bg-black/40 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg font-space text-xs text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="moduleForm"
              disabled={isSubmitting || isUploading}
              className="px-6 py-2.5 bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-space text-xs font-bold rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Save size={16} />
              {isSubmitting ? "Saving..." : "Save Module"}
            </button>
          </div>

          {/* Central Error Modal Overlay */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 10 }}
                  className="bg-[#111] border border-red-500/30 rounded-xl p-6 max-w-sm w-full text-center shadow-2xl"
                >
                  <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
                    <X size={24} />
                  </div>
                  <h3 className="font-orbitron font-bold text-white mb-2">Oops!</h3>
                  <p className="font-space text-sm text-white/60 mb-6">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-space text-xs rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

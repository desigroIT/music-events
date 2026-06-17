"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Force dynamic rendering for this admin page
export const dynamic = 'force-dynamic';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  GripVertical,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  getCourseContent,
  saveCourseHeader,
  saveCourseCurriculum,
  saveCourseLessons,
  CourseContent,
} from "@/lib/courseContent";

type Section = "header" | "curriculum" | "lessons";

export default function CourseContentPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [activeSection, setActiveSection] = useState<Section>("header");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Header Form State
  const [headerData, setHeaderData] = useState({
    courseName: "",
    description: "",
    totalStudents: 0,
    price: 0,
    offerPrice: 0,
    offerValidPeriod: "",
    numberOfLessons: 0,
    completionTime: "",
    enableCertificate: false,
  });

  // Curriculum State
  const [curriculum, setCurriculum] = useState<
    Array<{ id: string; title: string; order: number }>
  >([]);

  // Lessons State
  const [lessons, setLessons] = useState<
    Array<{
      id: string;
      order: number;
      title: string;
      youtubeLink: string;
      description: string;
      isFree: boolean;
    }>
  >([]);

  useEffect(() => {
    loadCourseContent();
  }, [courseId]);

  const loadCourseContent = async () => {
    setLoading(true);
    const content = await getCourseContent(courseId);
    if (content) {
      setHeaderData({
        courseName: content.courseName || "",
        description: content.description || "",
        totalStudents: content.totalStudents || 0,
        price: content.price || 0,
        offerPrice: content.offerPrice || 0,
        offerValidPeriod: content.offerValidPeriod || "",
        numberOfLessons: content.numberOfLessons || 0,
        completionTime: content.completionTime || "",
        enableCertificate: content.enableCertificate || false,
      });
      // Ensure curriculum and lessons are always arrays
      setCurriculum(Array.isArray(content.curriculum) ? content.curriculum : []);
      setLessons(Array.isArray(content.lessons) ? content.lessons : []);
    }
    setLoading(false);
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Header Section Handlers
  const handleSaveHeader = async () => {
    setSaving(true);
    const success = await saveCourseHeader(courseId, headerData);
    if (success) {
      showNotification("success", "Course header saved successfully!");
    } else {
      showNotification("error", "Failed to save course header");
    }
    setSaving(false);
  };

  // Curriculum Handlers
  const handleAddCurriculumItem = () => {
    const newItem = {
      id: `curr-${Date.now()}`,
      title: "",
      order: curriculum.length + 1,
    };
    setCurriculum([...curriculum, newItem]);
  };

  const handleRemoveCurriculumItem = (id: string) => {
    setCurriculum(curriculum.filter((item) => item.id !== id));
  };

  const handleUpdateCurriculumItem = (id: string, title: string) => {
    setCurriculum(
      curriculum.map((item) => (item.id === id ? { ...item, title } : item))
    );
  };

  const handleSaveCurriculum = async () => {
    setSaving(true);
    const success = await saveCourseCurriculum(courseId, curriculum);
    if (success) {
      showNotification("success", "Course curriculum saved successfully!");
    } else {
      showNotification("error", "Failed to save curriculum");
    }
    setSaving(false);
  };

  // Lessons Handlers
  const handleAddLesson = () => {
    const newLesson = {
      id: `lesson-${Date.now()}`,
      order: lessons.length + 1,
      title: "",
      youtubeLink: "",
      description: "",
      isFree: lessons.length < 2, // First 2 lessons free by default
    };
    setLessons([...lessons, newLesson]);
  };

  const handleRemoveLesson = (id: string) => {
    setLessons(lessons.filter((lesson) => lesson.id !== id));
  };

  const handleUpdateLesson = (
    id: string,
    field: string,
    value: string | boolean
  ) => {
    setLessons(
      lessons.map((lesson) =>
        lesson.id === id ? { ...lesson, [field]: value } : lesson
      )
    );
  };

  const handleSaveLessons = async () => {
    setSaving(true);
    const success = await saveCourseLessons(courseId, lessons);
    if (success) {
      showNotification("success", "Course lessons saved successfully!");
    } else {
      showNotification("error", "Failed to save lessons");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg backdrop-blur-xl border ${
              notification.type === "success"
                ? "bg-[#00FF85]/10 border-[#00FF85]/30 text-[#00FF85]"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span className="text-sm font-space">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="border-b border-white/5 backdrop-blur-xl bg-black/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin92-studio-musicians")}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-white/60" />
            </button>
            <div>
              <h1 className="font-orbitron font-bold text-xl text-white">
                Add Course Content
              </h1>
              <p className="text-xs text-white/40 font-space mt-0.5">
                Course ID: {courseId}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {loading ? (
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Loader2 size={48} className="animate-spin text-[#FF5B00]" />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Menu */}
            <div className="lg:col-span-1">
              <div className="glass-card border border-white/5 p-4 sticky top-24">
                <h3 className="font-orbitron font-bold text-sm text-white/60 mb-4 uppercase tracking-wider">
                  Sections
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveSection("header")}
                    className={`w-full text-left px-4 py-3 rounded-lg font-space text-sm transition-all ${
                      activeSection === "header"
                        ? "bg-[#FF5B00] text-black font-bold"
                        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Course Header
                  </button>
                  <button
                    onClick={() => setActiveSection("curriculum")}
                    className={`w-full text-left px-4 py-3 rounded-lg font-space text-sm transition-all ${
                      activeSection === "curriculum"
                        ? "bg-[#FF5B00] text-black font-bold"
                        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Course Content
                  </button>
                  <button
                    onClick={() => setActiveSection("lessons")}
                    className={`w-full text-left px-4 py-3 rounded-lg font-space text-sm transition-all ${
                      activeSection === "lessons"
                        ? "bg-[#FF5B00] text-black font-bold"
                        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Lessons
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Form Content */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {/* HEADER SECTION */}
                {activeSection === "header" && (
                  <motion.div
                    key="header"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-card border border-white/5 p-6"
                  >
                    <h2 className="font-orbitron font-bold text-2xl text-white mb-6">
                      Course Header Section
                    </h2>

                    <div className="space-y-5">
                      {/* Course Name */}
                      <div>
                        <label className="block text-sm font-space text-white/70 mb-2">
                          Course Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={headerData.courseName}
                          onChange={(e) =>
                            setHeaderData({ ...headerData, courseName: e.target.value })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 transition-all font-space"
                          placeholder="e.g., Beginner Drumming Fundamentals"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-space text-white/70 mb-2">
                          Description *
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={headerData.description}
                          onChange={(e) =>
                            setHeaderData({ ...headerData, description: e.target.value })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 transition-all font-space resize-none"
                          placeholder="Master the basics of drumming from grip to your first full groove..."
                        />
                      </div>

                      {/* Price & Offer Price */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-space text-white/70 mb-2">
                            Price ($) *
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={headerData.price}
                            onChange={(e) =>
                              setHeaderData({
                                ...headerData,
                                price: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 transition-all font-space"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-space text-white/70 mb-2">
                            Offer Price ($)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={headerData.offerPrice}
                            onChange={(e) =>
                              setHeaderData({
                                ...headerData,
                                offerPrice: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 transition-all font-space"
                          />
                        </div>
                      </div>

                      {/* Offer Valid Period */}
                      <div>
                        <label className="block text-sm font-space text-white/70 mb-2">
                          Offer Valid Until
                        </label>
                        <input
                          type="date"
                          value={headerData.offerValidPeriod}
                          onChange={(e) =>
                            setHeaderData({
                              ...headerData,
                              offerValidPeriod: e.target.value,
                            })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 transition-all font-space"
                        />
                      </div>

                      {/* Number of Lessons & Completion Time */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-space text-white/70 mb-2">
                            Number of Lessons *
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={headerData.numberOfLessons}
                            onChange={(e) =>
                              setHeaderData({
                                ...headerData,
                                numberOfLessons: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 transition-all font-space"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-space text-white/70 mb-2">
                            Completion Time *
                          </label>
                          <input
                            type="text"
                            required
                            value={headerData.completionTime}
                            onChange={(e) =>
                              setHeaderData({
                                ...headerData,
                                completionTime: e.target.value,
                              })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 transition-all font-space"
                            placeholder="e.g., 8 weeks"
                          />
                        </div>
                      </div>

                      {/* Total Students */}
                      <div>
                        <label className="block text-sm font-space text-white/70 mb-2">
                          Total Students
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={headerData.totalStudents}
                          onChange={(e) =>
                            setHeaderData({
                              ...headerData,
                              totalStudents: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 transition-all font-space"
                        />
                      </div>

                      {/* Enable Certificate */}
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="enableCertificate"
                          checked={headerData.enableCertificate}
                          onChange={(e) =>
                            setHeaderData({
                              ...headerData,
                              enableCertificate: e.target.checked,
                            })
                          }
                          className="w-5 h-5 bg-white/5 border border-white/10 rounded accent-[#FF5B00]"
                        />
                        <label
                          htmlFor="enableCertificate"
                          className="text-sm font-space text-white/70 cursor-pointer"
                        >
                          Enable Certificate Upon Completion
                        </label>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={handleSaveHeader}
                        disabled={saving}
                        className="px-6 py-3 bg-gradient-to-r from-[#FF5B00] to-[#FF8C00] rounded-lg font-space font-bold text-sm text-black hover:shadow-lg hover:shadow-[#FF5B00]/30 transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {saving ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Save size={18} />
                        )}
                        Save Header
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* CURRICULUM SECTION */}
                {activeSection === "curriculum" && (
                  <motion.div
                    key="curriculum"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-card border border-white/5 p-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-orbitron font-bold text-2xl text-white">
                        Course Content
                      </h2>
                      <button
                        onClick={handleAddCurriculumItem}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center gap-2 text-sm font-space text-white"
                      >
                        <Plus size={16} />
                        Add Item
                      </button>
                    </div>

                    <div className="space-y-3 mb-8">
                      {!Array.isArray(curriculum) || curriculum.length === 0 ? (
                        <div className="text-center py-12 text-white/40 font-space text-sm">
                          No curriculum items yet. Click "Add Item" to start.
                        </div>
                      ) : (
                        curriculum.map((item, index) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-4"
                          >
                            <GripVertical size={18} className="text-white/30" />
                            <span className="text-white/40 font-space text-sm w-8">
                              {index + 1}.
                            </span>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) =>
                                handleUpdateCurriculumItem(item.id, e.target.value)
                              }
                              placeholder="e.g., Introduction to Drumming"
                              className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none font-space"
                            />
                            <button
                              onClick={() => handleRemoveCurriculumItem(item.id)}
                              className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} className="text-red-400" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveCurriculum}
                        disabled={saving}
                        className="px-6 py-3 bg-gradient-to-r from-[#FF5B00] to-[#FF8C00] rounded-lg font-space font-bold text-sm text-black hover:shadow-lg hover:shadow-[#FF5B00]/30 transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {saving ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Save size={18} />
                        )}
                        Save Curriculum
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* LESSONS SECTION */}
                {activeSection === "lessons" && (
                  <motion.div
                    key="lessons"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-card border border-white/5 p-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-orbitron font-bold text-2xl text-white">
                        Lessons
                      </h2>
                      <button
                        onClick={handleAddLesson}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center gap-2 text-sm font-space text-white"
                      >
                        <Plus size={16} />
                        Add Lesson
                      </button>
                    </div>

                    <div className="space-y-6 mb-8">
                      {!Array.isArray(lessons) || lessons.length === 0 ? (
                        <div className="text-center py-12 text-white/40 font-space text-sm">
                          No lessons yet. Click "Add Lesson" to start.
                        </div>
                      ) : (
                        lessons.map((lesson, index) => (
                          <div
                            key={lesson.id}
                            className="bg-white/5 border border-white/10 rounded-lg p-5"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <GripVertical size={18} className="text-white/30" />
                                <span className="font-orbitron font-bold text-white">
                                  Lesson {index + 1}
                                </span>
                              </div>
                              <button
                                onClick={() => handleRemoveLesson(lesson.id)}
                                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} className="text-red-400" />
                              </button>
                            </div>

                            <div className="space-y-4">
                              {/* Lesson Title */}
                              <div>
                                <label className="block text-xs font-space text-white/50 mb-2">
                                  Lesson Title *
                                </label>
                                <input
                                  type="text"
                                  value={lesson.title}
                                  onChange={(e) =>
                                    handleUpdateLesson(lesson.id, "title", e.target.value)
                                  }
                                  placeholder="e.g., Introduction to Drum Kit"
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 transition-all font-space"
                                />
                              </div>

                              {/* YouTube Link */}
                              <div>
                                <label className="block text-xs font-space text-white/50 mb-2">
                                  YouTube Video Link *
                                </label>
                                <input
                                  type="url"
                                  value={lesson.youtubeLink}
                                  onChange={(e) =>
                                    handleUpdateLesson(
                                      lesson.id,
                                      "youtubeLink",
                                      e.target.value
                                    )
                                  }
                                  placeholder="https://www.youtube.com/watch?v=..."
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 transition-all font-space"
                                />
                              </div>

                              {/* Lesson Description */}
                              <div>
                                <label className="block text-xs font-space text-white/50 mb-2">
                                  Lesson Description
                                </label>
                                <textarea
                                  rows={3}
                                  value={lesson.description}
                                  onChange={(e) =>
                                    handleUpdateLesson(
                                      lesson.id,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Describe what students will learn in this lesson..."
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 transition-all font-space resize-none"
                                />
                              </div>

                              {/* Can Watch Free */}
                              <div className="flex items-center gap-3 pt-2">
                                <input
                                  type="checkbox"
                                  id={`free-${lesson.id}`}
                                  checked={lesson.isFree}
                                  onChange={(e) =>
                                    handleUpdateLesson(lesson.id, "isFree", e.target.checked)
                                  }
                                  className="w-4 h-4 bg-white/5 border border-white/10 rounded accent-[#00FF85]"
                                />
                                <label
                                  htmlFor={`free-${lesson.id}`}
                                  className="text-sm font-space text-white/70 cursor-pointer"
                                >
                                  Can watch free (preview lesson)
                                </label>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveLessons}
                        disabled={saving}
                        className="px-6 py-3 bg-gradient-to-r from-[#FF5B00] to-[#FF8C00] rounded-lg font-space font-bold text-sm text-black hover:shadow-lg hover:shadow-[#FF5B00]/30 transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {saving ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Save size={18} />
                        )}
                        Save Lessons
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

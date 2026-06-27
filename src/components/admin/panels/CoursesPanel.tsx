"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  GripVertical,
} from "lucide-react";
import {
  Course,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getSectionHeader,
  updateSectionHeader,
  SectionHeader,
} from "@/lib/firestore";
import SyncDataButton from "../SyncDataButton";
import EditableSectionHeader from "../EditableSectionHeader";

const BADGE_COLORS = [
  { label: "Orange (Bestseller)", value: "#FF5B00" },
  { label: "Yellow (Top Rated)", value: "#FFD60A" },
  { label: "Cyan (New)", value: "#00D4FF" },
  { label: "Purple (Premium)", value: "#9D4EDD" },
];

const LEVELS = ["Beginner", "Intermediate", "Advanced", "All Levels"] as const;

export default function CoursesPanel() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  // Section header state
  const [sectionHeader, setSectionHeader] = useState<SectionHeader>({
    sectionLabel: "Master Your Rhythm",
    mainTitle: "Drum Courses",
    subtitle: "From tabla foundations to metal blast beats — learn from the world's finest percussionists.",
  });

  // Form state
  const [formData, setFormData] = useState<Omit<Course, "id">>({
    title: "",
    instructor: "",
    level: "Beginner",
    duration: "",
    lessons: 0,
    students: 0,
    rating: 4.5,
    price: 0,
    badge: "",
    badgeColor: "#FF5B00",
    tags: [],
    description: "",
  });

  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    loadCourses();
    loadSectionHeader();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    const data = await getCourses();
    setCourses(data);
    setLoading(false);
  };

  const loadSectionHeader = async () => {
    const header = await getSectionHeader("courses");
    if (header) {
      setSectionHeader(header);
    }
  };

  const handleSaveSectionHeader = async (data: {
    sectionLabel: string;
    mainTitle: string;
    subtitle: string;
  }) => {
    const success = await updateSectionHeader(data, "courses");
    if (success) {
      setSectionHeader(data);
      showNotification("success", "Section header updated successfully!");
    } else {
      showNotification("error", "Failed to update section header");
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDragStart = (index: number) => {
    if (searchQuery) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (searchQuery || draggedIndex === null) return;
    if (draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = async (index: number) => {
    if (searchQuery || draggedIndex === null) return;

    const updatedCourses = [...courses];
    const [draggedItem] = updatedCourses.splice(draggedIndex, 1);
    updatedCourses.splice(index, 0, draggedItem);

    const coursesWithNewOrder = updatedCourses.map((c, idx) => ({
      ...c,
      order: idx,
    }));

    setCourses(coursesWithNewOrder);
    setDraggedIndex(null);
    setDragOverIndex(null);

    setIsUpdatingOrder(true);
    try {
      await Promise.all(
        coursesWithNewOrder.map((c) => {
          if (c.id) {
            return updateCourse(c.id, { order: c.order });
          }
          return Promise.resolve();
        })
      );
      showNotification("success", "Course order updated successfully!");
    } catch (err) {
      console.error("Error saving new order:", err);
      showNotification("error", "Failed to save course order");
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  const handleOpenForm = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        instructor: course.instructor,
        level: course.level,
        duration: course.duration,
        lessons: course.lessons,
        students: course.students,
        rating: course.rating,
        price: course.price,
        badge: course.badge,
        badgeColor: course.badgeColor,
        tags: course.tags,
        description: course.description,
      });
    } else {
      setEditingCourse(null);
      setFormData({
        title: "",
        instructor: "",
        level: "Beginner",
        duration: "",
        lessons: 0,
        students: 0,
        rating: 4.5,
        price: 0,
        badge: "",
        badgeColor: "#FF5B00",
        tags: [],
        description: "",
      });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCourse(null);
    setTagInput("");
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCourse?.id) {
        const success = await updateCourse(editingCourse.id, formData);
        if (success) {
          showNotification("success", "Course updated successfully!");
          await loadCourses();
          handleCloseForm();
        } else {
          showNotification("error", "Failed to update course");
        }
      } else {
        const id = await createCourse({
          ...formData,
          order: courses.length,
        });
        if (id) {
          showNotification("success", "Course created successfully!");
          await loadCourses();
          handleCloseForm();
        } else {
          showNotification("error", "Failed to create course");
        }
      }
    } catch (error) {
      showNotification("error", "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    setLoading(true);
    const success = await deleteCourse(id);
    if (success) {
      showNotification("success", "Course deleted successfully!");
      await loadCourses();
    } else {
      showNotification("error", "Failed to delete course");
    }
    setLoading(false);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculate statistics
  const totalCourses = courses.length;
  const totalEnrolled = courses.reduce((sum, course) => {
    return sum + ((course as any).registeredStudents?.length || 0);
  }, 0);
  const totalEarnings = courses.reduce((sum, course) => {
    const enrolled = (course as any).registeredStudents?.length || 0;
    return sum + (enrolled * course.price);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-start justify-between gap-6">
        {/* Section Header - Editable */}
        <div className="flex-1">
          <EditableSectionHeader
            sectionLabel={sectionHeader.sectionLabel}
            mainTitle={sectionHeader.mainTitle}
            subtitle={sectionHeader.subtitle}
            onSave={handleSaveSectionHeader}
          />
        </div>

        {/* Stats Cards */}
        <div className="flex items-center gap-3">
          {/* Total Courses */}
          <div className="glass-card border border-white/10 rounded-xl px-4 py-3 min-w-[120px]">
            <div className="text-xs text-white/40 font-space mb-1">Total Courses</div>
            <div className="text-2xl font-orbitron font-bold text-white">{totalCourses}</div>
          </div>

          {/* Total Enrolled */}
          <div className="glass-card border border-[#00FF85]/20 rounded-xl px-4 py-3 min-w-[120px]">
            <div className="text-xs text-white/40 font-space mb-1">Total Enrolled</div>
            <div className="text-2xl font-orbitron font-bold text-[#00FF85]">
              {totalEnrolled.toLocaleString()}
            </div>
          </div>

          {/* Total Earnings */}
          <div className="glass-card border border-[#FF5B00]/20 rounded-xl px-4 py-3 min-w-[120px]">
            <div className="text-xs text-white/40 font-space mb-1">Total Earnings</div>
            <div className="text-2xl font-orbitron font-bold text-[#FF5B00]">
              ${totalEarnings.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg backdrop-blur-xl border ${
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

      {/* Sync Button */}
      {courses.length === 0 && !loading && (
        <SyncDataButton />
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="text"
            placeholder="Search courses, instructors, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF5B00]/50 focus:bg-white/10 transition-all font-space"
          />
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="px-6 py-3 bg-gradient-to-r from-[#FF5B00] to-[#FF8C00] rounded-lg font-space text-sm font-medium text-black hover:shadow-lg hover:shadow-[#FF5B00]/20 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add Course
        </button>
        <button
          onClick={loadCourses}
          disabled={loading}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Courses Grid */}
      {loading && courses.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-[#FF5B00]" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="glass-card border border-white/5 p-12 text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-white/20" />
          <h3 className="font-orbitron text-lg text-white/60 mb-2">No courses found</h3>
          <p className="text-sm text-white/40 font-space">
            {searchQuery ? "Try a different search term" : "Click 'Add Course' to create one"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              draggable={!searchQuery}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onDrop={() => handleDrop(index)}
              className={`glass-card p-6 border transition-all group relative ${
                draggedIndex === index
                  ? "opacity-35 border-dashed border-[#FF5B00]/40"
                  : dragOverIndex === index
                  ? "border-[#FF5B00]/80 scale-[1.02] shadow-lg shadow-[#FF5B00]/10 bg-white/5"
                  : "border-white/5 hover:border-[#FF5B00]/30"
              } ${!searchQuery ? "cursor-grab active:cursor-grabbing" : ""}`}
            >
              {/* Badge + Drag Handle */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {!searchQuery && (
                    <div className="text-white/30 hover:text-white/60 p-1 rounded hover:bg-white/5 transition-colors">
                      <GripVertical size={16} />
                    </div>
                  )}
                  <span
                    className="px-3 py-1 rounded-full text-[10px] font-space font-bold text-black uppercase tracking-wider"
                    style={{ backgroundColor: course.badgeColor }}
                  >
                    {course.badge}
                  </span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenForm(course)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={14} className="text-[#00D4FF]" />
                  </button>
                  <button
                    onClick={() => course.id && handleDelete(course.id)}
                    className="p-2 bg-white/5 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>

              {/* Title & Instructor */}
              <h4 className="font-space font-bold text-base text-white mb-1 leading-snug">
                {course.title}
              </h4>
              <p className="text-xs text-white/40 mb-3 font-space">
                by <span className="text-white/60">{course.instructor}</span>
              </p>

              {/* Description */}
              <p className="text-xs text-white/35 mb-4 line-clamp-2 font-space leading-relaxed">
                {course.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-space uppercase tracking-wider px-2 py-1 rounded border border-white/10 text-white/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-2 text-xs font-space text-white/50 mb-4">
                <div>Level: <span className="text-white/70">{course.level}</span></div>
                <div>Duration: <span className="text-white/70">{course.duration}</span></div>
                <div>Lessons: <span className="text-white/70">{course.lessons}</span></div>
                <div>Rating: <span className="text-[#FFD60A]">{course.rating}</span></div>
              </div>

              {/* Price */}
              <div className="border-t border-white/5 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-orbitron font-bold text-[#FF5B00]">
                      ${course.price}
                    </span>
                    <span className="text-xs text-white/30 ml-1 font-space">/ lifetime</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/40 font-space">
                      {course.students.toLocaleString()} students
                    </div>
                    <div className="text-xs text-[#00FF85] font-space font-bold">
                      {(course as any).registeredStudents?.length || 0} enrolled
                    </div>
                  </div>
                </div>

                {/* Add Course Content Button */}
                <button
                  onClick={() => router.push(`/admin92-studio-musicians/courses/${course.id}/content`)}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-[#00D4FF] to-[#00A8CC] rounded-lg font-space text-xs font-bold text-black hover:shadow-lg hover:shadow-[#00D4FF]/20 transition-all flex items-center justify-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Add Course Content
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-3xl max-h-[90vh] bg-[#0F0F0F] rounded-2xl border border-white/10 overflow-hidden flex flex-col"
              >
              {/* Form Header */}
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="font-orbitron font-bold text-lg">
                    {editingCourse ? "Edit Course" : "Add New Course"}
                  </h3>
                  <p className="text-xs text-white/40 font-space mt-1">
                    Fill in the details below
                  </p>
                </div>
                <button
                  onClick={handleCloseForm}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-space text-white/70 mb-2">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 focus:bg-white/10 transition-all font-space"
                      placeholder="e.g., Advanced Jazz Drumming"
                    />
                  </div>

                  {/* Instructor */}
                  <div>
                    <label className="block text-sm font-space text-white/70 mb-2">
                      Instructor *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 focus:bg-white/10 transition-all font-space"
                      placeholder="e.g., Marcus Webb"
                    />
                  </div>

                  {/* Level & Duration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-space text-white/70 mb-2">
                        Level *
                      </label>
                      <select
                        required
                        value={formData.level}
                        onChange={(e) =>
                          setFormData({ ...formData, level: e.target.value as any })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 focus:bg-white/10 transition-all font-space [&>option]:bg-black [&>option]:text-white"
                      >
                        {LEVELS.map((level) => (
                          <option key={level} value={level} className="bg-black text-white">
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-space text-white/70 mb-2">
                        Duration *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 focus:bg-white/10 transition-all font-space"
                        placeholder="e.g., 8 weeks"
                      />
                    </div>
                  </div>

                  {/* Lessons, Students, Rating, Price */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-space text-white/70 mb-2">
                        Lessons *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.lessons}
                        onChange={(e) =>
                          setFormData({ ...formData, lessons: parseInt(e.target.value) || 0 })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 focus:bg-white/10 transition-all font-space"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-space text-white/70 mb-2">
                        Students
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.students}
                        onChange={(e) =>
                          setFormData({ ...formData, students: parseInt(e.target.value) || 0 })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 focus:bg-white/10 transition-all font-space"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-space text-white/70 mb-2">
                        Rating
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={formData.rating}
                        onChange={(e) =>
                          setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 focus:bg-white/10 transition-all font-space"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-space text-white/70 mb-2">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 focus:bg-white/10 transition-all font-space"
                      />
                    </div>
                  </div>

                  {/* Badge & Color */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-space text-white/70 mb-2">
                        Badge *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 focus:bg-white/10 transition-all font-space"
                        placeholder="e.g., Bestseller"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-space text-white/70 mb-2">
                        Badge Color *
                      </label>
                      <select
                        required
                        value={formData.badgeColor}
                        onChange={(e) => setFormData({ ...formData, badgeColor: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 focus:bg-white/10 transition-all font-space [&>option]:bg-black [&>option]:text-white"
                      >
                        {BADGE_COLORS.map((color) => (
                          <option key={color.value} value={color.value} className="bg-black text-white">
                            {color.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-space text-white/70 mb-2">Tags</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 focus:bg-white/10 transition-all font-space"
                        placeholder="Enter tag and press Enter"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FF5B00]/10 border border-[#FF5B00]/30 rounded-lg text-xs font-space"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-red-400 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-space text-white/70 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5B00]/50 focus:bg-white/10 transition-all font-space resize-none"
                      placeholder="Brief description of the course..."
                    />
                  </div>
                </div>
              </form>

              {/* Form Footer */}
              <div className="px-6 py-4 border-t border-white/5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg font-space text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#FF5B00] to-[#FF8C00] rounded-lg font-space text-sm font-medium text-black hover:shadow-lg hover:shadow-[#FF5B00]/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {editingCourse ? "Update Course" : "Create Course"}
                </button>
              </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

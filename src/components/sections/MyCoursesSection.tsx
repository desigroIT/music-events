"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Users, Star, BookOpen, Play } from "lucide-react";
import { Course, getAllMyCourses } from "@/lib/firestore";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function MyCoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const coursesData = await getAllMyCourses();
      setCourses(coursesData);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <section id="my-courses" className="section-padding relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-[#FF5B00] border-t-transparent rounded-full" />
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return null; // Don't show section if no courses
  }

  return (
    <section id="my-courses" className="section-padding relative overflow-hidden bg-gradient-to-b from-[#050505] to-[#0A0A0A]">
      <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-[#00D4FF]" />
            <span className="section-label text-[#00D4FF]">Your Learning Journey</span>
            <span className="w-8 h-px bg-[#00D4FF]" />
          </div>
          <h2 className="section-title text-3xl md:text-5xl text-white mb-4">
            <span className="text-neon-cyan">My Courses</span>
          </h2>
          <p className="font-space text-white/40 max-w-xl mx-auto text-sm md:text-base">
            Continue your learning journey with your enrolled courses
          </p>
        </motion.div>

        {/* Course Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {courses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="glass-card p-6 group cursor-pointer hover-glow-cyan border border-white/5"
            >
              {/* Badge + Progress */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="badge text-black text-[10px]"
                  style={{ backgroundColor: course.badgeColor }}
                >
                  {course.badge}
                </span>
                <div className="flex items-center gap-2 text-[#00D4FF]">
                  <Play size={14} />
                  <span className="text-xs font-space">Continue</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-space font-bold text-base text-white mb-1 group-hover:text-[#00D4FF] transition-colors duration-300 leading-snug">
                {course.title}
              </h3>

              {/* Instructor */}
              <p className="font-space text-xs text-white/40 mb-3">
                by <span className="text-white/60">{course.instructor}</span>
              </p>

              {/* Description */}
              <p className="font-space text-xs text-white/35 mb-5 leading-relaxed line-clamp-2">
                {course.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                {course.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-space tracking-wider uppercase px-2 py-1 rounded border border-white/10 text-white/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="flex items-center gap-2 text-white/40">
                  <Clock size={12} />
                  <span className="font-space text-xs">{course.duration || course.completionTime || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-white/40">
                  <BookOpen size={12} />
                  <span className="font-space text-xs">
                    {Array.isArray(course.lessons)
                      ? course.lessons.length
                      : (course.numberOfLessons || course.lessons || 0)} lessons
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/40">
                  <Users size={12} />
                  <span className="font-space text-xs">
                    {(course.totalStudents || course.students || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#FFD60A]">
                  <Star size={12} fill="currentColor" />
                  <span className="font-space text-xs">{course.rating || 0}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="border-t border-white/5 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/40 font-space">Progress</span>
                  <span className="text-xs text-[#00D4FF] font-space font-bold">0%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] transition-all duration-500"
                    style={{ width: "0%" }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

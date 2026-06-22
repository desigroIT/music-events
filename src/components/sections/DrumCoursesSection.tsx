"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { drumCourses } from "@/data/dummy";
import { Clock, Users, Star, BookOpen } from "lucide-react";
import NeonInstrumentsBg from "@/components/ui/NeonInstrumentsBg";
import { Course, getCourses, getSectionHeader, SectionHeader } from "@/lib/firestore";
import EnrollButton from "@/components/ui/EnrollButton";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

// Deterministic heights seeded from bar index — no Math.random() to avoid hydration mismatch
const BAR_HEIGHTS = [55, 80, 40, 95, 65, 45, 75, 50];

function SoundwaveBars({ color }: { color: string }) {
  return (
    <div className="flex items-end gap-[3px] h-6">
      {BAR_HEIGHTS.map((height, i) => (
        <div
          key={i}
          className="soundwave-bar rounded-sm"
          style={{
            height: `${height}%`,
            backgroundColor: color,
            "--duration": `${0.8 + i * 0.15}s`,
            "--delay": `${i * 0.1}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default function DrumCoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionHeader, setSectionHeader] = useState<SectionHeader>({
    sectionLabel: "Master Your Rhythm",
    mainTitle: "Drum Courses",
    subtitle: "From tabla foundations to metal blast beats — learn from the world's finest percussionists.",
  });

  useEffect(() => {
    const loadData = async () => {
      // Load courses
      const coursesData = await getCourses();
      setCourses(coursesData.length > 0 ? coursesData : drumCourses as Course[]);

      // Load section header
      const headerData = await getSectionHeader("courses");
      if (headerData) {
        setSectionHeader(headerData);
      }

      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <section id="courses" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />
      <NeonInstrumentsBg variant="B" />

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
            <span className="w-8 h-px bg-[#FF5B00]" />
            <span className="section-label text-[#FF5B00]">{sectionHeader.sectionLabel}</span>
            <span className="w-8 h-px bg-[#FF5B00]" />
          </div>
          <h2 className="section-title text-3xl md:text-5xl text-white mb-4">
            <span className="text-neon-orange">{sectionHeader.mainTitle}</span>
          </h2>
          <p className="font-space text-white/40 max-w-xl mx-auto text-sm md:text-base">
            {sectionHeader.subtitle}
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
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-[#FF5B00] border-t-transparent rounded-full" />
            </div>
          ) : (
            courses.map((course) => (
            <motion.div
              key={course.id}
              // variants={cardVariants}
              className="glass-card p-6 group cursor-pointer hover-glow-orange border border-white/5"
            >
              {/* Badge + soundwave */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="badge text-black text-[10px]"
                  style={{ backgroundColor: course.badgeColor }}
                >
                  {course.badge}
                </span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <SoundwaveBars color={course.badgeColor} />
                </div>
              </div>

              {/* Title */}
              <h3 className="font-space font-bold text-base text-white mb-1 group-hover:text-[#FF5B00] transition-colors duration-300 leading-snug">
                {course.title}
              </h3>

              {/* Instructor */}
              <p className="font-space text-xs text-white/40 mb-3">
                by{" "}
                <span className="text-white/60">{course.instructor}</span>
              </p>

              {/* Description */}
              <p className="font-space text-xs text-white/35 mb-5 leading-relaxed line-clamp-2">
                {course.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                {course.tags.map((tag) => (
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
                  <span className="font-space text-xs">{course.duration || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-white/40">
                  <BookOpen size={12} />
                  <span className="font-space text-xs">
                    {course.lessons || 0} lessons
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/40">
                  <Users size={12} />
                  <span className="font-space text-xs">
                    {(course.students || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#FFD60A]">
                  <Star size={12} fill="currentColor" />
                  <span className="font-space text-xs">{course.rating || 0}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/5 pt-5 flex items-center justify-between">
                <span className="font-orbitron font-bold text-lg text-[#FF5B00]">
                  ${course.price}
                  <span className="text-white/30 text-xs font-space font-normal ml-1">/ lifetime</span>
                </span>
                <EnrollButton
                  courseId={course.id!}
                  className="btn-neon text-xs px-4 py-2 rounded font-space"
                  style={{
                    background: course.badgeColor,
                    color: "#000",
                  }}
                >
                  Enroll Now
                </EnrollButton>
              </div>
            </motion.div>
            ))
          )}
        </motion.div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <button className="btn-neon btn-outline-orange text-xs">
            Browse All 200+ Courses
          </button>
        </motion.div>
      </div>
    </section>
  );
}

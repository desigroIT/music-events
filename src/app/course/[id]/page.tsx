"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import { getCourseContent, CourseContent } from "@/lib/courseContent";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Play, CheckCircle, Clock, Users, Star, BookOpen, Lock, Award, Download } from "lucide-react";
import { motion } from "framer-motion";
import CustomVideoPlayer from "@/components/ui/CustomVideoPlayer";
import PaymentModal from "@/components/course/PaymentModal";
import { isUserRegistered } from "@/lib/coursePayment";

// Force dynamic rendering for authenticated pages
export const dynamic = 'force-dynamic';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const { user, userProfile } = useAuth();
  const [courseContent, setCourseContent] = useState<CourseContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<number>(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const [watchedLessons, setWatchedLessons] = useState<Set<number>>(new Set());

  useEffect(() => {
    const loadCourse = async () => {
      if (courseId) {
        const data = await getCourseContent(courseId);
        setCourseContent(data);
        setLoading(false);
      }
    };
    loadCourse();
  }, [courseId]);

  // Check if user is registered for this course
  useEffect(() => {
    const checkRegistration = async () => {
      if (courseId && user?.email) {
        const registered = await isUserRegistered(courseId, user.email);
        setIsRegistered(registered);
        setCheckingRegistration(false);
      }
    };
    checkRegistration();
  }, [courseId, user]);

  // Disable right-click, F12, and common keyboard shortcuts
  useEffect(() => {
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const disableDevTools = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u')) ||
        (e.ctrlKey && (e.key === 'S' || e.key === 's'))
      ) {
        e.preventDefault();
        return false;
      }
    };

    const disableSelectText = (e: Event) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('keydown', disableDevTools);
    document.addEventListener('selectstart', disableSelectText);

    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', disableDevTools);
      document.removeEventListener('selectstart', disableSelectText);
    };
  }, []);

  // Handle lesson click
  const handleLessonClick = (lesson: any, index: number) => {
    // If lesson is free or user is registered, allow access
    if (lesson.isFree || isRegistered) {
      setSelectedLesson(index);
      // Mark lesson as watched after 5 seconds (simulating video watch)
      setTimeout(() => {
        setWatchedLessons(prev => new Set(prev).add(index));
      }, 5000);
    } else {
      // Show payment modal
      setIsPaymentModalOpen(true);
    }
  };

  // Calculate progress
  const totalLessons = courseContent?.lessons?.length || 0;
  const completedLessons = watchedLessons.size;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const isCertificateUnlocked = progressPercentage >= 80;

  // Download certificate
  const handleDownloadCertificate = () => {
    // Generate certificate HTML
    const certificateHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 40px;
            font-family: 'Georgia', serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .certificate {
            background: white;
            padding: 60px;
            max-width: 800px;
            border: 15px solid #FFD60A;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #FF4500;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .title {
            font-size: 48px;
            color: #FF4500;
            margin: 0;
            font-weight: bold;
          }
          .subtitle {
            font-size: 18px;
            color: #666;
            margin-top: 10px;
          }
          .body {
            text-align: center;
            margin: 40px 0;
          }
          .name {
            font-size: 36px;
            color: #333;
            font-weight: bold;
            border-bottom: 2px solid #333;
            display: inline-block;
            padding: 10px 40px;
            margin: 20px 0;
          }
          .course {
            font-size: 24px;
            color: #FF4500;
            font-weight: bold;
            margin: 20px 0;
          }
          .description {
            font-size: 16px;
            color: #666;
            line-height: 1.6;
            margin: 20px 0;
          }
          .footer {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #eee;
          }
          .signature {
            text-align: center;
          }
          .signature-line {
            border-top: 2px solid #333;
            margin-top: 40px;
            padding-top: 10px;
            font-size: 14px;
            color: #666;
          }
          .date {
            font-size: 14px;
            color: #666;
            text-align: center;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">
            <h1 class="title">Certificate of Completion</h1>
            <p class="subtitle">Studio Musicians Academy</p>
          </div>
          <div class="body">
            <p style="font-size: 18px; color: #666;">This is to certify that</p>
            <div class="name">${userProfile?.displayName || user?.email || 'Student'}</div>
            <p style="font-size: 18px; color: #666;">has successfully completed</p>
            <div class="course">${courseContent?.courseName || 'Course'}</div>
            <p class="description">
              With dedication and commitment, the student has demonstrated mastery
              of the course material and achieved ${progressPercentage.toFixed(0)}% completion.
            </p>
            <p class="date">Issued on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div class="footer">
            <div class="signature">
              <div class="signature-line">Instructor Signature</div>
            </div>
            <div class="signature">
              <div class="signature-line">Academy Director</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Open in new window and trigger print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(certificateHTML);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Animated Neon Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF4500]/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#BF00FF]/10 rounded-full blur-3xl"
          />
        </div>

        {/* Header */}
        <header className="border-b border-white/5 backdrop-blur-xl bg-black/50 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="text-white/60 hover:text-white transition-colors font-space text-sm"
              >
                ← Back to Home
              </a>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-white/40 font-space">Welcome back,</p>
                <p className="text-sm text-white font-space font-bold">
                  {userProfile?.displayName || user?.email}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4500] to-[#BF00FF] flex items-center justify-center text-white font-orbitron font-bold">
                {userProfile?.displayName?.[0] || user?.email?.[0]?.toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Payment Modal */}
        {courseContent && (
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            courseId={courseId}
            courseName={courseContent.courseName}
            description={courseContent.description}
            price={courseContent.price}
            offerPrice={courseContent.offerPrice}
            completionTime={courseContent.completionTime}
            numberOfLessons={courseContent.numberOfLessons || courseContent.lessons?.length}
          />
        )}

        {/* Content */}
        {loading || checkingRegistration ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 size={48} className="animate-spin text-[#FF4500]" />
          </div>
        ) : courseContent ? (
          <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
            {/* Course Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 relative"
            >
              {/* Neon Border Animation */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, #FF4500, #BF00FF, #00D4FF, #FF4500)',
                    backgroundSize: '300% 100%',
                  }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="absolute inset-[2px] bg-black rounded-2xl" />
                </motion.div>
              </div>

              {/* Neon Glow Background */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-20 -left-20 w-40 h-40 bg-[#FF4500] rounded-full blur-3xl"
                />
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1.05, 1, 1.05],
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#BF00FF] rounded-full blur-3xl"
                />
              </div>

              <div className="glass-card p-8 rounded-2xl relative z-10">
                <div className="flex items-start gap-3 mb-4">
                  <span
                    className="px-4 py-1.5 rounded-full text-xs font-space font-bold text-black uppercase tracking-wider"
                    style={{ backgroundColor: courseContent.badgeColor || '#9D4EDD' }}
                  >
                    {courseContent.badge || 'COURSE'}
                  </span>
                  {courseContent.enableCertificate && (
                    <span className="px-4 py-1.5 rounded-full text-xs font-space font-bold bg-[#00FF85]/20 text-[#00FF85] uppercase tracking-wider border border-[#00FF85]/30">
                      Certificate Available
                    </span>
                  )}
                </div>

                <h1 className="font-orbitron font-bold text-4xl lg:text-5xl text-white mb-4 leading-tight">
                  {courseContent.courseName}
                </h1>

                <p className="text-lg text-white/60 font-space mb-6">
                  {courseContent.description}
                </p>

                <div className="flex flex-wrap items-center gap-6 mb-6 text-sm font-space">
                  <div className="flex items-center gap-2 text-white/50">
                    <Users size={18} />
                    <span>{courseContent.totalStudents?.toLocaleString() || 0} students</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/50">
                    <Clock size={18} />
                    <span>{courseContent.completionTime || 'Self-paced'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/50">
                    <BookOpen size={18} />
                    <span>{courseContent.numberOfLessons || courseContent.lessons?.length || 0} lessons</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#FFD60A]">
                    <Star size={18} fill="#FFD60A" />
                    <span className="text-white/70">4.5</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  {/* Price */}
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-4xl font-orbitron font-bold text-[#FF4500]">
                        ${courseContent.offerPrice || courseContent.price}
                      </span>
                      {courseContent.offerPrice && courseContent.offerPrice < courseContent.price && (
                        <span className="text-lg text-white/30 line-through ml-3">
                          ${courseContent.price}
                        </span>
                      )}
                    </div>
                    {courseContent.offerValidPeriod && (
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-space rounded-lg border border-red-500/30">
                        Offer ends {new Date(courseContent.offerValidPeriod).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Certificate Card */}
                  {courseContent.enableCertificate && (
                    <div className="glass-card border border-[#FFD60A]/30 rounded-xl p-4 min-w-[280px]">
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          !isRegistered
                            ? 'bg-white/10'
                            : isCertificateUnlocked
                            ? 'bg-gradient-to-br from-[#FFD60A] to-[#FF8C00]'
                            : 'bg-white/10'
                        }`}>
                          {!isRegistered ? (
                            <Lock size={24} className="text-white/40" />
                          ) : isCertificateUnlocked ? (
                            <Award size={24} className="text-black" />
                          ) : (
                            <Lock size={24} className="text-white/40" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-space font-bold text-sm text-white mb-1">
                            Course Certificate
                          </h3>

                          {/* Progress Bar or Locked Message */}
                          {!isRegistered ? (
                            <>
                              <p className="text-xs text-white/60 font-space mb-2">
                                Purchase this course to earn your certificate
                              </p>
                              <button
                                onClick={() => setIsPaymentModalOpen(true)}
                                className="w-full px-3 py-2 rounded-lg font-space text-xs font-bold bg-gradient-to-r from-[#FF4500] to-[#FF8C00] text-white hover:shadow-lg hover:shadow-[#FF4500]/30 transition-all flex items-center justify-center gap-2"
                              >
                                <Lock size={14} />
                                Purchase to Unlock
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="mb-2">
                                <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                                  <span className="font-space">Progress</span>
                                  <span className="font-space font-bold">
                                    {completedLessons}/{totalLessons} lessons
                                  </span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercentage}%` }}
                                    transition={{ duration: 0.5 }}
                                    className={`h-full rounded-full ${
                                      isCertificateUnlocked
                                        ? 'bg-gradient-to-r from-[#FFD60A] to-[#FF8C00]'
                                        : 'bg-gradient-to-r from-[#00D4FF] to-[#0099CC]'
                                    }`}
                                  />
                                </div>
                                <p className="text-[10px] text-white/40 font-space mt-1">
                                  {isCertificateUnlocked ? 'Certificate unlocked!' : `${(80 - progressPercentage).toFixed(0)}% more to unlock`}
                                </p>
                              </div>

                              {/* Download Button */}
                              <button
                                onClick={handleDownloadCertificate}
                                disabled={!isCertificateUnlocked}
                                className={`w-full px-3 py-2 rounded-lg font-space text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                  isCertificateUnlocked
                                    ? 'bg-gradient-to-r from-[#FFD60A] to-[#FF8C00] text-black hover:shadow-lg hover:shadow-[#FFD60A]/30'
                                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                                }`}
                              >
                                <Download size={14} />
                                {isCertificateUnlocked ? 'Download Certificate' : 'Complete 80% to Unlock'}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Video Player & Curriculum */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left: Video Player & Description */}
              <div className="lg:col-span-2 space-y-6">
                {/* Custom Video Player */}
                {courseContent.lessons && courseContent.lessons.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {/* Check if user can access this lesson */}
                    {(courseContent.lessons[selectedLesson]?.isFree || isRegistered) ? (
                      <>
                        <CustomVideoPlayer
                          videoUrl={courseContent.lessons[selectedLesson]?.youtubeLink}
                          lessonTitle={courseContent.lessons[selectedLesson]?.title || 'Select a lesson'}
                          isFreePreview={courseContent.lessons[selectedLesson]?.isFree}
                          userEmail={user?.email || ''}
                          userName={userProfile?.displayName || ''}
                        />

                        {/* Lesson Description */}
                        <div className="mt-6 glass-card border border-white/10 rounded-xl p-6">
                          <p className="text-white/60 font-space text-sm leading-relaxed">
                            {courseContent.lessons[selectedLesson]?.description ||
                              'No description available'}
                          </p>
                        </div>
                      </>
                    ) : (
                      // Locked lesson preview
                      <div className="glass-card border border-[#FF4500]/30 rounded-2xl overflow-hidden">
                        <div className="aspect-video bg-black/50 flex flex-col items-center justify-center gap-6 p-8">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8C00] flex items-center justify-center">
                            <Lock size={40} className="text-white" />
                          </div>
                          <div className="text-center space-y-3">
                            <h3 className="font-orbitron font-bold text-2xl text-white">
                              This Lesson is Locked
                            </h3>
                            <p className="text-white/60 font-space text-sm max-w-md">
                              Purchase this course to unlock all lessons and get lifetime access
                            </p>
                          </div>
                          <button
                            onClick={() => setIsPaymentModalOpen(true)}
                            className="px-8 py-3 bg-gradient-to-r from-[#FF4500] to-[#FF8C00] text-white font-orbitron font-bold rounded-xl hover:shadow-2xl hover:shadow-[#FF4500]/50 transition-all duration-300 hover:scale-105"
                          >
                            Unlock Course - ${courseContent.offerPrice || courseContent.price}
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Course Content (What You'll Learn) */}
                {courseContent.curriculum && courseContent.curriculum.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card border border-white/10 rounded-2xl p-6"
                  >
                    <h2 className="font-orbitron font-bold text-2xl text-white mb-6">
                      What You'll Learn
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {courseContent.curriculum.map((item, index) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 text-sm font-space text-white/70"
                        >
                          <CheckCircle size={18} className="text-[#00FF85] flex-shrink-0 mt-0.5" />
                          <span>{item.title}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Right: Lessons List */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card border border-white/10 rounded-2xl p-6 sticky top-24"
                >
                  <h2 className="font-orbitron font-bold text-xl text-white mb-6">
                    Course Lessons
                  </h2>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {courseContent.lessons && courseContent.lessons.length > 0 ? (
                      courseContent.lessons.map((lesson, index) => {
                        const isLocked = !lesson.isFree && !isRegistered;
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => handleLessonClick(lesson, index)}
                            className={`w-full text-left p-4 rounded-lg transition-all relative ${
                              selectedLesson === index
                                ? 'bg-[#FF4500]/20 border border-[#FF4500]/50'
                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                            } ${isLocked ? 'opacity-60' : ''}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-space text-white/40">
                                Lesson {index + 1}
                              </span>
                              <div className="flex items-center gap-2">
                                {lesson.isFree ? (
                                  <span className="text-[10px] font-space text-[#00FF85] px-2 py-0.5 bg-[#00FF85]/10 rounded border border-[#00FF85]/30">
                                    FREE
                                  </span>
                                ) : isLocked ? (
                                  <Lock size={14} className="text-[#FF4500]" />
                                ) : null}
                              </div>
                            </div>
                            <h3 className="font-space font-bold text-sm text-white mb-1">
                              {lesson.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <Play size={12} className="text-white/40" />
                              <span className="text-xs text-white/40 font-space">
                                Video Lesson
                              </span>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <p className="text-white/40 font-space text-sm text-center py-8">
                        No lessons available yet
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-white/40 font-space">Course not found</p>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}

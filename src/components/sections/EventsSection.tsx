"use client";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Clock, Loader2, X } from "lucide-react";
import NeonInstrumentsBg from "@/components/ui/NeonInstrumentsBg";
import { useEffect, useState } from "react";
import { AppEvent, getEvents } from "@/lib/events";
import RegisterEventModal from "@/components/modals/RegisterEventModal";

const tagColors: Record<string, string> = {
  Live: "#FF5B00",
  Workshop: "#00D4FF",
  "In-Person": "#9D4EDD",
  Free: "#4ade80",
  Business: "#FFD60A",
  Online: "#00D4FF",
  Featured: "#FFD60A",
  Bootcamp: "#FF3366",
};

export default function EventsSection() {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    getEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const visibleEvents = showAll ? events : events.slice(0, 6);

  return (
    <section id="events" className="section-padding relative overflow-hidden">
      <NeonInstrumentsBg variant="B" />
      <div
        className="absolute pointer-events-none"
        style={{
          width: "60vw", height: "60vh", top: "0", left: "-10%",
          background: "radial-gradient(ellipse, rgba(255,91,0,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-[#FF5B00]" />
            <span className="section-label text-[#FF5B00]">Live &amp; Online</span>
            <span className="w-8 h-px bg-[#FF5B00]" />
          </div>
          <h2 className="section-title text-3xl md:text-5xl text-white mb-4">
            Events &amp; <span className="text-neon-orange">Workshops</span>
          </h2>
          <p className="font-space text-white/40 max-w-xl mx-auto text-sm md:text-base">
            Masterclasses, concerts, jam sessions, and workshops — happening every week.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 size={36} className="animate-spin text-[#FF5B00]" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 text-white/30 font-space">
            No events scheduled yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {visibleEvents.map((event, i) => {
              const spotsPercent =
                event.spots > 0
                  ? Math.round(((event.spots - event.spotsLeft) / event.spots) * 100)
                  : 0;
              const tagColor = tagColors[event.tag] || event.color;
              const isPostType = event.type === "Event Post";

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card p-6 group cursor-pointer flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  style={{
                    border: `1px solid ${event.color}50`,
                    boxShadow: `0 0 15px ${event.color}20, inset 0 0 20px ${event.color}10`,
                  }}
                >
                  {event.image && (
                    <div 
                      className="relative h-48 shrink-0 -mx-6 -mt-6 mb-5 cursor-pointer overflow-hidden border-b"
                      style={{ borderBottomColor: `${event.color}30` }}
                      onClick={() => setPreviewImage(event.image || null)}
                    >
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
                    </div>
                  )}

                  {/* Type + tag */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-space text-xs text-white/30 uppercase tracking-widest">
                      {event.type}
                    </span>
                    <span
                      className="badge text-[10px]"
                      style={{
                        background: `${tagColor}15`,
                        color: tagColor,
                        border: `1px solid ${tagColor}40`,
                      }}
                    >
                      {event.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-space font-bold text-base text-white mb-1 leading-snug group-hover:text-[#FF5B00] transition-colors duration-300">
                    {event.title}
                  </h3>
                  {!isPostType && <p className="font-space text-xs text-white/40 mb-4">Host: {event.host}</p>}
                  {isPostType && <div className="mb-4" />}

                  {/* Meta */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="flex items-center gap-2 text-white font-bold">
                      <Calendar size={14} style={{ color: event.color }} />
                      <span className="font-space text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white font-bold">
                      <Clock size={14} style={{ color: event.color }} />
                      <span className="font-space text-sm">{event.time}</span>
                    </div>
                    {!isPostType && (
                      <>
                        <div className="flex items-center gap-2 text-white/70">
                          <MapPin size={12} />
                          <span className="font-space text-xs">{event.mode}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                          <Users size={12} />
                          <span className="font-space text-xs">{event.spotsLeft} left</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Spots progress */}
                  {!isPostType && event.spots > 0 && (
                    <div className="mb-5">
                      <div className="flex justify-between text-[10px] font-space text-white/30 mb-1.5">
                        <span>{spotsPercent}% filled</span>
                        <span>{event.spotsLeft} / {event.spots} spots left</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${spotsPercent}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3, duration: 1 }}
                          className="h-full rounded-full"
                          style={{ background: event.color }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                    <span className="font-orbitron font-bold text-sm" style={{ color: event.color }}>
                      {!isPostType ? event.price : ""}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => {
                        if (isPostType && event.image) {
                          setPreviewImage(event.image);
                        } else if (!isPostType) {
                          setSelectedEvent(event);
                        }
                      }}
                      className="text-[11px] px-4 py-1.5 rounded font-space font-bold transition-all"
                      style={{
                        background: `${event.color}25`,
                        color: event.color,
                        border: `1px solid ${event.color}55`,
                      }}
                    >
                      {isPostType ? "View Image" : "Register"}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* View all button */}
        {!showAll && events.length > 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <button
              onClick={() => setShowAll(true)}
              className="btn-neon btn-outline-orange text-xs"
            >
              Browse All Events
            </button>
          </motion.div>
        )}
      </div>

      {/* Registration Modal */}
      <RegisterEventModal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
      />

      {/* Image Preview Lightbox */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative inline-flex flex-col items-end">
            <button 
              className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/90 hover:text-white transition-colors z-[120] cursor-pointer"
              onClick={(e) => { e.stopPropagation(); setPreviewImage(null); }}
            >
              <X size={24} />
            </button>
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  );
}

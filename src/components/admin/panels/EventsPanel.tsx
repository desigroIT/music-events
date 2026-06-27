"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Calendar,
  Clock,
  Users,
  MapPin,
  Zap,
  BookOpen,
  X,
  ChevronRight,
  Mail,
  Phone,
  MessageSquare,
  UserCheck,
} from "lucide-react";
import { AppEvent, getEvents, deleteEvent, EventRegistration, getRegistrations } from "@/lib/events";
import EventModal from "@/components/modals/EventModal";

type FilterType = "all" | "event" | "workshop";

const EVENT_TYPES = ["Masterclass", "Concert", "Jam Session", "Live Show", "Open Mic"];
const WORKSHOP_TYPES = ["Workshop", "Bootcamp", "Tutorial", "Mentorship Session", "Studio Session"];

function isWorkshop(event: AppEvent): boolean {
  return WORKSHOP_TYPES.includes(event.type);
}

function isPost(event: AppEvent): boolean {
  return event.type === "Event Post";
}

export default function EventsPanel() {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterDate, setFilterDate] = useState("");

  // Create / Edit Modal
  const [createMode, setCreateMode] = useState<"event" | "workshop" | "post" | null>(null);
  const [editingEvent, setEditingEvent] = useState<AppEvent | null>(null);

  // Delete
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Registrations Drawer
  const [viewingRegsEvent, setViewingRegsEvent] = useState<AppEvent | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [regsLoading, setRegsLoading] = useState(false);

  // Image Preview
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Notification
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const data = await getEvents();
    setEvents(data);
    setLoading(false);
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleEdit = (event: AppEvent) => {
    setEditingEvent(event);
    setCreateMode(isPost(event) ? "post" : isWorkshop(event) ? "workshop" : "event");
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const success = await deleteEvent(deleteId);
    if (success) {
      showNotification("success", "Deleted successfully!");
      setEvents((prev) => prev.filter((e) => e.id !== deleteId));
    } else {
      showNotification("error", "Failed to delete.");
    }
    setIsDeleting(false);
    setDeleteId(null);
  };

  const handleViewRegistrations = async (event: AppEvent) => {
    setViewingRegsEvent(event);
    setRegsLoading(true);
    const data = await getRegistrations(event.id as string);
    setRegistrations(data);
    setRegsLoading(false);
  };

  // Derived stats
  const totalEvents = events.filter((e) => !isWorkshop(e) && !isPost(e)).length;
  const totalWorkshops = events.filter((e) => isWorkshop(e)).length;
  const totalPosts = events.filter((e) => isPost(e)).length;

  // Filtered list
  const filtered = events.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType =
      filterType === "all" ||
      (filterType === "workshop" && isWorkshop(e)) ||
      (filterType === "event" && !isWorkshop(e));
    const matchDate = filterDate ? e.date === filterDate : true;
    return matchSearch && matchType && matchDate;
  });

  const modalMode = createMode || (editingEvent ? (isPost(editingEvent) ? "post" : isWorkshop(editingEvent) ? "workshop" : "event") : "event");
  const isModalOpen = !!createMode || !!editingEvent;

  const handleModalClose = () => {
    setCreateMode(null);
    setEditingEvent(null);
  };

  return (
    <div className="space-y-6">
      {/* --- Stats Row --- */}
      <div className="flex flex-wrap items-center gap-3">
        <StatCard label="Total" value={events.length} color="white" />
        <StatCard label="Events" value={totalEvents} color="#FF5B00" />
        <StatCard label="Workshops" value={totalWorkshops} color="#00D4FF" />
        <StatCard label="Posts" value={totalPosts} color="#9D4EDD" />
      </div>

      {/* --- Notification --- */}
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
            {notification.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-space">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Controls Bar --- */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search by title, host, type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00D4FF]/50 transition-all font-space"
          />
        </div>

        {/* Date Filter */}
        <div className="relative flex items-center">
          <Calendar size={14} className="absolute left-3 text-white/40 pointer-events-none" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-9 py-2.5 text-sm text-white focus:outline-none focus:border-[#00D4FF]/50 transition-all font-space [color-scheme:dark]"
          />
          {filterDate && (
            <button onClick={() => setFilterDate("")} className="absolute right-3 text-white/30 hover:text-white">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-1">
          {(["all", "event", "workshop"] as FilterType[]).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-1.5 rounded-md text-xs font-space font-bold capitalize transition-all ${
                filterType === t
                  ? t === "event"
                    ? "bg-[#FF5B00] text-white"
                    : t === "workshop"
                    ? "bg-[#00D4FF] text-black"
                    : "bg-white/15 text-white"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Refresh */}
        <button
          onClick={loadEvents}
          disabled={loading}
          className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin text-white/60" : "text-white/60"} />
        </button>
      </div>

      {/* --- Create Buttons --- */}
      <div className="flex gap-3 flex-wrap">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { setEditingEvent(null); setCreateMode("event"); }}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-space font-bold text-sm text-white transition-all"
          style={{
            background: "linear-gradient(135deg, #FF5B00, #FF8C00)",
            boxShadow: "0 4px 20px #FF5B0030",
          }}
        >
          <Plus size={16} />
          Create Event
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { setEditingEvent(null); setCreateMode("workshop"); }}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-space font-bold text-sm text-black transition-all"
          style={{
            background: "linear-gradient(135deg, #00D4FF, #0099CC)",
            boxShadow: "0 4px 20px #00D4FF30",
          }}
        >
          <BookOpen size={16} />
          Create Workshop
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { setEditingEvent(null); setCreateMode("post"); }}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-space font-bold text-sm text-white transition-all"
          style={{
            background: "linear-gradient(135deg, #9D4EDD, #7B2CBF)",
            boxShadow: "0 4px 20px #9D4EDD30",
          }}
        >
          <Zap size={16} />
          Create Event Post
        </motion.button>
      </div>

      {/* --- Event Cards Grid --- */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-[#FF5B00]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-white/5 bg-white/2 rounded-2xl p-12 text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-white/15" />
          <h3 className="font-orbitron text-lg text-white/50 mb-2">
            No {filterType !== "all" ? filterType + "s" : "events"} found
          </h3>
          <p className="text-sm text-white/30 font-space">Try adjusting your filters or create a new one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={() => handleEdit(event)}
                onDelete={() => setDeleteId(event.id as string)}
                onViewRegistrations={() => handleViewRegistrations(event)}
                onPreviewImage={(img) => setPreviewImage(img)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* --- Event / Workshop Create/Edit Modal --- */}
      <EventModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={() => {
          loadEvents();
          showNotification("success", `${modalMode === "workshop" ? "Workshop" : "Event"} saved!`);
        }}
        mode={modalMode}
        eventToEdit={editingEvent}
      />

      {/* --- Registrations Drawer Modal --- */}
      <AnimatePresence>
        {viewingRegsEvent && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setViewingRegsEvent(null)}
            />
            <motion.div
              initial={{ opacity: 0, x: 60, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.97 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
              style={{
                boxShadow: `0 0 60px ${viewingRegsEvent.color}18, 0 25px 50px rgba(0,0,0,0.6)`,
              }}
            >
              {/* Accent line */}
              <div
                className="h-0.5 rounded-t-2xl shrink-0"
                style={{
                  background: `linear-gradient(90deg, transparent, ${viewingRegsEvent.color}, transparent)`,
                }}
              />

              {/* Header */}
              <div className="px-6 py-5 border-b border-white/5 shrink-0 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <UserCheck size={16} style={{ color: viewingRegsEvent.color }} />
                    <span className="text-xs font-space uppercase tracking-wider" style={{ color: viewingRegsEvent.color }}>
                      Registrations
                    </span>
                  </div>
                  <h3 className="text-lg font-orbitron font-bold text-white leading-tight">
                    {viewingRegsEvent.title}
                  </h3>
                  <p className="text-xs text-white/40 font-space mt-1">
                    {viewingRegsEvent.date} · {viewingRegsEvent.time} · {viewingRegsEvent.mode}
                  </p>
                </div>
                <button
                  onClick={() => setViewingRegsEvent(null)}
                  className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Count badge */}
              <div className="px-6 py-3 border-b border-white/5 shrink-0 flex items-center gap-3">
                <div
                  className="px-3 py-1 rounded-full text-xs font-space font-bold"
                  style={{
                    background: `${viewingRegsEvent.color}15`,
                    color: viewingRegsEvent.color,
                    border: `1px solid ${viewingRegsEvent.color}30`,
                  }}
                >
                  {regsLoading ? "..." : registrations.length} Registered
                </div>
                <span className="text-xs text-white/30 font-space">
                  Total Participants:{" "}
                  <span className="text-white/60">
                    {regsLoading
                      ? "..."
                      : registrations.reduce((s, r) => s + (r.participants || 1), 0)}
                  </span>
                </span>
              </div>

              {/* Body */}
              <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
                {regsLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <Loader2 size={28} className="animate-spin text-white/30" />
                  </div>
                ) : registrations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <Users size={36} className="text-white/15 mb-3" />
                    <p className="text-sm font-space text-white/30">No registrations yet.</p>
                  </div>
                ) : (
                  registrations.map((reg, i) => (
                    <motion.div
                      key={reg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-white/3 border border-white/8 rounded-xl p-4 hover:border-white/15 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        {/* Avatar + name */}
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold font-space shrink-0"
                            style={{
                              background: `${viewingRegsEvent.color}20`,
                              color: viewingRegsEvent.color,
                              border: `1px solid ${viewingRegsEvent.color}30`,
                            }}
                          >
                            {reg.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-space font-bold text-white">{reg.name}</p>
                            <p className="text-[10px] text-white/40 font-space">
                              {reg.participants} participant{reg.participants > 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        {/* Registered timestamp */}
                        <span className="text-[10px] text-white/25 font-space shrink-0">
                          {reg.registeredAt?.toDate
                            ? reg.registeredAt.toDate().toLocaleDateString()
                            : "—"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-space text-white/50">
                        <span className="flex items-center gap-1.5">
                          <Mail size={11} className="text-white/30" />{reg.email}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Phone size={11} className="text-white/30" />{reg.phone}
                        </span>
                        <span className="flex items-center gap-1.5 sm:col-span-2">
                          <MapPin size={11} className="text-white/30" />{reg.address}
                        </span>
                        {reg.message && (
                          <span className="flex items-start gap-1.5 sm:col-span-2 text-white/35">
                            <MessageSquare size={11} className="text-white/30 mt-0.5 shrink-0" />
                            <span className="italic">{reg.message}</span>
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Delete Confirm Modal --- */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => !isDeleting && setDeleteId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-space font-bold text-white mb-2">Delete Item?</h3>
                <p className="text-sm font-space text-white/50 mb-6">
                  This action cannot be undone. The event or workshop will be permanently removed.
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setDeleteId(null)}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-space text-sm font-bold text-white transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-space text-sm font-bold text-white transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Image Preview Lightbox --- */}
      <AnimatePresence>
        {previewImage && (
          <div 
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm cursor-zoom-out"
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
      </AnimatePresence>
    </div>
  );
}

// --- Stat Card ---
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="rounded-xl px-4 py-3 min-w-[110px] border"
      style={{
        background: color === "white" ? "rgba(255,255,255,0.05)" : `${color}10`,
        borderColor: color === "white" ? "rgba(255,255,255,0.1)" : `${color}30`,
      }}
    >
      <div className="text-xs text-white/40 font-space mb-1">{label}</div>
      <div
        className="text-2xl font-orbitron font-bold"
        style={{ color: color === "white" ? "white" : color }}
      >
        {value}
      </div>
    </div>
  );
}

// --- Event Card ---
function EventCard({
  event,
  onEdit,
  onDelete,
  onViewRegistrations,
  onPreviewImage,
}: {
  event: AppEvent;
  onEdit: () => void;
  onDelete: () => void;
  onViewRegistrations: () => void;
  onPreviewImage: (img: string) => void;
}) {
  const workshop = WORKSHOP_TYPES.includes(event.type);
  const isPostType = event.type === "Event Post";
  const spotsPercent =
    event.spots > 0 ? Math.round(((event.spots - event.spotsLeft) / event.spots) * 100) : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      className="glass-card p-5 group relative overflow-hidden flex flex-col rounded-2xl transition-all duration-300"
      style={{
        border: `1px solid ${event.color}50`,
        boxShadow: `0 0 15px ${event.color}20, inset 0 0 20px ${event.color}10`,
      }}
    >
      {/* Top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-20"
        style={{ background: `linear-gradient(90deg, transparent, ${event.color}60, transparent)` }}
      />

      {/* Image Banner */}
      {event.image && (
        <div 
          className="relative h-40 shrink-0 -mx-5 -mt-5 mb-5 cursor-pointer overflow-hidden border-b"
          style={{ borderBottomColor: `${event.color}30` }}
          onClick={() => onPreviewImage(event.image as string)}
        >
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
        </div>
      )}

      {/* Main card body */}
      <div className="flex flex-col flex-1 relative z-10">
        {/* Header: Type badge + actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-space font-bold uppercase tracking-wider"
              style={{
                background: `${event.color}15`,
                color: event.color,
                border: `1px solid ${event.color}30`,
              }}
            >
              {event.type}
            </span>
            {workshop ? (
              <BookOpen size={13} className="text-[#00D4FF]" />
            ) : (
              <Zap size={13} className="text-[#FF5B00]" />
            )}
          </div>
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onEdit}
              className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Edit2 size={13} className="text-[#00D4FF]" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 bg-white/5 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 size={13} className="text-red-400" />
            </button>
          </div>
        </div>

        {/* Title + Host */}
        <h4 className="font-space font-bold text-sm text-white mb-1 leading-snug line-clamp-2">
          {event.title}
        </h4>
        {!isPostType && <p className="text-xs text-white/40 mb-4 font-space">Host: {event.host}</p>}
        {isPostType && <div className="mb-4" />}

        {/* Meta Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <Calendar size={13} style={{ color: event.color }} />
            <span className="font-space text-sm">{event.date}</span>
          </div>
          <div className="flex items-center gap-2 text-white font-bold">
            <Clock size={13} style={{ color: event.color }} />
            <span className="font-space text-sm">{event.time}</span>
          </div>
          {!isPostType && (
            <>
              <MetaItem icon={<MapPin size={10} />} label={event.mode} />
              <MetaItem icon={<Users size={10} />} label={`${event.spotsLeft} left`} />
            </>
          )}
        </div>

        {/* Spots Progress */}
        {!isPostType && event.spots > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-[10px] font-space text-white/30 mb-1">
              <span>{spotsPercent}% filled</span>
              <span>{event.spotsLeft}/{event.spots} spots</span>
            </div>
            <div className="h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${spotsPercent}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-full rounded-full"
                style={{ background: event.color }}
              />
            </div>
          </div>
        )}

        {/* Footer: Price + Tag */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
          <span className="font-orbitron font-bold text-sm" style={{ color: event.color }}>
            {!isPostType ? event.price : ""}
          </span>
          <span
            className="px-2 py-0.5 rounded text-[10px] font-space font-bold uppercase tracking-wider"
            style={{
              background: `${event.color}20`,
              color: event.color,
              border: `1px solid ${event.color}40`,
            }}
          >
            {event.tag}
          </span>
        </div>
      </div>

      {/* View Registrations footer button */}
      {!isPostType && (
        <button
          onClick={onViewRegistrations}
          className="w-[calc(100%+2.5rem)] -mx-5 -mb-5 mt-4 flex items-center justify-between px-5 py-3 border-t border-white/5 bg-white/2 hover:bg-white/5 transition-colors group/reg"
          style={{ borderTopColor: `${event.color}20` }}
        >
          <span className="flex items-center gap-2 text-xs font-space font-bold" style={{ color: event.color }}>
            <UserCheck size={13} />
            View Registrations
          </span>
          <ChevronRight
            size={14}
            className="text-white/20 group-hover/reg:text-white/50 transition-colors"
          />
        </button>
      )}
    </motion.div>
  );
}

function MetaItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-white/35">
      {icon}
      <span className="font-space text-[11px] truncate">{label}</span>
    </div>
  );
}

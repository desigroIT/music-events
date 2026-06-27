"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Plus, Trash2, Edit2, Camera, Image as ImageIcon, AlertCircle, 
  CheckCircle, Loader2, RefreshCw, Type, Eye, Sparkles, MapPin, Mail, AlignLeft
} from "lucide-react";
import { 
  getCommunityMusiciansDb, 
  createCommunityMusicianDb, 
  deleteCommunityMusicianDb,
  updateCommunityMusicianDb,
  getBannerAdsDb,
  createBannerAdDb,
  deleteBannerAdDb,
  CommunityMusician,
  BannerAd,
  saveCommunityMemberEmailDb
} from "@/lib/firestore";

const PRESET_COLORS = [
  { name: "Orange", value: "#FF5B00" },
  { name: "Cyan", value: "#00D4FF" },
  { name: "Purple", value: "#9D4EDD" },
  { name: "Yellow", value: "#FFD60A" },
  { name: "Green", value: "#00FF85" },
];

export default function CommunityPanel() {
  const [activeTab, setActiveTab] = useState<"register" | "musicians" | "ads">("register");
  
  // Musicians List state
  const [musicians, setMusicians] = useState<CommunityMusician[]>([]);
  const [musiciansLoading, setMusiciansLoading] = useState(false);
  
  // Ads List state
  const [ads, setAds] = useState<BannerAd[]>([]);
  const [adsLoading, setAdsLoading] = useState(false);

  // Form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [instrument, setInstrument] = useState("Vocalist");
  const [district, setDistrict] = useState("Colombo");
  
  // Files and Previews
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  
  // Banner Ad toggle & inputs
  const [createAd, setCreateAd] = useState(false);
  const [adType, setAdType] = useState<"image" | "text">("image");
  const [adTitle, setAdTitle] = useState("");
  const [adTagline, setAdTagline] = useState("");
  const [adText, setAdText] = useState("");
  const [adColor, setAdColor] = useState("#FF5B00");
  const [adImageFile, setAdImageFile] = useState<File | null>(null);
  const [adImagePreview, setAdImagePreview] = useState("");
  
  // Action status
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteAdMusicianId, setDeleteAdMusicianId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"musician" | "ad" | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingMusicianId, setEditingMusicianId] = useState<string | null>(null);
  
  // Notifications
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // File Input Refs
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const adImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeTab === "musicians") {
      loadMusicians();
    } else if (activeTab === "ads") {
      loadAds();
    }
  }, [activeTab]);

  const loadMusicians = async () => {
    setMusiciansLoading(true);
    const data = await getCommunityMusiciansDb();
    setMusicians(data);
    setMusiciansLoading(false);
  };

  const loadAds = async () => {
    setAdsLoading(true);
    const data = await getBannerAdsDb();
    setAds(data);
    setAdsLoading(false);
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Image Upload helper
  const uploadMediaToCloudinary = async (file: File, label: string): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.warn("Cloudinary configuration missing. Simulating media upload.");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (label.includes("Profile")) {
        return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80";
      } else if (label.includes("Cover")) {
        return "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80";
      } else {
        return "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80";
      }
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errRes = await res.json();
      throw new Error(errRes.error?.message || `Failed to upload ${label} to Cloudinary`);
    }

    const data = await res.json();
    return data.secure_url;
  };

  const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleAdImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAdImageFile(file);
      setAdImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setAboutMe("");
    setInstrument("Vocalist");
    setDistrict("Colombo");
    setProfileFile(null);
    setProfilePreview("");
    setCoverFile(null);
    setCoverPreview("");
    setCreateAd(false);
    setAdType("image");
    setAdTitle("");
    setAdTagline("");
    setAdText("");
    setAdImageFile(null);
    setAdImagePreview("");
    setAdColor("#FF5B00");
  };

  const handleEditClick = (musician: CommunityMusician) => {
    setEditingMusicianId(musician.id || null);
    setName(musician.name);
    setEmail(musician.email);
    setAboutMe(musician.aboutMe);
    setInstrument(musician.instrument || "Vocalist");
    setDistrict(musician.district || "Colombo");
    setProfilePreview(musician.profilePhoto || "");
    setCoverPreview(musician.coverPhoto || "");
    setProfileFile(null);
    setCoverFile(null);
    setCreateAd(false);
    setActiveTab("register");
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !aboutMe.trim()) {
      showNotification("error", "Name, Email and About Me are required fields.");
      return;
    }

    setSubmitting(true);
    setUploadProgress(editingMusicianId ? "Saving profile updates..." : "Starting registration...");

    try {
      let profileUrl = profilePreview || "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(name);
      let coverUrl = coverPreview || "";

      // 1. Upload profile photo
      if (profileFile) {
        setUploadProgress("Uploading Profile Photo to Cloudinary...");
        profileUrl = await uploadMediaToCloudinary(profileFile, "Profile Photo");
      }

      // 2. Upload cover photo
      if (coverFile) {
        setUploadProgress("Uploading Cover Photo to Cloudinary...");
        coverUrl = await uploadMediaToCloudinary(coverFile, "Cover Photo");
      }

      // 3. Save Details
      const musicianData: Partial<CommunityMusician> = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        aboutMe: aboutMe.trim(),
        profilePhoto: profileUrl,
        coverPhoto: coverUrl,
        instrument,
        district,
      };

      if (editingMusicianId) {
        const success = await updateCommunityMusicianDb(editingMusicianId, musicianData);
        if (!success) {
          throw new Error("Failed to update musician profile in database.");
        }
        showNotification("success", `Musician ${name} updated successfully!`);
        setEditingMusicianId(null);
      } else {
        const musicianDataNew: Omit<CommunityMusician, "id"> = {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          aboutMe: aboutMe.trim(),
          profilePhoto: profileUrl,
          coverPhoto: coverUrl,
          instrument,
          district,
          followers: Math.floor(Math.random() * 200 + 10).toString(),
          verified: true,
          color: adColor,
        };

        const musicianId = await createCommunityMusicianDb(musicianDataNew);

        if (!musicianId) {
          throw new Error("Failed to save musician registry document in database.");
        }

        // Save email to Community_members_email collection
        await saveCommunityMemberEmailDb(email, musicianId);

        // 4. Create Banner Ad if toggled
        if (createAd) {
          setUploadProgress("Processing banner ad uploads...");
          let adImageUrl = "";

          if (adType === "image") {
            if (adImageFile) {
              setUploadProgress("Uploading Banner Ad Image...");
              adImageUrl = await uploadMediaToCloudinary(adImageFile, "Ad Image");
            } else {
              adImageUrl = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80"; // fallback
            }

            const adData: Omit<BannerAd, "id"> = {
              type: "image",
              title: adTitle.trim() || `${name} Live`,
              tagline: adTagline.trim() || `Listen to ${name}'s community releases`,
              image: adImageUrl,
              color: adColor,
            };
            await createBannerAdDb(musicianId, adData);
          } else {
            const adData: Omit<BannerAd, "id"> = {
              type: "text",
              text: adText.trim() || `🎸 Check out our newly registered artist ${name}!`,
              color: adColor,
            };
            await createBannerAdDb(musicianId, adData);
          }
        }
        showNotification("success", `Musician ${name} registered successfully!`);
      }

      resetForm();
      setActiveTab("musicians");
    } catch (err: any) {
      console.error(err);
      showNotification("error", err.message || "An unexpected error occurred during database saves.");
    } finally {
      setSubmitting(false);
      setUploadProgress("");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId || !deleteType) return;
    setIsDeleting(true);

    let success = false;
    if (deleteType === "musician") {
      success = await deleteCommunityMusicianDb(deleteId);
      if (success) {
        setMusicians(musicians.filter(m => m.id !== deleteId));
        showNotification("success", "Musician deleted successfully from registry!");
      } else {
        showNotification("error", "Failed to delete musician.");
      }
    } else {
      success = await deleteBannerAdDb(deleteAdMusicianId || "", deleteId);
      if (success) {
        setAds(ads.filter(a => a.id !== deleteId));
        showNotification("success", "Banner ad removed successfully!");
      } else {
        showNotification("error", "Failed to delete banner ad.");
      }
    }

    setIsDeleting(false);
    setDeleteId(null);
    setDeleteAdMusicianId(null);
    setDeleteType(null);
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
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

      {/* Tabs Menu */}
      <div className="flex border-b border-white/5 pb-px gap-6">
        <button
          onClick={() => {
            if (activeTab !== "register" && !editingMusicianId) {
              resetForm();
            }
            setActiveTab("register");
          }}
          className={`pb-4 text-sm font-space uppercase tracking-wider relative transition-colors ${
            activeTab === "register" ? "text-white font-bold" : "text-white/40 hover:text-white/70"
          }`}
        >
          {editingMusicianId ? "Edit Musician" : "Register Musician"}
          {activeTab === "register" && (
            <motion.div layoutId="communityTabBorder" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9D4EDD]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("musicians")}
          className={`pb-4 text-sm font-space uppercase tracking-wider relative transition-colors ${
            activeTab === "musicians" ? "text-white font-bold" : "text-white/40 hover:text-white/70"
          }`}
        >
          Musicians Directory
          {activeTab === "musicians" && (
            <motion.div layoutId="communityTabBorder" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9D4EDD]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("ads")}
          className={`pb-4 text-sm font-space uppercase tracking-wider relative transition-colors ${
            activeTab === "ads" ? "text-white font-bold" : "text-white/40 hover:text-white/70"
          }`}
        >
          Banner Ads
          {activeTab === "ads" && (
            <motion.div layoutId="communityTabBorder" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9D4EDD]" />
          )}
        </button>
      </div>

      {/* Panels container */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {activeTab === "register" && (
            <motion.form
              key="register-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              onSubmit={handleRegisterSubmit}
              className="space-y-8 max-w-4xl"
            >
              {/* Form Grid */}
              <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9D4EDD] to-[#FF5B00]" />
                
                <h3 className="font-orbitron font-bold text-lg text-white/90 flex items-center gap-2 border-b border-white/5 pb-3">
                  <Users size={20} className="text-[#9D4EDD]" />
                  {editingMusicianId ? "Edit Musician Profile" : "Musician Personal Profile"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-space text-white/50 uppercase tracking-widest mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white font-space focus:outline-none focus:border-[#9D4EDD] transition-all"
                      placeholder="e.g. Aisha Patel"
                      disabled={submitting}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-space text-white/50 uppercase tracking-widest mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white font-space focus:outline-none focus:border-[#9D4EDD] transition-all"
                      placeholder="e.g. aisha@studiomusicians.com"
                      disabled={submitting}
                      required
                    />
                  </div>

                  {/* Instrument Select */}
                  <div>
                    <label className="block text-xs font-space text-white/50 uppercase tracking-widest mb-2">
                      Primary Instrument / Role
                    </label>
                    <select
                      value={instrument}
                      onChange={(e) => setInstrument(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white font-space focus:outline-none focus:border-[#9D4EDD] transition-all cursor-pointer"
                      disabled={submitting}
                    >
                      <option className="bg-[#111]" value="Vocalist">Vocalist</option>
                      <option className="bg-[#111]" value="Guitarist">Guitarist</option>
                      <option className="bg-[#111]" value="Pianist / Keyboardist">Pianist / Keyboardist</option>
                      <option className="bg-[#111]" value="Drummer / Percussionist">Drummer / Percussionist</option>
                      <option className="bg-[#111]" value="Bassist">Bassist</option>
                      <option className="bg-[#111]" value="Flutist">Flutist</option>
                      <option className="bg-[#111]" value="Violinist">Violinist</option>
                      <option className="bg-[#111]" value="Music Producer">Music Producer</option>
                    </select>
                  </div>

                  {/* District / Region */}
                  <div>
                    <label className="block text-xs font-space text-white/50 uppercase tracking-widest mb-2">
                      District / City
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white font-space focus:outline-none focus:border-[#9D4EDD] transition-all"
                      placeholder="e.g. Colombo, Mumbai, New York"
                      disabled={submitting}
                    />
                  </div>
                </div>

                {/* About Me */}
                <div>
                  <label className="block text-xs font-space text-white/50 uppercase tracking-widest mb-2">
                    About Me (Short Biography)
                  </label>
                  <textarea
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white font-space focus:outline-none focus:border-[#9D4EDD] transition-all resize-none"
                    placeholder="Describe style, musical journey, accomplishments..."
                    disabled={submitting}
                    required
                  />
                </div>

                {/* Image Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Profile Image */}
                  <div className="space-y-2">
                    <label className="block text-xs font-space text-white/50 uppercase tracking-widest">
                      Profile Avatar Photo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      ref={profileInputRef}
                      onChange={handleProfileFileChange}
                      className="hidden"
                      disabled={submitting}
                    />
                    <div
                      onClick={() => !submitting && profileInputRef.current?.click()}
                      className="border border-dashed border-white/10 hover:border-[#9D4EDD]/40 rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer bg-white/3 hover:bg-white/5 transition-colors min-h-[140px] text-center"
                    >
                      {profilePreview ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border border-[#9D4EDD]/30 shadow-lg">
                          <img src={profilePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                          <Camera size={20} />
                        </div>
                      )}
                      <div className="text-xs font-space text-white/40">
                        {profileFile ? profileFile.name : "Click to select avatar image"}
                      </div>
                    </div>
                  </div>

                  {/* Cover Photo */}
                  <div className="space-y-2">
                    <label className="block text-xs font-space text-white/50 uppercase tracking-widest">
                      Cover Banner Photo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      ref={coverInputRef}
                      onChange={handleCoverFileChange}
                      className="hidden"
                      disabled={submitting}
                    />
                    <div
                      onClick={() => !submitting && coverInputRef.current?.click()}
                      className="border border-dashed border-white/10 hover:border-[#9D4EDD]/40 rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer bg-white/3 hover:bg-white/5 transition-colors min-h-[140px] text-center"
                    >
                      {coverPreview ? (
                        <div className="relative w-full max-w-[200px] h-12 rounded overflow-hidden border border-white/15 shadow-lg">
                          <img src={coverPreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center text-white/40">
                          <ImageIcon size={20} />
                        </div>
                      )}
                      <div className="text-xs font-space text-white/40">
                        {coverFile ? coverFile.name : "Click to select cover banner"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Banner Ads Integration Section */}
              {!editingMusicianId && (
                <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles size={20} className="text-[#FF5B00]" />
                    <div>
                      <h3 className="font-orbitron font-bold text-lg text-white/90 leading-none">
                        Create Banner Ads
                      </h3>
                      <p className="text-[10px] text-white/40 font-space mt-1 uppercase tracking-wider">
                        Publish marketing placements for the community page
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={createAd} 
                      onChange={(e) => setCreateAd(e.target.checked)}
                      className="sr-only peer" 
                      disabled={submitting}
                    />
                    <div className="w-11 h-6 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/40 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5B00]/70 peer-checked:after:bg-white" />
                  </label>
                </div>

                <AnimatePresence>
                  {createAd && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-6"
                    >
                      {/* Ad Type selection */}
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setAdType("image")}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border font-space text-xs font-bold uppercase transition-all ${
                            adType === "image"
                              ? "bg-[#FF5B00]/15 border-[#FF5B00]/30 text-[#FF5B00] shadow-[0_0_15px_rgba(255,91,0,0.1)]"
                              : "bg-white/3 border-white/5 text-white/50 hover:text-white"
                          }`}
                        >
                          <ImageIcon size={14} />
                          Upload Image Post (Sidebar)
                        </button>
                        <button
                          type="button"
                          onClick={() => setAdType("text")}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border font-space text-xs font-bold uppercase transition-all ${
                            adType === "text"
                              ? "bg-[#FF5B00]/15 border-[#FF5B00]/30 text-[#FF5B00] shadow-[0_0_15px_rgba(255,91,0,0.1)]"
                              : "bg-white/3 border-white/5 text-white/50 hover:text-white"
                          }`}
                        >
                          <Type size={14} />
                          Text Ticker Post (Top)
                        </button>
                      </div>

                      {/* Accent Color presets */}
                      <div>
                        <label className="block text-xs font-space text-white/50 uppercase tracking-widest mb-3">
                          Ad Theme Accent Color
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {PRESET_COLORS.map((c) => (
                            <button
                              type="button"
                              key={c.value}
                              onClick={() => setAdColor(c.value)}
                              className="px-3 py-1.5 rounded border text-[11px] font-space font-bold transition-all flex items-center gap-1.5"
                              style={{
                                borderColor: adColor === c.value ? c.value : "rgba(255,255,255,0.05)",
                                backgroundColor: adColor === c.value ? `${c.value}15` : "rgba(255,255,255,0.03)",
                                color: adColor === c.value ? c.value : "rgba(255,255,255,0.4)"
                              }}
                            >
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.value }} />
                              {c.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Image Ad subform */}
                      {adType === "image" ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Ad Title */}
                            <div>
                              <label className="block text-xs font-space text-white/50 uppercase tracking-widest mb-2">
                                Ad Title (Headline)
                              </label>
                              <input
                                type="text"
                                value={adTitle}
                                onChange={(e) => setAdTitle(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white font-space focus:outline-none focus:border-[#FF5B00] transition-all"
                                placeholder="e.g. Gibson Custom Shop"
                              />
                            </div>
                            
                            {/* Ad Tagline */}
                            <div>
                              <label className="block text-xs font-space text-white/50 uppercase tracking-widest mb-2">
                                Ad Tagline / Subtitle
                              </label>
                              <input
                                type="text"
                                value={adTagline}
                                onChange={(e) => setAdTagline(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white font-space focus:outline-none focus:border-[#FF5B00] transition-all"
                                placeholder="e.g. Get 20% Off Limited Edition Guitars"
                              />
                            </div>
                          </div>

                          {/* Image upload */}
                          <div className="space-y-2">
                            <label className="block text-xs font-space text-white/50 uppercase tracking-widest">
                              Banner Ad Image
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              ref={adImageInputRef}
                              onChange={handleAdImageChange}
                              className="hidden"
                            />
                            <div
                              onClick={() => adImageInputRef.current?.click()}
                              className="border border-dashed border-white/10 hover:border-[#FF5B00]/40 rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer bg-white/3 hover:bg-white/5 transition-colors min-h-[140px] text-center"
                            >
                              {adImagePreview ? (
                                <div className="relative w-full max-w-[260px] h-16 rounded overflow-hidden border border-white/15 shadow-lg">
                                  <img src={adImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center text-white/40">
                                  <ImageIcon size={20} />
                                </div>
                              )}
                              <div className="text-xs font-space text-white/40">
                                {adImageFile ? adImageFile.name : "Click to select advertising image banner"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Text Ticker Ad Subform
                        <div>
                          <label className="block text-xs font-space text-white/50 uppercase tracking-widest mb-2">
                            Marquee Ticker Message
                          </label>
                          <input
                            type="text"
                            value={adText}
                            onChange={(e) => setAdText(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white font-space focus:outline-none focus:border-[#FF5B00] transition-all"
                            placeholder="e.g. 🎸 Limited Custom Shop Gibson models available at active community discount..."
                          />
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4 border-t border-white/5 pt-6">
                {editingMusicianId ? (
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setEditingMusicianId(null);
                      setActiveTab("musicians");
                    }}
                    disabled={submitting}
                    className="px-5 py-3 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 rounded-lg font-space text-xs font-bold uppercase transition-colors"
                  >
                    Cancel Edit
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={submitting}
                    className="px-5 py-3 border border-white/10 rounded-lg font-space text-xs font-bold text-white/50 hover:text-white uppercase transition-colors"
                  >
                    Clear Fields
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-[#9D4EDD] hover:bg-[#b06cf7] rounded-lg font-space text-xs font-bold text-white uppercase tracking-wider transition-colors flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>{uploadProgress || "Processing..."}</span>
                    </>
                  ) : (
                    <>
                      {editingMusicianId ? <CheckCircle size={14} /> : <Plus size={14} />}
                      <span>{editingMusicianId ? "Update Musician Profile" : "Register Musician & Save"}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}

          {activeTab === "musicians" && (
            <motion.div
              key="musicians-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-orbitron font-bold text-lg text-white/80">Registered Community Musicians</h3>
                <button
                  onClick={loadMusicians}
                  disabled={musiciansLoading}
                  className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                >
                  <RefreshCw size={16} className={musiciansLoading ? "animate-spin" : ""} />
                </button>
              </div>

              {musiciansLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 size={32} className="animate-spin text-[#9D4EDD]" />
                </div>
              ) : musicians.length === 0 ? (
                <div className="glass-card border border-white/5 p-12 text-center rounded-2xl bg-white/2">
                  <Users size={48} className="mx-auto mb-4 text-white/20" />
                  <h3 className="font-orbitron text-lg text-white/60 mb-2">No registry entries</h3>
                  <p className="text-sm text-white/40 font-space">You have not registered any custom musicians in the database yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {musicians.map((m) => (
                    <div
                      key={m.id}
                      className="bg-[#111] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all flex flex-col justify-between relative overflow-hidden group"
                    >
                      {/* Accent colored sidebar */}
                      <div className="absolute top-0 bottom-0 left-0 w-1" style={{ backgroundColor: m.color || "#9D4EDD" }} />

                      <div className="space-y-4">
                        {/* Header info */}
                        <div className="flex gap-4 items-start pl-2">
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0">
                            <img src={m.profilePhoto} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-space font-bold text-sm text-white truncate">{m.name}</h4>
                            <p className="font-space text-[10px] text-[#00D4FF] font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1">
                              {m.instrument}
                            </p>
                            <p className="font-space text-[9px] text-white/40 mt-1 flex items-center gap-0.5">
                              <MapPin size={8} /> {m.district}
                            </p>
                          </div>
                        </div>

                        {/* Bio preview */}
                        <p className="font-space text-xs text-white/50 leading-relaxed line-clamp-3 pl-2">
                          {m.aboutMe}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="border-t border-white/5 pt-4 mt-5 flex items-center justify-between pl-2">
                        <span className="font-space text-[10px] text-white/30 flex items-center gap-1">
                          <Mail size={10} /> {m.email}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditClick(m)}
                            className="p-1.5 bg-white/5 hover:bg-white/10 text-white rounded transition-colors animate-none"
                            title="Edit Profile"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteId(m.id as string);
                              setDeleteType("musician");
                            }}
                            className="p-1.5 bg-white/5 hover:bg-white/10 text-white rounded transition-colors animate-none"
                            title="Delete Profile"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "ads" && (
            <motion.div
              key="ads-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-orbitron font-bold text-lg text-white/80">Active Banner Placements</h3>
                <button
                  onClick={loadAds}
                  disabled={adsLoading}
                  className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                >
                  <RefreshCw size={16} className={adsLoading ? "animate-spin" : ""} />
                </button>
              </div>

              {adsLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 size={32} className="animate-spin text-[#FF5B00]" />
                </div>
              ) : ads.length === 0 ? (
                <div className="glass-card border border-white/5 p-12 text-center rounded-2xl bg-white/2">
                  <ImageIcon size={48} className="mx-auto mb-4 text-white/20" />
                  <h3 className="font-orbitron text-lg text-white/60 mb-2">No ads running</h3>
                  <p className="text-sm text-white/40 font-space">No banner ads are currently deployed. Create one while registering a musician.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ads.map((ad) => (
                    <div
                      key={ad.id}
                      className="bg-[#111] border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 relative overflow-hidden"
                    >
                      {/* Color marker */}
                      <div className="absolute top-0 bottom-0 left-0 w-1" style={{ backgroundColor: ad.color }} />

                      <div className="flex items-center gap-4 pl-2 min-w-0">
                        {ad.type === "image" ? (
                          <>
                            <div className="w-20 h-12 rounded overflow-hidden border border-white/10 shrink-0">
                              <img src={ad.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[9px] font-space font-bold uppercase tracking-wider px-2 py-0.5 rounded border" style={{ color: ad.color, borderColor: `${ad.color}30`, backgroundColor: `${ad.color}10` }}>
                                Sidebar Image Ad
                              </span>
                              <h4 className="font-space font-bold text-sm text-white mt-1.5 truncate">{ad.title}</h4>
                              <p className="font-space text-xs text-white/40 truncate">{ad.tagline}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-white/60">
                              <Type size={20} />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[9px] font-space font-bold uppercase tracking-wider px-2 py-0.5 rounded border" style={{ color: ad.color, borderColor: `${ad.color}30`, backgroundColor: `${ad.color}10` }}>
                                Top Text Marquee
                              </span>
                              <p className="font-space text-xs text-white mt-1.5 leading-relaxed truncate md:line-clamp-2 md:whitespace-normal">
                                {ad.text}
                              </p>
                            </div>
                          </>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setDeleteId(ad.id as string);
                          setDeleteAdMusicianId(ad.musicianId || "");
                          setDeleteType("ad");
                        }}
                        className="self-end md:self-auto px-4 py-2 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/30 text-red-400 font-space text-[10px] font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 shrink-0"
                      >
                        <Trash2 size={11} /> Delete Ad
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
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
                <h3 className="text-xl font-space font-bold text-white mb-2">
                  Delete {deleteType === "musician" ? "Musician Profile" : "Ad Campaign"}?
                </h3>
                <p className="text-sm font-space text-white/50 mb-6">
                  Are you sure you want to delete this {deleteType === "musician" ? "musician profile from the registry" : "banner ad placement"}? This action cannot be undone.
                </p>
                
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => {
                      setDeleteId(null);
                      setDeleteType(null);
                    }}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-space text-sm font-bold text-white transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
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
    </div>
  );
}

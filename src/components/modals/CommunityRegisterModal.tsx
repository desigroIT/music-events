"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Video, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { UserProfile, updateUserProfile } from "@/lib/auth";

interface CommunityRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onSuccess: (updatedProfile: UserProfile) => void;
}

export default function CommunityRegisterModal({
  isOpen,
  onClose,
  userProfile,
  onSuccess,
}: CommunityRegisterModalProps) {
  const [name, setName] = useState(userProfile?.displayName || "");
  const [phone, setPhone] = useState(userProfile?.phone || "");
  const [aboutMe, setAboutMe] = useState(userProfile?.aboutMe || "");
  
  // File states
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(userProfile?.profilePhoto || "");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>(userProfile?.videoUrl || "");

  // Status states
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);

  // File input refs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Profile photo must be smaller than 5MB");
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        setError("Video clip must be smaller than 20MB");
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const uploadMediaToCloudinary = async (file: File, type: "image" | "video"): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.warn("Cloudinary configuration missing. Simulating media upload.");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return type === "image"
        ? "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80"
        : "https://res.cloudinary.com/demo/video/upload/v1502213437/dog.mp4";
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
      throw new Error(errRes.error?.message || "Failed to upload file to Cloudinary");
    }

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!phone.trim()) {
      setError("Phone number is required");
      return;
    }
    if (!aboutMe.trim()) {
      setError("Please add a short bio in About Me");
      return;
    }

    setError("");
    setUploading(true);

    try {
      let finalPhotoUrl = photoPreview;
      let finalVideoUrl = videoPreview;

      // Upload Photo
      if (photoFile) {
        setUploadProgress("Uploading profile photo...");
        finalPhotoUrl = await uploadMediaToCloudinary(photoFile, "image");
      } else if (!photoPreview) {
        throw new Error("Profile photo is required");
      }

      // Upload Video
      if (videoFile) {
        setUploadProgress("Uploading video clip...");
        finalVideoUrl = await uploadMediaToCloudinary(videoFile, "video");
      } else if (!videoPreview) {
        throw new Error("Small video clip is required");
      }

      setUploadProgress("Saving profile to community...");

      const updateData: Partial<UserProfile> = {
        displayName: name,
        phone,
        aboutMe,
        profilePhoto: finalPhotoUrl,
        videoUrl: finalVideoUrl,
        isCommunityMember: true,
      };

      const success = await updateUserProfile(userProfile.uid, updateData);

      if (success) {
        setRegistered(true);
        onSuccess({
          ...userProfile,
          ...updateData,
        });
      } else {
        throw new Error("Failed to update profile database info");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during registration");
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative z-10 w-full max-w-2xl bg-[#090909] border border-[#9D4EDD]/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(157,78,221,0.2)] flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-orbitron font-bold text-lg text-white uppercase tracking-wider">
            Join the <span className="text-neon-purple">Musician Community</span>
          </h3>
          {!uploading && !registered && (
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {registered ? (
              // Success Screen
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 flex flex-col items-center justify-center gap-6"
              >
                <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500 shadow-[0_0_20px_rgba(74,222,128,0.2)]">
                  <CheckCircle2 size={40} className="animate-bounce" />
                </div>
                <div>
                  <h4 className="font-orbitron font-bold text-2xl text-white mb-2 uppercase tracking-wide">
                    Welcome to the Tribe!
                  </h4>
                  <p className="font-space text-white/50 max-w-md mx-auto text-sm">
                    You have successfully joined the Studio Musicians Free Community. The cards are now unlocked!
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="btn-neon btn-orange text-xs px-8 py-3 mt-4"
                >
                  Enter Dashboard
                </button>
              </motion.div>
            ) : (
              // Form Screen
              <motion.form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg flex items-center gap-3 text-sm font-space">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Grid inputs */}
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
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white font-space focus:outline-none focus:border-[#9D4EDD] focus:shadow-[0_0_15px_rgba(157,78,221,0.2)] transition-all"
                      placeholder="e.g. John Doe"
                      disabled={uploading}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-space text-white/50 uppercase tracking-widest mb-2">
                      Email Address (Readonly)
                    </label>
                    <input
                      type="email"
                      value={userProfile?.email || ""}
                      readOnly
                      className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white/40 font-space focus:outline-none cursor-not-allowed"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-space text-white/50 uppercase tracking-widest mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white font-space focus:outline-none focus:border-[#9D4EDD] focus:shadow-[0_0_15px_rgba(157,78,221,0.2)] transition-all"
                      placeholder="e.g. +94 77 123 4567"
                      disabled={uploading}
                    />
                  </div>

                  {/* Empty space/alignment helper */}
                  <div className="hidden md:block" />
                </div>

                {/* About Me */}
                <div>
                  <label className="block text-xs font-space text-white/50 uppercase tracking-widest mb-2">
                    About Me (Short Bio)
                  </label>
                  <textarea
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white font-space focus:outline-none focus:border-[#9D4EDD] focus:shadow-[0_0_15px_rgba(157,78,221,0.2)] transition-all resize-none"
                    placeholder="Tell other musicians about your style, background, instrument, and experience..."
                    disabled={uploading}
                  />
                </div>

                {/* Media uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Profile Photo */}
                  <div className="space-y-2">
                    <label className="block text-xs font-space text-white/50 uppercase tracking-widest">
                      Profile Photo (Image)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      ref={photoInputRef}
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <div
                      onClick={() => !uploading && photoInputRef.current?.click()}
                      className="border border-dashed border-white/10 hover:border-[#9D4EDD]/50 rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer bg-white/3 transition-colors min-h-[140px] text-center"
                    >
                      {photoPreview ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/20">
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                          <Camera size={20} />
                        </div>
                      )}
                      <div className="text-xs font-space text-white/50">
                        {photoFile ? photoFile.name : "Click to upload photo (Max 5MB)"}
                      </div>
                    </div>
                  </div>

                  {/* Video Clip */}
                  <div className="space-y-2">
                    <label className="block text-xs font-space text-white/50 uppercase tracking-widest">
                      Introduction Clip (Video)
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      ref={videoInputRef}
                      onChange={handleVideoChange}
                      className="hidden"
                    />
                    <div
                      onClick={() => !uploading && videoInputRef.current?.click()}
                      className="border border-dashed border-white/10 hover:border-[#9D4EDD]/50 rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer bg-white/3 transition-colors min-h-[140px] text-center"
                    >
                      {videoPreview ? (
                        <div className="w-16 h-16 bg-[#9D4EDD]/10 rounded-lg border border-[#9D4EDD]/30 flex items-center justify-center text-[#9D4EDD]">
                          <Video size={24} className="animate-pulse" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                          <Video size={20} />
                        </div>
                      )}
                      <div className="text-xs font-space text-white/50">
                        {videoFile ? videoFile.name : "Click to upload introduction video (Max 20MB)"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3">
                  {!uploading && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 font-space text-xs text-white/50 hover:text-white transition-colors uppercase"
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={uploading}
                    className="btn-neon btn-orange text-xs px-8 py-2.5 flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span className="normal-case">{uploadProgress || "Uploading..."}</span>
                      </>
                    ) : (
                      "Join Community"
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

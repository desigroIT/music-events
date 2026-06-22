"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Tabs from "@radix-ui/react-tabs";
import { X, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createNetworkingPost, updateNetworkingPost, NetworkingPost } from "@/lib/networking";

const SRI_LANKA_DISTRICTS = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle",
  "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle",
  "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala",
  "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura",
  "Trincomalee", "Vavuniya"
];

interface PostNetworkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  postToEdit?: NetworkingPost | null;
}

export default function PostNetworkingModal({ isOpen, onClose, onSuccess, postToEdit }: PostNetworkingModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"item" | "job">("item");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [dueDate, setDueDate] = useState("");

  React.useEffect(() => {
    if (isOpen && postToEdit) {
      setActiveTab(postToEdit.type);
      setTitle(postToEdit.title || "");
      setLocation(postToEdit.location || "");
      setContactNumber(postToEdit.contactNumber || "");
      setPrice(postToEdit.price || "");
      setDescription(postToEdit.description || "");
      setAddress(postToEdit.address || "");
      setDueDate(postToEdit.dueDate || "");
    } else if (isOpen) {
      // Reset form on open if no postToEdit
      setTitle("");
      setPrice("");
      setLocation("");
      setContactNumber("");
      setDescription("");
      setAddress("");
      setDueDate("");
    }
  }, [isOpen, postToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to post.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const postData: Omit<NetworkingPost, "id" | "createdAt" | "updatedAt"> = {
        type: activeTab,
        title,
        location,
        contactNumber,
        userId: user.uid,
      };

      if (activeTab === "item") {
        if (!price) throw new Error("Price is required for items.");
        postData.price = price;
      } else {
        if (!description || !address || !dueDate) {
          throw new Error("Description, address, and due date are required for jobs.");
        }
        postData.description = description;
        postData.address = address;
        postData.dueDate = dueDate;
      }

      let success = false;

      if (postToEdit?.id) {
        success = await updateNetworkingPost(postToEdit.id, postData);
      } else {
        const id = await createNetworkingPost(postData);
        success = !!id;
      }
      
      if (success) {
        // Form is reset by the useEffect when modal opens next time
        onSuccess?.();
        onClose();
      } else {
        throw new Error(`Failed to ${postToEdit ? "update" : "create"} post. Please try again.`);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
            <h2 className="text-2xl font-space font-bold text-white">
              {postToEdit ? "Edit Post" : "Create Post"}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            <Tabs.Root value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
              <Tabs.List className="flex border-b border-white/10 mb-6 shrink-0">
                <Tabs.Trigger
                  value="item"
                  className={`flex-1 pb-3 text-sm font-space font-bold transition-colors border-b-2 ${
                    activeTab === "item" ? "border-[#00D4FF] text-[#00D4FF]" : "border-transparent text-white/50 hover:text-white/80"
                  }`}
                >
                  Sell Item
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="job"
                  className={`flex-1 pb-3 text-sm font-space font-bold transition-colors border-b-2 ${
                    activeTab === "job" ? "border-[#00D4FF] text-[#00D4FF]" : "border-transparent text-white/50 hover:text-white/80"
                  }`}
                >
                  Post Job
                </Tabs.Trigger>
              </Tabs.List>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
                    {error}
                  </div>
                )}

                {/* Common Fields */}
                <div className="space-y-1">
                  <label className="text-xs font-space text-white/50 uppercase tracking-wider">
                    {activeTab === "item" ? "Item Name" : "Job Title"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D4FF] transition-colors"
                    placeholder={activeTab === "item" ? "e.g. Roland TD-17KVX" : "e.g. Session Drummer Wanted"}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-space text-white/50 uppercase tracking-wider">
                      Location (District) <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D4FF] transition-colors appearance-none"
                    >
                      <option value="" disabled>Select District</option>
                      {SRI_LANKA_DISTRICTS.map((district) => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-space text-white/50 uppercase tracking-wider">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D4FF] transition-colors"
                      placeholder="07X XXX XXXX"
                    />
                  </div>
                </div>

                {/* Tab Specific Fields */}
                <Tabs.Content value="item" className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-space text-white/50 uppercase tracking-wider">
                      Price (Rs.) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required={activeTab === "item"}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D4FF] transition-colors"
                      placeholder="e.g. 150,000"
                    />
                  </div>
                </Tabs.Content>

                <Tabs.Content value="job" className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-space text-white/50 uppercase tracking-wider">
                      Job Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required={activeTab === "job"}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D4FF] transition-colors resize-none"
                      placeholder="Describe the job requirements..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-space text-white/50 uppercase tracking-wider">
                        Specific Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required={activeTab === "job"}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D4FF] transition-colors"
                        placeholder="e.g. Studio 5, Colombo 03"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-space text-white/50 uppercase tracking-wider">
                        Due Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required={activeTab === "job"}
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D4FF] transition-colors [color-scheme:dark]"
                      />
                    </div>
                  </div>
                </Tabs.Content>

                <div className="pt-6 mt-4 border-t border-white/10 flex justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 rounded-lg font-space text-sm text-white/70 hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 rounded-lg font-space font-bold text-sm bg-[#00D4FF] text-black hover:bg-white transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {postToEdit ? "Save Changes" : `Publish ${activeTab === "item" ? "Item" : "Job"}`}
                  </button>
                </div>
              </form>
            </Tabs.Root>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

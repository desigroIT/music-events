"use client";

import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { syncDummyDataToFirestore } from "@/lib/firestore";
import { drumCourses } from "@/data/dummy";

export default function SyncDataButton() {
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");

  const handleSync = async () => {
    if (!confirm("This will add all dummy courses to Firebase. Continue?")) return;

    setSyncing(true);
    setMessage("");

    try {
      await syncDummyDataToFirestore(drumCourses);
      setMessage("✓ Successfully synced all courses to Firebase!");
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      setMessage("✗ Error syncing data. Check console.");
      console.error(error);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="glass-card p-4 border border-white/5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-space font-medium text-white mb-1">
            Sync Dummy Data
          </h4>
          <p className="text-xs text-white/40">
            Import all courses from dummy.ts to Firebase
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="px-4 py-2 bg-[#9D4EDD]/20 hover:bg-[#9D4EDD]/30 border border-[#9D4EDD]/30 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 text-sm font-space"
        >
          {syncing ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Upload size={16} />
          )}
          {syncing ? "Syncing..." : "Sync Now"}
        </button>
      </div>
      {message && (
        <p
          className={`text-xs font-space mt-3 ${
            message.startsWith("✓") ? "text-[#00FF85]" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

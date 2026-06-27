"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, MessageSquare, Rss, Megaphone, Send, Image as ImageIcon,
  Video as VideoIcon, Loader2, ArrowLeft, Sparkles, Heart, MessageCircle,
  User, CheckCircle, MapPin, Phone, Users, X, Info,
  MoreVertical, Edit2, Trash2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/ui/Navbar";
import FooterSection from "@/components/sections/FooterSection";
import NeonInstrumentsBg from "@/components/ui/NeonInstrumentsBg";
import AuthModal from "@/components/auth/AuthModal";
import { useAuthModal } from "@/hooks/useAuthModal";
import CommunityRegisterModal from "@/components/modals/CommunityRegisterModal";
import CustomVideoPlayer from "@/components/ui/CustomVideoPlayer";
import { db } from "@/lib/firestore";
import { UserProfile } from "@/lib/auth";
import { getCommunityArtists, getArtistProfile, ArtistProfile } from "@/lib/artists";
import {
  collection, collectionGroup, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp,
  doc, updateDoc, arrayUnion, arrayRemove, where, getDocs, setDoc, getDoc, deleteDoc
} from "firebase/firestore";

function AuthModalWrapper() {
  const { isOpen, redirectTo, mode, closeModal } = useAuthModal();
  return <AuthModal isOpen={isOpen} onClose={closeModal} redirectTo={redirectTo} mode={mode || "login"} />;
}

interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  createdAt: any;
}

interface DirectChat {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerPhoto: string;
  lastMessage: string;
  updatedAt: any;
}

interface CommunityPost {
  id: string;
  text: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  senderId: string;
  senderName: string;
  senderPhoto: string;
  createdAt: any;
  likes: string[];
  targetId: string; // "global" or specific artist's UID
  targetName?: string;
}

interface PostComment {
  id: string;
  postId: string;
  text: string;
  senderId: string;
  senderName: string;
  senderPhoto: string;
  createdAt: any;
}

const dummyPosts: CommunityPost[] = [
  {
    id: "dummy-post-1",
    text: "Just wrapped up recording the drum tracks for the new synthwave track. The neon lights in the studio really set the vibe! 🥁✨",
    mediaUrl: "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?w=800&auto=format&fit=crop&q=80",
    mediaType: "image",
    senderId: "cm-2",
    senderName: "Luca Ferrari",
    senderPhoto: "https://api.dicebear.com/7.x/initials/svg?seed=Luca%20Ferrari",
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 3600 * 2, nanoseconds: 0 },
    likes: ["user1", "user2", "user3", "user4", "user5"],
    targetId: "global"
  },
  {
    id: "dummy-post-2",
    text: "Exploring some ambient soundscapes tonight with my modular synth setup. There's something magical about patching cables in the dark. 🎹🌌",
    mediaUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80",
    mediaType: "image",
    senderId: "cm-3",
    senderName: "Yuki Tanaka",
    senderPhoto: "https://api.dicebear.com/7.x/initials/svg?seed=Yuki%20Tanaka",
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 3600 * 5, nanoseconds: 0 },
    likes: ["user1", "user2", "user3", "user4", "user5", "user6", "user7", "user8"],
    targetId: "global"
  },
  {
    id: "dummy-post-3",
    text: "Got my hands on a vintage neon green Gibson today. The sustain is unreal! Can't wait to play this live at the next community jam. 🎸🔥",
    mediaUrl: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&auto=format&fit=crop&q=80",
    mediaType: "image",
    senderId: "cm-4",
    senderName: "Marcus Webb",
    senderPhoto: "https://api.dicebear.com/7.x/initials/svg?seed=Marcus%20Webb",
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 3600 * 12, nanoseconds: 0 },
    likes: ["user1", "user2", "user3"],
    targetId: "global"
  }
];

const initialDummyComments: Record<string, PostComment[]> = {
  "dummy-post-1": [
    {
      id: "dummy-comment-1-1",
      postId: "dummy-post-1",
      text: "That sounds awesome! Can't wait to hear the final mix.",
      senderId: "cm-3",
      senderName: "Yuki Tanaka",
      senderPhoto: "https://api.dicebear.com/7.x/initials/svg?seed=Yuki%20Tanaka",
      createdAt: { seconds: Math.floor(Date.now() / 1000) - 3600 * 1.8, nanoseconds: 0 }
    },
    {
      id: "dummy-comment-1-2",
      postId: "dummy-post-1",
      text: "Synthwave + live drums is always a killer combination!",
      senderId: "cm-4",
      senderName: "Marcus Webb",
      senderPhoto: "https://api.dicebear.com/7.x/initials/svg?seed=Marcus%20Webb",
      createdAt: { seconds: Math.floor(Date.now() / 1000) - 3600 * 1.5, nanoseconds: 0 }
    }
  ],
  "dummy-post-2": [
    {
      id: "dummy-comment-2-1",
      postId: "dummy-post-2",
      text: "Modular synths are so addictive. Show us the patch map!",
      senderId: "cm-2",
      senderName: "Luca Ferrari",
      senderPhoto: "https://api.dicebear.com/7.x/initials/svg?seed=Luca%20Ferrari",
      createdAt: { seconds: Math.floor(Date.now() / 1000) - 3600 * 4.5, nanoseconds: 0 }
    }
  ],
  "dummy-post-3": [
    {
      id: "dummy-comment-3-1",
      postId: "dummy-post-3",
      text: "Gibson neon series is super rare! You're so lucky.",
      senderId: "cm-2",
      senderName: "Luca Ferrari",
      senderPhoto: "https://api.dicebear.com/7.x/initials/svg?seed=Luca%20Ferrari",
      createdAt: { seconds: Math.floor(Date.now() / 1000) - 3600 * 11, nanoseconds: 0 }
    }
  ]
};

const dummyImageAds = [
  {
    id: "ad1",
    title: "Gibson Custom Shop",
    tagline: "Get 20% Off Limited Edition Neon Guitars",
    image: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&auto=format&fit=crop&q=80",
    color: "#FF5B00"
  },
  {
    id: "ad2",
    title: "Ableton MIDI Controllers",
    tagline: "Community discount active - Save 15% today",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80",
    color: "#00D4FF"
  },
  {
    id: "ad3",
    title: "Global Jam Festival VIP",
    tagline: "Pre-sale VIP backstage passes open",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop&q=80",
    color: "#9D4EDD"
  }
];

const dummyCarouselAds = [
  { text: "🎸 20% OFF Gibson Les Paul Custom for community members. Use code SMFREEGIBSON", color: "#FF5B00" },
  { text: "🎫 Backstage VIP Tickets for Chicago Jam Festival - Pre-sale open now!", color: "#9D4EDD" },
  { text: "🎹 Ableton Push 3 stands, express controllers, MIDI rigs - 15% discount active", color: "#00D4FF" },
  { text: "🥁 Indian Classical Rhythm Masterclass with Pandit Ravi Shankar Jr. - Join live free", color: "#FFD60A" }
];

const formatRelativeTime = (timestampInSeconds: number) => {
  const date = new Date(timestampInSeconds * 1000);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins} minute${mins === 1 ? '' : 's'} ago`;
  }
  if (diffInSeconds < 86400) { // 24 hours
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  if (diffInSeconds < 172800) { // 48 hours
    return "Yesterday";
  }
  return date.toLocaleDateString();
};

export default function CommunityPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();

  // Navigation & View States
  const [activeTab, setActiveTab] = useState<"feed" | "members" | "chats">("feed");
  const [selectedArtist, setSelectedArtist] = useState<ArtistProfile | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [localProfile, setLocalProfile] = useState<UserProfile | null>(null);
  const myUid = localProfile?.musicianId || user?.uid || "";
  const userCollection = localProfile?.musicianId ? "musicians_community" : "users";

  // --- Inline Image Ads Carousel ---
  const [imageAds, setImageAds] = useState<any[]>(dummyImageAds);
  const [carouselAds, setCarouselAds] = useState<any[]>(dummyCarouselAds);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    if (imageAds.length === 0) return;
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % imageAds.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [imageAds]);

  // Real-time listener for database banner ads
  useEffect(() => {
    const q = query(collectionGroup(db, "banner_ads"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbImageAds: any[] = [];
      const dbTextAds: any[] = [];

      const allAds = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as any[];

      // Sort by createdAt in memory
      allAds.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      allAds.forEach((ad) => {
        if (ad.type === "image") {
          dbImageAds.push({
            id: ad.id,
            title: ad.title,
            tagline: ad.tagline,
            image: ad.image,
            color: ad.color || "#FF5B00",
          });
        } else if (ad.type === "text") {
          dbTextAds.push({
            text: ad.text,
            color: ad.color || "#FF5B00",
          });
        }
      });

      if (dbImageAds.length > 0) {
        setImageAds([...dbImageAds, ...dummyImageAds]);
      } else {
        setImageAds(dummyImageAds);
      }

      if (dbTextAds.length > 0) {
        setCarouselAds([...dbTextAds, ...dummyCarouselAds]);
      } else {
        setCarouselAds(dummyCarouselAds);
      }
    });

    return () => unsubscribe();
  }, []);

  // --- Selected Artist Custom Banner Ads ---
  const [selectedArtistAds, setSelectedArtistAds] = useState<any[]>([]);
  const [currentArtistAdIndex, setCurrentArtistAdIndex] = useState(0);

  // Fetch banner ads for the selected artist
  useEffect(() => {
    if (!selectedArtist) {
      setSelectedArtistAds([]);
      return;
    }

    const q = query(
      collection(db, "musicians_community", selectedArtist.uid, "banner_ads")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const adsData: any[] = [];
      snapshot.forEach((doc) => {
        adsData.push({ id: doc.id, ...doc.data() });
      });

      // Sort by createdAt in memory
      adsData.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setSelectedArtistAds(adsData);
    }, (error) => {
      console.error("Error fetching selected artist banner ads:", error);
    });

    return () => unsubscribe();
  }, [selectedArtist]);

  // Rotate selected artist's ads if multiple exist
  useEffect(() => {
    if (selectedArtistAds.length === 0) return;
    setCurrentArtistAdIndex(0);
    const interval = setInterval(() => {
      setCurrentArtistAdIndex((prev) => (prev + 1) % selectedArtistAds.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [selectedArtistAds]);

  // --- Selected Artist Followers Count & State ---
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  // Listen to selected artist followers
  useEffect(() => {
    if (!selectedArtist) {
      setFollowersCount(0);
      setIsFollowing(false);
      return;
    }

    let unsubscribe: () => void = () => { };

    const setupListener = async () => {
      try {
        let collectionName = "musicians_community";
        const mcDocRef = doc(db, "musicians_community", selectedArtist.uid);
        const mcDocSnap = await getDoc(mcDocRef);
        if (!mcDocSnap.exists()) {
          const userDocRef = doc(db, "users", selectedArtist.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            collectionName = "users";
          }
        }

        const followersRef = collection(db, collectionName, selectedArtist.uid, "followers");
        unsubscribe = onSnapshot(followersRef, (snapshot) => {
          setFollowersCount(snapshot.size);
          if (user) {
            const following = snapshot.docs.some(doc => doc.id === myUid);
            setIsFollowing(following);
          } else {
            setIsFollowing(false);
          }
        }, (error) => {
          console.error("Error listening to followers subcollection:", error);
        });
      } catch (err) {
        console.error("Error setting up followers listener:", err);
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [selectedArtist, user, myUid]);

  const handleFollowClick = async () => {
    if (!selectedArtist) return;

    if (!user) {
      const redirectUrl = typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : `/community?artist=${selectedArtist.uid}`;
      router.push(`?auth=true&mode=register&redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    try {
      let collectionName = "musicians_community";
      const mcDocRef = doc(db, "musicians_community", selectedArtist.uid);
      const mcDocSnap = await getDoc(mcDocRef);
      if (!mcDocSnap.exists()) {
        const userDocRef = doc(db, "users", selectedArtist.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          collectionName = "users";
        }
      }

      const followRef = doc(db, collectionName, selectedArtist.uid, "followers", myUid);
      const artistRef = doc(db, collectionName, selectedArtist.uid);

      if (isFollowing) {
        // Unfollow
        await deleteDoc(followRef);
      } else {
        // Follow
        await setDoc(followRef, {
          uid: myUid,
          followedAt: serverTimestamp(),
        });
      }

      // Fetch the updated count
      const followersSnapshot = await getDocs(collection(db, collectionName, selectedArtist.uid, "followers"));
      const newCount = followersSnapshot.size;

      // Update the main document's followers count field
      await updateDoc(artistRef, {
        followers: String(newCount)
      });

      // Update local states
      setFollowersCount(newCount);
      setIsFollowing(!isFollowing);

    } catch (err) {
      console.error("Error toggling follow status:", err);
    }
  };

  // --- Profile Chat Popup Modal States & Logic ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatPopupMessages, setChatPopupMessages] = useState<any[]>([]);
  const [newPopupMessage, setNewPopupMessage] = useState("");
  const popupMessagesEndRef = useRef<HTMLDivElement>(null);

  // Listen to messages for the popup chat
  useEffect(() => {
    if (!isChatOpen || !user || !selectedArtist) {
      setChatPopupMessages([]);
      return;
    }

    let unsubscribe: () => void = () => { };

    const setupPopupChatListener = async () => {
      try {
        const q = query(
          collection(db, userCollection, myUid, "messages", selectedArtist.uid, "chat_history"),
          orderBy("createdAt", "asc"),
          limit(50)
        );

        unsubscribe = onSnapshot(q, (snapshot) => {
          const msgs: any[] = [];
          snapshot.forEach((doc) => {
            msgs.push({ id: doc.id, ...doc.data() });
          });
          setChatPopupMessages(msgs);
        });
      } catch (err) {
        console.error("Error loading chat popup messages:", err);
      }
    };

    setupPopupChatListener();

    return () => unsubscribe();
  }, [isChatOpen, user, selectedArtist, myUid, userCollection]);

  // Scroll popup chat to bottom
  useEffect(() => {
    popupMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatPopupMessages, isChatOpen]);

  const handleSendPopupMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPopupMessage.trim() || !user || !selectedArtist) return;

    const text = newPopupMessage;
    setNewPopupMessage("");

    try {
      let partnerCol = "musicians_community";
      const partnerMcDoc = doc(db, "musicians_community", selectedArtist.uid);
      const partnerMcSnap = await getDoc(partnerMcDoc);
      if (!partnerMcSnap.exists()) {
        partnerCol = "users";
      }

      const senderName = localProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || "Anonymous";
      const messageData = {
        text,
        senderId: myUid,
        senderName,
        senderPhoto: localProfile?.profilePhoto || "",
        createdAt: serverTimestamp(),
      };

      // Write to my message history
      const myHistoryRef = collection(db, userCollection, myUid, "messages", selectedArtist.uid, "chat_history");
      await addDoc(myHistoryRef, messageData);

      // Update my session summary
      const mySessionRef = doc(db, userCollection, myUid, "messages", selectedArtist.uid);
      await setDoc(mySessionRef, {
        lastMessage: text,
        updatedAt: serverTimestamp(),
        partnerId: selectedArtist.uid,
        partnerName: selectedArtist.displayName,
        partnerPhoto: selectedArtist.profilePhoto || "",
      }, { merge: true });

      // Write to partner's message history
      if (myUid !== selectedArtist.uid) {
        const partnerHistoryRef = collection(db, partnerCol, selectedArtist.uid, "messages", myUid, "chat_history");
        await addDoc(partnerHistoryRef, messageData);

        // Update partner's session summary
        const partnerSessionRef = doc(db, partnerCol, selectedArtist.uid, "messages", myUid);
        await setDoc(partnerSessionRef, {
          lastMessage: text,
          updatedAt: serverTimestamp(),
          partnerId: myUid,
          partnerName: senderName,
          partnerPhoto: localProfile?.profilePhoto || "",
        }, { merge: true });
      }
    } catch (err) {
      console.error("Error sending popup message:", err);
    }
  };

  const getContrastTextColor = (hexColor: string | undefined): string => {
    if (!hexColor) return "text-white";
    const cleanColor = hexColor.toUpperCase();
    if (cleanColor.includes("FFD60A") || cleanColor.includes("00D4FF") || cleanColor.includes("00FF85")) {
      return "text-black";
    }
    return "text-white";
  };

  // --- Unread Chats Notification Badge State ---
  const [unreadChatsCount, setUnreadChatsCount] = useState(0);

  // Load artist from URL query parameter on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const artistId = searchParams.get("artist");
      if (artistId) {
        const loadArtistProfile = async () => {
          const profile = await getArtistProfile(artistId);
          if (profile) {
            setSelectedArtist(profile);
            setActiveTab("feed");
          }
        };
        loadArtistProfile();
      }
    }
  }, []);

  // Lists & Directories
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [artistsLoading, setArtistsLoading] = useState(true);

  // --- News Feed States (Global or Wall) ---
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [dummyPostsState, setDummyPostsState] = useState<CommunityPost[]>(dummyPosts);
  const [newPostText, setNewPostText] = useState("");
  const [postImageFile, setPostImageFile] = useState<File | null>(null);
  const [postVideoFile, setPostVideoFile] = useState<File | null>(null);
  const [postMediaPreview, setPostMediaPreview] = useState<string>("");
  const [postMediaType, setPostMediaType] = useState<"image" | "video" | null>(null);
  const [posting, setPosting] = useState(false);
  const [postUploadProgress, setPostUploadProgress] = useState("");
  // Post Edit/Delete States
  const [openPostMenuId, setOpenPostMenuId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editPostText, setEditPostText] = useState("");
  const [isUpdatingPost, setIsUpdatingPost] = useState(false);
  const [postToDelete, setPostToDelete] = useState<{ id: string, targetId: string } | null>(null);
  const [isDeletingPost, setIsDeletingPost] = useState(false);

  // Comments Drawer/Accordion States
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, PostComment[]>>({
    ...initialDummyComments
  });
  const [newCommentTexts, setNewCommentTexts] = useState<Record<string, string>>({});
  const commentsUnsubscribeMap = useRef<Record<string, () => void>>({});

  // File Input Refs
  const feedImageRef = useRef<HTMLInputElement>(null);
  const feedVideoRef = useRef<HTMLInputElement>(null);

  // --- Direct Chat States ---
  const [chats, setChats] = useState<DirectChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<DirectChat | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newDirectMessage, setNewDirectMessage] = useState("");
  const directMessagesEndRef = useRef<HTMLDivElement>(null);
  const directMessagesUnsubscribe = useRef<(() => void) | null>(null);
  const [partnerProfiles, setPartnerProfiles] = useState<Record<string, ArtistProfile>>({});

  // Load partner profiles dynamically
  useEffect(() => {
    const fetchPartnerProfiles = async () => {
      const newProfiles = { ...partnerProfiles };
      let updated = false;

      for (const chat of chats) {
        const partnerId = chat.partnerId || chat.id;
        if (partnerId && !newProfiles[partnerId]) {
          const profile = await getArtistProfile(partnerId);
          if (profile) {
            newProfiles[partnerId] = profile;
            updated = true;
          }
        }
      }

      if (updated) {
        setPartnerProfiles(newProfiles);
      }
    };

    if (chats.length > 0) {
      fetchPartnerProfiles();
    }
  }, [chats]);

  // Load User Profile
  useEffect(() => {
    console.log("CommunityPage - useAuth Hook Output:", { user, userProfile });
    if (userProfile) {
      console.log("CommunityPage - localProfile loading with isCommunityMember:", userProfile.isCommunityMember);
      setLocalProfile(userProfile);
    } else {
      setLocalProfile(null);
    }
  }, [user, userProfile]);

  useEffect(() => {
    if (selectedArtist) {
      console.log("PROFILE COMPARISON LOG:", {
        selectedArtistUid: selectedArtist.uid,
        userUid: user?.uid,
        match: selectedArtist.uid === user?.uid
      });
    }
  }, [selectedArtist, user]);

  // Load Artists Directory
  useEffect(() => {
    const loadArtists = async () => {
      setArtistsLoading(true);
      const members = await getCommunityArtists();
      setArtists(members);
      setArtistsLoading(false);
    };
    loadArtists();
  }, [localProfile]);

  // Listen to News Feed Posts (Global Feed or Wall Feed)
  useEffect(() => {
    // If viewing a specific artist, fetch from their myWallPosts subcollection.
    // If viewing the global feed, fetch from the global community_posts.
    const q = selectedArtist 
      ? query(collection(db, "musicians_community", selectedArtist.uid, "myWallPosts"))
      : query(collection(db, "community_posts"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const feedData: CommunityPost[] = [];
      snapshot.forEach((doc) => {
        feedData.push({ id: doc.id, ...doc.data() } as CommunityPost);
      });
      // Sort in memory to avoid Firestore index requirement
      feedData.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setPosts(feedData.slice(0, 30));
    });

    return () => unsubscribe();
  }, [localProfile, selectedArtist, activeTab]);

  // Listen to Comments when a post's comments section is expanded
  useEffect(() => {
    if (openCommentsPostId) {
      if (openCommentsPostId.startsWith("dummy-post-")) {
        return;
      }
      // If we already have a listener, return
      if (commentsUnsubscribeMap.current[openCommentsPostId]) return;

      const q = query(
        collection(db, "community_comments"),
        where("postId", "==", openCommentsPostId)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const commentsData: PostComment[] = [];
        snapshot.forEach((doc) => {
          commentsData.push({ id: doc.id, ...doc.data() } as PostComment);
        });
        // Sort in memory to avoid Firestore index requirement
        commentsData.sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeA - timeB;
        });
        setCommentsMap(prev => ({
          ...prev,
          [openCommentsPostId]: commentsData
        }));
      });

      commentsUnsubscribeMap.current[openCommentsPostId] = unsubscribe;
    }

    return () => {
      // Cleanup all comments listeners on tab change or destroy
    };
  }, [openCommentsPostId]);

  // Listen to user's Direct Chats list
  useEffect(() => {
    if (user && activeTab === "chats") {
      const q = query(
        collection(db, userCollection, myUid, "messages")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const chatList: DirectChat[] = [];
        snapshot.forEach((doc) => {
          chatList.push({ id: doc.id, ...doc.data() } as DirectChat);
        });
        // Sort in memory to avoid Firestore index requirement
        chatList.sort((a, b) => {
          const timeA = a.updatedAt?.seconds || 0;
          const timeB = b.updatedAt?.seconds || 0;
          return timeB - timeA;
        });
        setChats(chatList);
      }, (error) => {
        console.error("Error listening to chats list:", error);
      });

      return () => unsubscribe();
    }
  }, [user, myUid, userCollection, activeTab]);

  // Listen to messages of selected Direct Chat
  useEffect(() => {
    if (selectedChat && user) {
      if (directMessagesUnsubscribe.current) {
        directMessagesUnsubscribe.current();
      }

      const q = query(
        collection(db, userCollection, myUid, "messages", selectedChat.id, "chat_history")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgList: ChatMessage[] = [];
        snapshot.forEach((doc) => {
          msgList.push({ id: doc.id, ...doc.data() } as ChatMessage);
        });
        // Sort in memory to avoid Firestore index requirement
        msgList.sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeA - timeB;
        });
        setChatMessages(msgList.slice(-50)); // limit to last 50 messages
      }, (error) => {
        console.error("Error listening to chat messages:", error);
      });

      directMessagesUnsubscribe.current = unsubscribe;
    } else {
      setChatMessages([]);
    }

    return () => {
      if (directMessagesUnsubscribe.current) {
        directMessagesUnsubscribe.current();
        directMessagesUnsubscribe.current = null;
      }
    };
  }, [selectedChat, user, myUid, userCollection]);

  // Scroll to bottom of chat
  useEffect(() => {
    directMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // --- Handlers & Actions ---

  const handleJoinSuccess = (updatedProfile: UserProfile) => {
    setLocalProfile(updatedProfile);
    setIsRegisterOpen(false);
    setActiveTab("feed");
  };

  const handleTabClick = (tab: "feed" | "members" | "chats") => {
    if (!user) {
      router.push("?auth=true&redirect=/community");
      return;
    }

    if (!localProfile?.isCommunityMember) {
      setIsRegisterOpen(true);
      return;
    }

    setSelectedArtist(null); // return to global view
    setActiveTab(tab);

    if (tab === "chats") {
      setUnreadChatsCount(0); // clear count when entering chats
    }
  };

  const handleViewProfile = (artist: ArtistProfile) => {
    if (!user) {
      router.push("?auth=true&redirect=/community");
      return;
    }

    if (!localProfile?.isCommunityMember) {
      setIsRegisterOpen(true);
      return;
    }

    setSelectedArtist(artist);
    setActiveTab("feed"); // profile view contains feed (wall)
  };

  // Cloudinary media uploader for feed posts
  const uploadPostMedia = async (file: File, type: "image" | "video"): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return type === "image"
        ? "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80"
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
      throw new Error(errRes.error?.message || "Failed to upload post media");
    }

    const data = await res.json();
    return data.secure_url;
  };

  // Submit Post (Global Feed or Artist Profile Wall)
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() && !postImageFile && !postVideoFile) return;
    if (!user) return;

    setPosting(true);
    setPostUploadProgress("Publishing...");

    try {
      let mediaUrl = "";
      let mediaType: "image" | "video" | undefined = undefined;

      if (postImageFile) {
        setPostUploadProgress("Uploading image...");
        mediaUrl = await uploadPostMedia(postImageFile, "image");
        mediaType = "image";
      } else if (postVideoFile) {
        setPostUploadProgress("Uploading video...");
        mediaUrl = await uploadPostMedia(postVideoFile, "video");
        mediaType = "video";
      }

      const targetId = selectedArtist ? selectedArtist.uid : "global";
      const targetName = selectedArtist ? selectedArtist.displayName : "global";

      const postColRef = selectedArtist
        ? collection(db, "musicians_community", selectedArtist.uid, "myWallPosts")
        : collection(db, "community_posts");

      await addDoc(postColRef, {
        text: newPostText,
        mediaUrl: mediaUrl || "",
        mediaType: mediaType || null,
        senderId: myUid,
        senderName: artists.find(a => a.uid === myUid)?.displayName || localProfile?.displayName || user.displayName || "Anonymous Musician",
        senderPhoto: artists.find(a => a.uid === myUid)?.profilePhoto || localProfile?.profilePhoto || user.photoURL || "",
        likes: [],
        createdAt: serverTimestamp(),
        targetId,
        targetName
      });

      setNewPostText("");
      setPostImageFile(null);
      setPostVideoFile(null);
      setPostMediaPreview("");
      setPostMediaType(null);
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setPosting(false);
      setPostUploadProgress("");
    }
  };

  // Post Likes
  const handleLikePost = async (postId: string, currentLikes: string[]) => {
    if (!user) return;
    if (postId.startsWith("dummy-post-")) {
      setDummyPostsState(prev => prev.map(post => {
        if (post.id === postId) {
          const liked = post.likes.includes(myUid);
          const newLikes = liked
            ? post.likes.filter(id => id !== myUid)
            : [...post.likes, myUid];
          return { ...post, likes: newLikes };
        }
        return post;
      }));
      return;
    }
    try {
      const postRef = selectedArtist
        ? doc(db, "musicians_community", selectedArtist.uid, "myWallPosts", postId)
        : doc(db, "community_posts", postId);
      if (currentLikes.includes(myUid)) {
        await updateDoc(postRef, {
          likes: arrayRemove(myUid)
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(myUid)
        });
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  // Comments Submission
  const handleCommentSubmit = async (postId: string) => {
    const text = newCommentTexts[postId];
    if (!text?.trim() || !user) return;

    if (postId.startsWith("dummy-post-")) {
      setNewCommentTexts(prev => ({ ...prev, [postId]: "" }));
      const newComment: PostComment = {
        id: `dummy-comment-${Date.now()}`,
        postId,
        text: text.trim(),
        senderId: myUid,
        senderName: artists.find(a => a.uid === myUid)?.displayName || localProfile?.displayName || user.displayName || "Anonymous Musician",
        senderPhoto: artists.find(a => a.uid === myUid)?.profilePhoto || localProfile?.profilePhoto || user.photoURL || "",
        createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }
      };
      setCommentsMap(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment]
      }));
      return;
    }

    try {
      // Clear input text early
      setNewCommentTexts(prev => ({ ...prev, [postId]: "" }));

      await addDoc(collection(db, "community_comments"), {
        postId,
        text: text.trim(),
        senderId: myUid,
        senderName: artists.find(a => a.uid === myUid)?.displayName || localProfile?.displayName || user.displayName || "Anonymous Musician",
        senderPhoto: artists.find(a => a.uid === myUid)?.profilePhoto || localProfile?.profilePhoto || user.photoURL || "",
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };
  const handleDeletePost = (postId: string, targetId: string) => {
    setPostToDelete({ id: postId, targetId });
    setOpenPostMenuId(null);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;
    setIsDeletingPost(true);
    try {
      const postRef = postToDelete.targetId && postToDelete.targetId !== "global"
        ? doc(db, "musicians_community", postToDelete.targetId, "myWallPosts", postToDelete.id)
        : doc(db, "community_posts", postToDelete.id);
      await deleteDoc(postRef);
      setPostToDelete(null);
    } catch (err) {
      console.error("Error deleting post:", err);
    } finally {
      setIsDeletingPost(false);
    }
  };

  const handleEditPostSubmit = async (postId: string, targetId: string) => {
    if (!editPostText.trim()) {
      setEditingPostId(null);
      return;
    }
    setIsUpdatingPost(true);
    try {
      const postRef = targetId && targetId !== "global"
        ? doc(db, "musicians_community", targetId, "myWallPosts", postId)
        : doc(db, "community_posts", postId);
      await updateDoc(postRef, { text: editPostText.trim() });
      setEditingPostId(null);
      setOpenPostMenuId(null);
    } catch (err) {
      console.error("Error updating post:", err);
    } finally {
      setIsUpdatingPost(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "image") {
        setPostImageFile(file);
        setPostVideoFile(null);
        setPostMediaPreview(URL.createObjectURL(file));
        setPostMediaType("image");
      } else {
        setPostVideoFile(file);
        setPostImageFile(null);
        setPostMediaPreview(URL.createObjectURL(file));
        setPostMediaType("video");
      }
    }
  };

  // Direct Message Setup & Initiation
  const handleStartDirectChat = async (targetArtist: ArtistProfile) => {
    if (!user || !localProfile) return;

    try {
      // Determine partner's collection prefix
      let partnerCol = "musicians_community";
      const partnerMcDoc = doc(db, "musicians_community", targetArtist.uid);
      const partnerMcSnap = await getDoc(partnerMcDoc);
      if (!partnerMcSnap.exists()) {
        partnerCol = "users";
      }

      // Initialize my session summary
      const mySessionRef = doc(db, userCollection, myUid, "messages", targetArtist.uid);
      await setDoc(mySessionRef, {
        lastMessage: "Conversation started.",
        updatedAt: serverTimestamp(),
        partnerId: targetArtist.uid,
        partnerName: targetArtist.displayName,
        partnerPhoto: targetArtist.profilePhoto || "",
      }, { merge: true });

      // Initialize partner's session summary
      if (myUid !== targetArtist.uid) {
        const senderName = localProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || "Anonymous";
        const partnerSessionRef = doc(db, partnerCol, targetArtist.uid, "messages", myUid);
        await setDoc(partnerSessionRef, {
          lastMessage: "Conversation started.",
          updatedAt: serverTimestamp(),
          partnerId: myUid,
          partnerName: senderName,
          partnerPhoto: localProfile?.profilePhoto || "",
        }, { merge: true });
      }

      // Navigate to chat tab
      setSelectedArtist(null);
      setActiveTab("chats");

      // Load newly initialized chat
      setSelectedChat({
        id: targetArtist.uid,
        partnerId: targetArtist.uid,
        partnerName: targetArtist.displayName,
        partnerPhoto: targetArtist.profilePhoto || "",
        lastMessage: "Conversation started.",
        updatedAt: null
      });

    } catch (err) {
      console.error("Error starting direct chat:", err);
    }
  };

  // Submit Direct Message text
  const handleSendDirectMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDirectMessage.trim() || !user || !selectedChat) return;

    const partnerId = selectedChat.partnerId || selectedChat.id;
    const partnerName = selectedChat.partnerName || "Anonymous";
    const partnerPhoto = selectedChat.partnerPhoto || "";

    try {
      const msgText = newDirectMessage;
      setNewDirectMessage(""); // Clear text input early

      // Determine partner's collection prefix
      let partnerCol = "musicians_community";
      const partnerMcDoc = doc(db, "musicians_community", partnerId);
      const partnerMcSnap = await getDoc(partnerMcDoc);
      if (!partnerMcSnap.exists()) {
        partnerCol = "users";
      }

      const senderName = localProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || "Anonymous";
      const messageData = {
        text: msgText,
        senderId: myUid,
        senderName,
        senderPhoto: localProfile?.profilePhoto || "",
        createdAt: serverTimestamp(),
      };

      // Write to my message history
      const myHistoryRef = collection(db, userCollection, myUid, "messages", partnerId, "chat_history");
      await addDoc(myHistoryRef, messageData);

      // Update my session summary
      const mySessionRef = doc(db, userCollection, myUid, "messages", partnerId);
      await setDoc(mySessionRef, {
        lastMessage: msgText,
        updatedAt: serverTimestamp(),
        partnerId: partnerId,
        partnerName: partnerName,
        partnerPhoto: partnerPhoto,
      }, { merge: true });

      // Write to partner's message history
      if (myUid !== partnerId) {
        const partnerHistoryRef = collection(db, partnerCol, partnerId, "messages", myUid, "chat_history");
        await addDoc(partnerHistoryRef, messageData);

        // Update partner's session summary
        const partnerSessionRef = doc(db, partnerCol, partnerId, "messages", myUid);
        await setDoc(partnerSessionRef, {
          lastMessage: msgText,
          updatedAt: serverTimestamp(),
          partnerId: myUid,
          partnerName: senderName,
          partnerPhoto: localProfile?.profilePhoto || "",
        }, { merge: true });
      }
    } catch (err) {
      console.error("Error sending direct message:", err);
    }
  };

  // Use only db posts for global feed
  const displayedPosts = posts;

  const renderSidebar = () => {
    // If the user is a community member, find their real profile data from the loaded artists list
    const activeArtistProfile = localProfile?.isCommunityMember
      ? artists.find(a => a.uid === myUid)
      : null;

    const displayName = activeArtistProfile?.displayName || localProfile?.displayName || "";
    const profilePhoto = activeArtistProfile?.profilePhoto || localProfile?.profilePhoto || "";
    const roleOrPhone = activeArtistProfile?.instrument || localProfile?.phone || "Active Member";
    const color = activeArtistProfile?.color || "#FF5B00";
    const coverGradient = activeArtistProfile?.coverPhoto
      ? `url(${activeArtistProfile.coverPhoto}) center/cover`
      : `linear-gradient(to right, ${color}4d, #9D4EDD4d)`;

    return (
      <div className="w-full lg:w-[280px] shrink-0 space-y-6">
        {/* User card profile preview */}
        {localProfile && (
          <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden relative shadow-xl">
            <div
              className="h-16 w-full relative"
              style={{ background: coverGradient }}
            />
            <div className="p-4 pt-0 relative flex flex-col items-center -mt-10 text-center">
              <div
                className="w-20 h-20 rounded-full border-4 border-[#050505] bg-[#111] flex items-center justify-center font-orbitron font-bold text-2xl overflow-hidden shrink-0 shadow-[0_0_15px_rgba(255,91,0,0.3)]"
                style={{ border: `2px solid ${color}` }}
              >
                {profilePhoto ? (
                  <img src={profilePhoto} alt="" className="w-full h-full object-cover" />
                ) : (
                  displayName.charAt(0)
                )}
              </div>
              <h4 className="font-orbitron font-black text-white text-sm mt-3 leading-snug">
                {displayName}
              </h4>
              <p className="font-space text-[10px] text-white/40 mt-1 uppercase tracking-wider">
                {roleOrPhone}
              </p>
            </div>
          </div>
        )}

        {/* Sidebar Navigation */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-2.5 space-y-2 shadow-xl font-space relative overflow-hidden">
          <button
            onClick={() => handleTabClick("feed")}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold tracking-wide transition-all ${activeTab === "feed" && !selectedArtist
                ? "bg-[#9D4EDD]/15 text-[#9D4EDD] shadow-[0_0_15px_rgba(157,78,221,0.15)] border-l-4 border-[#9D4EDD]"
                : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
          >
            <Rss size={16} />
            Global Feed
          </button>

          <button
            onClick={() => handleTabClick("members")}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold tracking-wide transition-all ${activeTab === "members" && !selectedArtist
                ? "bg-[#FF5B00]/15 text-[#FF5B00] shadow-[0_0_15px_rgba(255,91,0,0.15)] border-l-4 border-[#FF5B00]"
                : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
          >
            <Users size={16} />
            Musicians Directory
          </button>

          {/* Neon Styled View Messages Card */}
          <button
            onClick={() => handleTabClick("chats")}
            className={`w-full mt-2 relative overflow-hidden group text-left px-4 py-3.5 rounded-xl flex items-center justify-between text-sm font-bold tracking-wide transition-all ${activeTab === "chats" && !selectedArtist
                ? "bg-gradient-to-r from-[#00D4FF]/20 to-[#9D4EDD]/20 text-white shadow-[0_0_20px_rgba(0,212,255,0.3)] border border-[#00D4FF]/50"
                : "bg-[#1A1A1A] text-white/80 border border-white/10 hover:border-[#00D4FF]/30 hover:shadow-[0_0_15px_rgba(0,212,255,0.15)]"
              }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF]/0 via-[#00D4FF]/10 to-[#9D4EDD]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex items-center gap-3 relative z-10">
              <div className={`p-1.5 rounded-lg ${activeTab === "chats" && !selectedArtist ? "bg-[#00D4FF] text-black shadow-[0_0_10px_rgba(0,212,255,0.8)]" : "bg-white/10 text-[#00D4FF] group-hover:text-white group-hover:bg-[#00D4FF] transition-all"}`}>
                <MessageSquare size={16} />
              </div>
              <span className="uppercase tracking-widest text-[11px] text-[#00D4FF] group-hover:text-white transition-colors">
                View Messages
              </span>
            </div>
            {unreadChatsCount > 0 && (
              <span className="relative z-10 bg-[#00D4FF] text-black text-[10px] font-black font-space px-2.5 py-0.5 rounded-full shadow-[0_0_15px_rgba(0,212,255,0.8)] animate-pulse shrink-0 border border-white/20">
                {unreadChatsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    );
  };

  // Dynamic Ads loaded from database state

  return (
    <>
      <div className="scan-line" />

      <Suspense fallback={null}>
        <AuthModalWrapper />
      </Suspense>

      <Navbar />

      <main className="page-content pt-16 min-h-screen flex flex-col bg-[#050505] relative">

        <NeonInstrumentsBg variant="community" />
        <div className="absolute inset-0 grid-overlay opacity-15 pointer-events-none" />

        {/* 1. TOP CAROUSEL ADS BAR */}
        <div className="w-full bg-[#0a0a0a] border-b border-white/5 py-3 relative overflow-hidden shrink-0 z-20">
          <div className="flex whitespace-nowrap animate-marquee">
            <div className="flex gap-20 px-4">
              {carouselAds.map((ad, idx) => (
                <span key={idx} className="font-space text-xs font-bold tracking-wide flex items-center gap-2" style={{ color: ad.color }}>
                  <Sparkles size={12} className="animate-spin" />
                  {ad.text}
                </span>
              ))}
            </div>
            <div className="flex gap-20 px-4" aria-hidden="true">
              {carouselAds.map((ad, idx) => (
                <span key={`dup-${idx}`} className="font-space text-xs font-bold tracking-wide flex items-center gap-2" style={{ color: ad.color }}>
                  <Sparkles size={12} className="animate-spin" />
                  {ad.text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Back to Home Navigation Bar */}
        <div className="w-full border-b border-white/5 bg-[#050505]/50 backdrop-blur-md relative z-30">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <button
              onClick={() => router.push("/")}
              className="group relative flex items-center gap-3 px-5 py-2.5 bg-[#111] rounded-xl border border-white/10 hover:border-[#00D4FF]/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.2)] transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF]/0 via-[#00D4FF]/10 to-[#9D4EDD]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <ArrowLeft size={16} className="text-[#00D4FF] group-hover:text-white transition-colors relative z-10" />
              <span className="font-space font-bold tracking-widest uppercase text-[11px] text-[#00D4FF] group-hover:text-white transition-colors relative z-10 drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]">
                Back to Home
              </span>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00D4FF] to-[#9D4EDD] opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500 z-0 pointer-events-none" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 relative z-10 flex flex-col lg:flex-row gap-8">

          {/* 2. DYNAMIC PROFILE HEADER (When viewing a specific artist) */}
          {selectedArtist ? (
            <div className="w-full flex flex-col lg:flex-row gap-8">
              {/* Left Sidebar */}
              {localProfile?.isCommunityMember && renderSidebar()}

              {/* Profile Details Right Column */}
              <div className="flex-1 min-w-0 flex flex-col gap-6">
                {/* Cover Header container */}
                <div className="relative rounded-2xl overflow-hidden bg-[#111] border border-white/5 shadow-2xl">
                  {/* Cover Image Background */}
                  <div className="h-48 md:h-64 w-full bg-[#111] relative">
                    {selectedArtist.coverPhoto ? (
                      <img
                        src={selectedArtist.coverPhoto}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-[#9D4EDD]/30 via-black to-[#00D4FF]/30" />
                    )}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.2)_0%,rgba(5,5,5,0.8)_100%)]" />
                    <div className="absolute inset-0 grid-overlay opacity-20" />
                  </div>

                  {/* Profile info overlapping container */}
                  <div className="p-6 pt-0 relative flex flex-col md:flex-row items-center md:items-end justify-between gap-6 -mt-16 md:-mt-20">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                      {/* Rounded Profile Avatar */}
                      <div
                        className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-[#050505] bg-[#111] flex items-center justify-center font-orbitron font-bold text-4xl shadow-2xl overflow-hidden shrink-0 relative"
                        style={{
                          color: selectedArtist.color,
                          boxShadow: `0 0 30px ${selectedArtist.color}40`,
                          border: `3px solid ${selectedArtist.color}`
                        }}
                      >
                        {selectedArtist.profilePhoto ? (
                          <img src={selectedArtist.profilePhoto} alt="" className="w-full h-full object-cover" />
                        ) : (
                          selectedArtist.displayName.charAt(0)
                        )}
                        {selectedArtist.verified && (
                          <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1 border-2 border-black">
                            <CheckCircle size={12} className="text-white" />
                          </div>
                        )}
                      </div>

                      {/* User profile metadata */}
                      <div className="pb-2">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5">
                          <h2 className="text-2xl md:text-3xl font-orbitron font-black text-white leading-none">
                            {selectedArtist.displayName}
                          </h2>
                        </div>
                        <p className="font-space text-[#FF5B00] text-sm md:text-base font-bold uppercase tracking-wider mb-1">
                          {selectedArtist.instrument}
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-space text-white/40">
                          <span className="flex items-center gap-1"><MapPin size={12} /> {selectedArtist.district}</span>
                          <span>•</span>
                          <span>{followersCount} followers</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions column */}
                    <div className="flex items-center gap-3 pb-2 shrink-0">
                      {user && selectedArtist.uid === myUid ? (
                        <button
                          onClick={() => handleTabClick("chats")}
                          className="btn-neon btn-orange text-xs px-6 py-2.5 flex items-center gap-1.5"
                        >
                          <MessageSquare size={13} />
                          View Messages
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              if (!user) {
                                const redirectUrl = typeof window !== "undefined"
                                  ? window.location.pathname + window.location.search
                                  : `/community?artist=${selectedArtist.uid}`;
                                router.push(`?auth=true&mode=register&redirect=${encodeURIComponent(redirectUrl)}`);
                              } else {
                                setIsChatOpen(true);
                              }
                            }}
                            className="btn-neon btn-orange text-xs px-6 py-2.5 flex items-center gap-1.5"
                          >
                            <MessageSquare size={13} />
                            Send Message
                          </button>
                          <button
                            onClick={handleFollowClick}
                            className={`btn-neon ${isFollowing ? 'btn-outline-blue' : 'btn-blue'} text-xs px-6 py-2.5 flex items-center gap-1.5`}
                          >
                            {isFollowing ? <CheckCircle size={13} /> : <User size={13} />}
                            {isFollowing ? "Following" : "Follow"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile grid content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* Left Column: About Section */}
                  <div className="md:col-span-1 space-y-6">
                    <div className="bg-[#111] border border-white/5 rounded-2xl p-5 space-y-4">
                      <h3 className="font-orbitron font-bold text-sm text-white uppercase tracking-widest border-b border-white/5 pb-3">
                        About Musician
                      </h3>

                      <p className="font-space text-sm text-white/60 leading-relaxed">
                        {selectedArtist.aboutMe || "No bio added yet."}
                      </p>

                      <div className="space-y-2 pt-2 text-xs font-space text-white/40 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <Phone size={12} className="text-[#FF5B00]" />
                          <span>{selectedArtist.phone || "No phone listed"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={12} className="text-[#00D4FF]" />
                          <span>{selectedArtist.district || "Worldwide"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Intro Video Player */}
                    {selectedArtist.videoUrl && (
                      <div className="bg-[#111] border border-white/5 rounded-2xl p-4 space-y-3">
                        <h4 className="font-orbitron font-bold text-xs text-white/60 uppercase tracking-widest flex items-center gap-1.5">
                          <VideoIcon size={12} />
                          Intro Clip
                        </h4>
                        <div className="rounded-xl overflow-hidden bg-black border border-white/5">
                          <video src={selectedArtist.videoUrl} controls className="w-full aspect-video" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Wall Feed */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Selected Artist Custom Banner Ads */}
                    {selectedArtistAds.length > 0 && (
                      <div className={`relative rounded-2xl overflow-hidden border border-white/5 bg-[#111] shadow-xl flex transition-all duration-300 ${selectedArtistAds[currentArtistAdIndex]?.type === "image"
                          ? "min-h-[160px] md:min-h-[180px]"
                          : "min-h-[112px]"
                        }`}>
                        <div className={`relative w-full transition-all duration-300 ${selectedArtistAds[currentArtistAdIndex]?.type === "image"
                            ? "min-h-[160px] md:min-h-[180px]"
                            : "min-h-[112px]"
                          }`}>
                          <AnimatePresence mode="wait">
                            {(() => {
                              const ad = selectedArtistAds[currentArtistAdIndex];
                              if (!ad) return null;
                              return (
                                <motion.div
                                  key={ad.id || currentArtistAdIndex}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ duration: 0.4 }}
                                  className="absolute inset-0 flex items-center p-5"
                                >
                                  {ad.type === "image" ? (
                                    <>
                                      {ad.image && (
                                        <img
                                          src={ad.image}
                                          alt=""
                                          className="w-full h-full object-cover opacity-50 absolute inset-0"
                                        />
                                      )}
                                      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                                      <div className="relative z-10 flex flex-col justify-center">
                                        <span
                                          className="text-[9px] font-bold font-space uppercase tracking-widest px-2 py-0.5 rounded w-max mb-1.5 flex items-center gap-1"
                                          style={{
                                            backgroundColor: `${ad.color}15`,
                                            color: ad.color,
                                            border: `1px solid ${ad.color}40`
                                          }}
                                        >
                                          <Megaphone size={10} />
                                          Artist Offer
                                        </span>
                                        <h4 className="font-orbitron font-bold text-sm md:text-base text-white uppercase tracking-wider">
                                          {ad.title}
                                        </h4>
                                        <p className="font-space text-xs text-white/60 mt-0.5">
                                          {ad.tagline}
                                        </p>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="relative z-10 flex flex-col justify-center w-full">
                                      <span
                                        className="text-[9px] font-bold font-space uppercase tracking-widest px-2 py-0.5 rounded w-max mb-2 flex items-center gap-1"
                                        style={{
                                          backgroundColor: `${ad.color}15`,
                                          color: ad.color,
                                          border: `1px solid ${ad.color}30`
                                        }}
                                      >
                                        <Sparkles size={10} />
                                        Featured Shoutout
                                      </span>
                                      <p className="font-space text-sm text-white/80 leading-relaxed pl-1" style={{ borderLeft: `3px solid ${ad.color}` }}>
                                        {ad.text}
                                      </p>
                                    </div>
                                  )}
                                </motion.div>
                              );
                            })()}
                          </AnimatePresence>

                          {selectedArtistAds.length > 1 && (
                            <div className="absolute bottom-2 right-4 flex gap-1.5 z-20">
                              {selectedArtistAds.map((_, idx) => (
                                <button
                                  type="button"
                                  key={idx}
                                  onClick={() => setCurrentArtistAdIndex(idx)}
                                  className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentArtistAdIndex ? "bg-white w-3" : "bg-white/20"
                                    }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Create post on Wall */}
                    <form onSubmit={handlePostSubmit} className="bg-[#111] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full border border-white/15 bg-white/5 shrink-0 flex items-center justify-center font-bold text-white overflow-hidden">
                          {localProfile?.profilePhoto ? (
                            <img src={localProfile.profilePhoto} alt="" className="w-full h-full object-cover" />
                          ) : (
                            localProfile?.displayName?.charAt(0)
                          )}
                        </div>
                        <textarea
                          value={newPostText}
                          onChange={(e) => setNewPostText(e.target.value)}
                          placeholder={`Write something on ${selectedArtist.displayName}'s wall...`}
                          rows={3}
                          className="flex-1 bg-transparent border-0 resize-none font-space text-sm text-white focus:ring-0 focus:outline-none placeholder-white/30"
                          disabled={posting}
                        />
                      </div>

                      {/* Preview attachments */}
                      {postMediaPreview && (
                        <div className="relative rounded-xl overflow-hidden border border-white/10 max-h-[200px] w-full max-w-sm bg-black">
                          {postMediaType === "image" ? (
                            <img src={postMediaPreview} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <video src={postMediaPreview} controls className="w-full h-full max-h-[200px]" />
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setPostImageFile(null);
                              setPostVideoFile(null);
                              setPostMediaPreview("");
                              setPostMediaType(null);
                            }}
                            className="absolute top-2 right-2 bg-black/70 hover:bg-black p-1.5 rounded-full text-white transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            accept="image/*"
                            ref={feedImageRef}
                            onChange={(e) => handleFileChange(e, "image")}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => feedImageRef.current?.click()}
                            disabled={posting}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/3 hover:bg-white/10 text-white/60 hover:text-white font-space text-xs transition-colors"
                          >
                            <ImageIcon size={13} className="text-[#9D4EDD]" />
                            Photo
                          </button>

                          <input
                            type="file"
                            accept="video/*"
                            ref={feedVideoRef}
                            onChange={(e) => handleFileChange(e, "video")}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => feedVideoRef.current?.click()}
                            disabled={posting}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/3 hover:bg-white/10 text-white/60 hover:text-white font-space text-xs transition-colors"
                          >
                            <VideoIcon size={13} className="text-[#00D4FF]" />
                            Video
                          </button>
                        </div>

                        <button
                          type="submit"
                          disabled={posting || (!newPostText.trim() && !postImageFile && !postVideoFile)}
                          className="btn-neon btn-orange text-xs px-6 py-2 flex items-center gap-2 disabled:opacity-40"
                        >
                          {posting ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              <span>{postUploadProgress || "Publishing..."}</span>
                            </>
                          ) : (
                            "Post on Wall"
                          )}
                        </button>
                      </div>
                    </form>

                    {/* Wall Posts display */}
                    <div className="space-y-6">
                      {posts.length > 0 ? (
                        posts.map((post) => {
                          const isLiked = post.likes?.includes(user?.uid || "");
                          const isCommentsOpen = openCommentsPostId === post.id;
                          const comments = commentsMap[post.id] || [];
                          return (
                            <div key={post.id} className="bg-[#111] border border-white/5 rounded-2xl p-5 space-y-4 shadow-[0_0_15px_rgba(0,212,255,0.05)] hover:shadow-[0_0_25px_rgba(0,212,255,0.15)] hover:border-[#00D4FF]/30 transition-all duration-300 relative overflow-hidden group">
                              {/* Neon Top Accent */}
                              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#FF5B00] via-[#9D4EDD] to-[#00D4FF]"></div>
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center font-bold text-white overflow-hidden">
                                    {post.senderPhoto ? (
                                      <img src={post.senderPhoto} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      post.senderName.charAt(0)
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-space font-bold text-sm text-white flex items-center gap-1.5">
                                      {post.senderName}
                                      {post.targetId && post.targetId !== "global" && post.targetName && post.targetId !== post.senderId && (
                                        <>
                                          <span className="text-[#00D4FF] text-[10px]">▶</span>
                                          <span className="text-white/70">{post.targetName}</span>
                                        </>
                                      )}
                                    </h4>
                                    <span className="font-space text-[10px] text-white/30">
                                      {post.createdAt ? formatRelativeTime(post.createdAt.seconds) : "Just now"}
                                    </span>
                                  </div>
                                </div>
                                {myUid === post.senderId && (
                                  <div className="relative z-20">
                                    <button 
                                      onClick={() => setOpenPostMenuId(openPostMenuId === post.id ? null : post.id)}
                                      className="text-white/50 hover:text-white transition-colors p-1"
                                    >
                                      <MoreVertical size={16} />
                                    </button>
                                    {openPostMenuId === post.id && (
                                      <div className="absolute right-0 top-6 w-32 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl overflow-hidden">
                                        <button 
                                          onClick={() => { setEditingPostId(post.id); setEditPostText(post.text); setOpenPostMenuId(null); }}
                                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                                        >
                                          <Edit2 size={14} /> Edit
                                        </button>
                                        <button 
                                          onClick={() => handleDeletePost(post.id, post.targetId)}
                                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#FF3366]/80 hover:bg-[#FF3366]/10 hover:text-[#FF3366] transition-colors"
                                        >
                                          <Trash2 size={14} /> Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              {editingPostId === post.id ? (
                                <div className="space-y-3">
                                  <textarea
                                    value={editPostText}
                                    onChange={(e) => setEditPostText(e.target.value)}
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-sm text-white font-space focus:outline-none focus:border-[#00D4FF]/50"
                                    rows={3}
                                  />
                                  <div className="flex gap-2 justify-end">
                                    <button onClick={() => { setEditingPostId(null); setOpenPostMenuId(null); }} className="px-4 py-1.5 text-xs text-white/50 hover:text-white font-space transition-colors">Cancel</button>
                                    <button onClick={() => handleEditPostSubmit(post.id, post.targetId)} disabled={isUpdatingPost} className="btn-neon btn-orange text-xs px-4 py-1.5 flex items-center gap-2">
                                      {isUpdatingPost ? <Loader2 size={12} className="animate-spin" /> : "Save"}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="font-space text-sm text-white/80 leading-relaxed whitespace-pre-line">
                                  {post.text}
                                </p>
                              )}

                              {post.mediaUrl && (
                                <div className="rounded-xl overflow-hidden border border-white/5 max-h-[300px] bg-black flex items-center justify-center">
                                  {post.mediaType === "image" ? (
                                    <img src={post.mediaUrl} alt="" className="w-full max-h-[300px] object-cover" />
                                  ) : (
                                    <video src={post.mediaUrl} controls className="w-full max-h-[300px]" />
                                  )}
                                </div>
                              )}

                              {/* Interaction Row */}
                              <div className="flex items-center gap-6 pt-3 border-t border-white/5">
                                <button
                                  onClick={() => handleLikePost(post.id, post.likes || [])}
                                  className={`flex items-center gap-1.5 text-xs font-space transition-colors ${isLiked ? "text-red-500" : "text-white/40 hover:text-white"
                                    }`}
                                >
                                  <Heart size={14} className={isLiked ? "fill-red-500" : ""} />
                                  <span>{(post.likes || []).length} Likes</span>
                                </button>

                                <button
                                  onClick={() => setOpenCommentsPostId(isCommentsOpen ? null : post.id)}
                                  className={`flex items-center gap-1.5 text-xs font-space transition-colors ${isCommentsOpen ? "text-[#9D4EDD]" : "text-white/40 hover:text-white"
                                    }`}
                                >
                                  <MessageCircle size={14} />
                                  <span>{comments.length > 0 ? `Comments (${comments.length})` : "Comment"}</span>
                                </button>
                              </div>

                              {/* Expanded Comments section */}
                              {isCommentsOpen && (
                                <div className="pt-4 border-t border-white/5 space-y-4">
                                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                                    {comments.length > 0 ? (
                                      comments.map((comment) => (
                                        <div key={comment.id} className="flex gap-2.5 items-start text-xs font-space">
                                          <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 shrink-0 flex items-center justify-center text-[10px] font-bold overflow-hidden text-neon-purple">
                                            {comment.senderPhoto ? (
                                              <img src={comment.senderPhoto} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                              comment.senderName.charAt(0)
                                            )}
                                          </div>
                                          <div className="flex-1 bg-white/3 rounded-xl p-2.5">
                                            <span className="font-bold text-[#9D4EDD] block mb-0.5">{comment.senderName}</span>
                                            <p className="text-white/80">{comment.text}</p>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-center text-white/30 text-xs py-2">No comments yet. Write yours below!</p>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={newCommentTexts[post.id] || ""}
                                      onChange={(e) => {
                                        const txt = e.target.value;
                                        setNewCommentTexts(prev => ({ ...prev, [post.id]: txt }));
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") handleCommentSubmit(post.id);
                                      }}
                                      placeholder="Write a comment..."
                                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-space focus:outline-none focus:border-[#9D4EDD]"
                                    />
                                    <button
                                      onClick={() => handleCommentSubmit(post.id)}
                                      className="p-2 rounded-lg bg-[#9D4EDD] text-black hover:bg-white transition-colors"
                                    >
                                      <Send size={12} />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-16 bg-white/3 border border-white/5 rounded-2xl">
                          <Rss size={36} className="mx-auto text-white/20 mb-3" />
                          <h4 className="font-space font-bold text-white text-sm mb-1">Wall is empty</h4>
                          <p className="font-space text-xs text-white/40">Be the first to post something on their wall!</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ) : (

            // 3. GLOBAL HUB DASHBOARD (Left Sidebar + Center Stream)
            <div className="w-full flex flex-col lg:flex-row gap-8">

              {/* Left Sidebar */}
              {renderSidebar()}

              {/* Center Social Stream */}
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">

                  {/* TAB A: GLOBAL NEWS FEED */}
                  {activeTab === "feed" && (
                    <motion.div
                      key="global-feed"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="space-y-6"
                    >

                      {/* Create Post Form */}
                      <form onSubmit={handlePostSubmit} className="bg-[#111] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full border border-white/15 bg-white/5 shrink-0 flex items-center justify-center font-bold text-white overflow-hidden">
                            {localProfile?.profilePhoto ? (
                              <img src={localProfile.profilePhoto} alt="" className="w-full h-full object-cover" />
                            ) : (
                              localProfile?.displayName?.charAt(0)
                            )}
                          </div>
                          <textarea
                            value={newPostText}
                            onChange={(e) => setNewPostText(e.target.value)}
                            placeholder="What's happening in your studio? Share a clip or update..."
                            rows={3}
                            className="flex-1 bg-transparent border-0 resize-none font-space text-sm text-white focus:ring-0 focus:outline-none placeholder-white/30"
                            disabled={posting}
                          />
                        </div>

                        {/* Preview media */}
                        {postMediaPreview && (
                          <div className="relative rounded-xl overflow-hidden border border-white/10 max-h-[220px] w-full max-w-sm bg-black">
                            {postMediaType === "image" ? (
                              <img src={postMediaPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <video src={postMediaPreview} controls className="w-full h-full max-h-[220px]" />
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setPostImageFile(null);
                                setPostVideoFile(null);
                                setPostMediaPreview("");
                                setPostMediaType(null);
                              }}
                              className="absolute top-2 right-2 bg-black/70 hover:bg-black p-1.5 rounded-full text-white transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              accept="image/*"
                              ref={feedImageRef}
                              onChange={(e) => handleFileChange(e, "image")}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => feedImageRef.current?.click()}
                              disabled={posting}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/3 hover:bg-white/10 text-white/60 hover:text-white font-space text-xs transition-colors"
                            >
                              <ImageIcon size={13} className="text-[#9D4EDD]" />
                              Add Photo
                            </button>

                            <input
                              type="file"
                              accept="video/*"
                              ref={feedVideoRef}
                              onChange={(e) => handleFileChange(e, "video")}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => feedVideoRef.current?.click()}
                              disabled={posting}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/3 hover:bg-white/10 text-white/60 hover:text-white font-space text-xs transition-colors"
                            >
                              <VideoIcon size={13} className="text-[#00D4FF]" />
                              Add Video
                            </button>
                          </div>

                          <button
                            type="submit"
                            disabled={posting || (!newPostText.trim() && !postImageFile && !postVideoFile)}
                            className="btn-neon btn-orange text-xs px-6 py-2 flex items-center gap-2 disabled:opacity-40"
                          >
                            {posting ? (
                              <>
                                <Loader2 size={12} className="animate-spin" />
                                <span>{postUploadProgress || "Publishing..."}</span>
                              </>
                            ) : (
                              "Post Update"
                            )}
                          </button>
                        </div>
                      </form>

                      {/* Social timeline feed posts */}
                      <div className="space-y-6">
                        {displayedPosts.length > 0 ? (
                          displayedPosts.map((post) => {
                            const isLiked = post.likes?.includes(user?.uid || "");
                            const isCommentsOpen = openCommentsPostId === post.id;
                            const comments = commentsMap[post.id] || [];
                            return (
                              <div key={post.id} className="bg-[#111] border border-white/5 rounded-2xl p-5 space-y-4 shadow-[0_0_15px_rgba(0,212,255,0.05)] hover:shadow-[0_0_25px_rgba(0,212,255,0.15)] hover:border-[#00D4FF]/30 transition-all duration-300 relative overflow-hidden group">
                                {/* Neon Top Accent */}
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#FF5B00] via-[#9D4EDD] to-[#00D4FF]"></div>
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center font-bold text-white overflow-hidden">
                                      {post.senderPhoto ? (
                                        <img src={post.senderPhoto} alt="" className="w-full h-full object-cover" />
                                      ) : (
                                        post.senderName.charAt(0)
                                      )}
                                    </div>
                                    <div>
                                      <h4 className="font-space font-bold text-sm text-white flex items-center gap-1.5">
                                        {post.senderName}
                                        {post.targetId && post.targetId !== "global" && post.targetName && post.targetId !== post.senderId && (
                                          <>
                                            <span className="text-[#00D4FF] text-[10px]">▶</span>
                                            <span className="text-white/70">{post.targetName}</span>
                                          </>
                                        )}
                                      </h4>
                                      <span className="font-space text-[10px] text-white/30">
                                        {post.createdAt ? formatRelativeTime(post.createdAt.seconds) : "Just now"}
                                      </span>
                                    </div>
                                  </div>
                                  {myUid === post.senderId && (
                                    <div className="relative z-20">
                                      <button 
                                        onClick={() => setOpenPostMenuId(openPostMenuId === post.id ? null : post.id)}
                                        className="text-white/50 hover:text-white transition-colors p-1"
                                      >
                                        <MoreVertical size={16} />
                                      </button>
                                      {openPostMenuId === post.id && (
                                        <div className="absolute right-0 top-6 w-32 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl overflow-hidden">
                                          <button 
                                            onClick={() => { setEditingPostId(post.id); setEditPostText(post.text); setOpenPostMenuId(null); }}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                                          >
                                            <Edit2 size={14} /> Edit
                                          </button>
                                          <button 
                                            onClick={() => handleDeletePost(post.id, post.targetId)}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#FF3366]/80 hover:bg-[#FF3366]/10 hover:text-[#FF3366] transition-colors"
                                          >
                                            <Trash2 size={14} /> Delete
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {editingPostId === post.id ? (
                                  <div className="space-y-3">
                                    <textarea
                                      value={editPostText}
                                      onChange={(e) => setEditPostText(e.target.value)}
                                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-sm text-white font-space focus:outline-none focus:border-[#00D4FF]/50"
                                      rows={3}
                                    />
                                    <div className="flex gap-2 justify-end">
                                      <button onClick={() => { setEditingPostId(null); setOpenPostMenuId(null); }} className="px-4 py-1.5 text-xs text-white/50 hover:text-white font-space transition-colors">Cancel</button>
                                      <button onClick={() => handleEditPostSubmit(post.id, post.targetId)} disabled={isUpdatingPost} className="btn-neon btn-orange text-xs px-4 py-1.5 flex items-center gap-2">
                                        {isUpdatingPost ? <Loader2 size={12} className="animate-spin" /> : "Save"}
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="font-space text-sm text-white/80 leading-relaxed whitespace-pre-line">
                                    {post.text}
                                  </p>
                                )}

                                {post.mediaUrl && (
                                  <div className="rounded-xl overflow-hidden border border-white/5 max-h-[350px] bg-black flex items-center justify-center">
                                    {post.mediaType === "image" ? (
                                      <img src={post.mediaUrl} alt="" className="w-full max-h-[350px] object-cover" />
                                    ) : (
                                      <video src={post.mediaUrl} controls className="w-full max-h-[350px]" />
                                    )}
                                  </div>
                                )}

                                {/* Engagement action buttons */}
                                <div className="flex items-center gap-6 pt-3 border-t border-white/5">
                                  <button
                                    onClick={() => handleLikePost(post.id, post.likes || [])}
                                    className={`flex items-center gap-1.5 text-xs font-space transition-colors ${isLiked ? "text-red-500" : "text-white/40 hover:text-white"
                                      }`}
                                  >
                                    <Heart size={14} className={isLiked ? "fill-red-500" : ""} />
                                    <span>{(post.likes || []).length} Likes</span>
                                  </button>

                                  <button
                                    onClick={() => setOpenCommentsPostId(isCommentsOpen ? null : post.id)}
                                    className={`flex items-center gap-1.5 text-xs font-space transition-colors ${isCommentsOpen ? "text-[#9D4EDD]" : "text-white/40 hover:text-white"
                                      }`}
                                  >
                                    <MessageCircle size={14} />
                                    <span>{comments.length > 0 ? `Comments (${comments.length})` : "Comment"}</span>
                                  </button>
                                </div>

                                {/* Comments sync panel */}
                                {isCommentsOpen && (
                                  <div className="pt-4 border-t border-white/5 space-y-4">
                                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                                      {comments.length > 0 ? (
                                        comments.map((comment) => (
                                          <div key={comment.id} className="flex gap-2.5 items-start text-xs font-space">
                                            <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 shrink-0 flex items-center justify-center text-[10px] font-bold overflow-hidden text-[#9D4EDD]">
                                              {comment.senderPhoto ? (
                                                <img src={comment.senderPhoto} alt="" className="w-full h-full object-cover" />
                                              ) : (
                                                comment.senderName.charAt(0)
                                              )}
                                            </div>
                                            <div className="flex-1 bg-white/3 rounded-xl p-2.5">
                                              <span className="font-bold text-[#9D4EDD] block mb-0.5">{comment.senderName}</span>
                                              <p className="text-white/80">{comment.text}</p>
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <p className="text-center text-white/30 text-xs py-2">No comments yet. Write yours below!</p>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <input
                                        type="text"
                                        value={newCommentTexts[post.id] || ""}
                                        onChange={(e) => {
                                          const txt = e.target.value;
                                          setNewCommentTexts(prev => ({ ...prev, [post.id]: txt }));
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") handleCommentSubmit(post.id);
                                        }}
                                        placeholder="Write a comment..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-space focus:outline-none focus:border-[#9D4EDD]"
                                      />
                                      <button
                                        onClick={() => handleCommentSubmit(post.id)}
                                        className="p-2 rounded-lg bg-[#9D4EDD] text-black hover:bg-white transition-colors"
                                      >
                                        <Send size={12} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-16 bg-white/3 border border-white/5 rounded-2xl">
                            <Rss size={36} className="mx-auto text-white/20 mb-3" />
                            <h4 className="font-space font-bold text-white text-sm mb-1">Global Feed is empty</h4>
                            <p className="font-space text-xs text-white/40">Be the first to share an update with the platform!</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* TAB B: MUSICIANS DIRECTORY */}
                  {activeTab === "members" && (
                    <motion.div
                      key="members-directory"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="space-y-6"
                    >
                      <h2 className="font-orbitron font-bold text-lg text-white uppercase tracking-wider border-l-4 border-[#FF5B00] pl-3">
                        Musicians Directory
                      </h2>

                      {artistsLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                          <Loader2 size={32} className="text-[#FF5B00] animate-spin" />
                          <span className="font-space text-sm text-white/40">Searching catalog...</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {artists.map((artist) => (
                            <div
                              key={artist.uid}
                              className="bg-[#111] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors flex flex-col justify-between gap-4"
                            >
                              <div className="flex items-start gap-4">
                                <div
                                  className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-orbitron font-bold shrink-0 relative overflow-hidden"
                                  style={{
                                    border: `2px solid ${artist.color || "#9D4EDD"}`,
                                    background: `${artist.color || "#9D4EDD"}15`,
                                    color: artist.color || "#9D4EDD"
                                  }}
                                >
                                  {artist.profilePhoto ? (
                                    <img src={artist.profilePhoto} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    artist.displayName.charAt(0)
                                  )}
                                  {artist.verified && (
                                    <div className="absolute -bottom-1 -right-1 bg-[#050505] rounded-full p-0.5 border border-green-400">
                                      <CheckCircle size={10} className="text-green-400" />
                                    </div>
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <h3 className="font-space font-bold text-sm text-white truncate">{artist.displayName}</h3>
                                  <p className="font-space text-[10px] text-[#FF5B00] font-bold uppercase tracking-wider mt-0.5">{artist.instrument}</p>
                                  <p className="font-space text-[10px] text-white/30 mt-0.5 flex items-center gap-0.5"><MapPin size={8} /> {artist.district}</p>
                                </div>
                              </div>

                              <p className="font-space text-xs text-white/40 leading-relaxed line-clamp-2">
                                {artist.aboutMe || "Co-creator, teacher, and studio musician."}
                              </p>

                              <button
                                onClick={() => handleViewProfile(artist)}
                                className="w-full py-2 bg-white/3 hover:bg-white/10 text-white font-space font-bold text-xs uppercase tracking-wider rounded transition-colors"
                              >
                                Connect & View Wall
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* TAB C: DIRECT CHATS AREA */}
                  {activeTab === "chats" && (
                    <motion.div
                      key="direct-messages"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[500px] shadow-xl"
                    >
                      {/* Left: Chat threads list */}
                      <div className="md:col-span-1 border-r border-white/5 flex flex-col">
                        <div className="p-4 border-b border-white/5">
                          <h3 className="font-orbitron font-bold text-xs text-white uppercase tracking-wider">
                            Direct Messages
                          </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                          {chats.length > 0 ? (
                            chats.map((chat) => {
                              const otherUid = chat.partnerId || chat.id;
                              const partnerProfile = partnerProfiles[otherUid];
                              const otherName = partnerProfile?.displayName || chat.partnerName || "Anonymous";
                              const otherPhoto = partnerProfile?.profilePhoto || chat.partnerPhoto || "";
                              const isSelected = selectedChat?.id === chat.id;

                              return (
                                <button
                                  key={chat.id}
                                  onClick={() => setSelectedChat(chat)}
                                  className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors ${isSelected ? "bg-[#00D4FF]/10 text-white" : "hover:bg-white/3 text-white/60"
                                    }`}
                                >
                                  <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 shrink-0 flex items-center justify-center font-bold text-[#00D4FF] overflow-hidden">
                                    {otherPhoto ? (
                                      <img src={otherPhoto} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      otherName.charAt(0)
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-space font-bold text-xs text-white truncate">{otherName}</h4>
                                    <p className="font-space text-[10px] text-white/40 truncate mt-0.5">{chat.lastMessage}</p>
                                  </div>
                                </button>
                              );
                            })
                          ) : (
                            <div className="p-6 text-center text-white/30 text-xs font-space">
                              No conversations started yet. Connect with members in the directory to chat!
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Message log window */}
                      <div className="md:col-span-2 flex flex-col h-[500px]">
                        {selectedChat ? (
                          <>
                            {/* Chat Header */}
                            {(() => {
                              const otherUid = selectedChat.partnerId || selectedChat.id;
                              const partnerProfile = partnerProfiles[otherUid];
                              const otherName = partnerProfile?.displayName || selectedChat.partnerName || "Anonymous";
                              return (
                                <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                                  <h3 className="font-space font-bold text-sm text-white">
                                    {otherName}
                                  </h3>
                                </div>
                              );
                            })()}

                            {/* Chat history */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
                              {chatMessages.map((msg) => {
                                const isMe = msg.senderId === myUid;
                                return (
                                  <div key={msg.id} className={`flex items-start ${isMe ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-xs font-space ${isMe
                                        ? "bg-[#00D4FF] text-black rounded-tr-none"
                                        : "bg-white/5 border border-white/10 text-white rounded-tl-none"
                                      }`}>
                                      <p className="leading-relaxed break-words">{msg.text}</p>
                                    </div>
                                  </div>
                                );
                              })}
                              <div ref={directMessagesEndRef} />
                            </div>

                            {/* Send form */}
                            <form onSubmit={handleSendDirectMessage} className="p-4 border-t border-white/5 flex items-center gap-3 shrink-0">
                              <input
                                type="text"
                                value={newDirectMessage}
                                onChange={(e) => setNewDirectMessage(e.target.value)}
                                placeholder="Write message..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-space focus:outline-none focus:border-[#00D4FF]"
                              />
                              <button
                                type="submit"
                                disabled={!newDirectMessage.trim()}
                                className="h-9 w-9 rounded-xl bg-[#00D4FF] text-black hover:bg-white flex items-center justify-center shrink-0 disabled:opacity-40 transition-colors"
                              >
                                <Send size={14} />
                              </button>
                            </form>
                          </>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center text-white/30 font-space text-xs gap-2">
                            <Info size={28} className="opacity-40 text-[#00D4FF]" />
                            <span>Select a member chat room from the sidebar.</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </div>
          )}

        </div>

        <FooterSection />
      </main>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isChatOpen && selectedArtist && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] h-[450px] bg-[#090909] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{
              boxShadow: `0 0 30px rgba(255, 91, 0, 0.15)`,
              border: `1px solid ${selectedArtist.color || "#FF5B00"}40`
            }}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/3">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-orbitron font-bold text-xs overflow-hidden border"
                  style={{ borderColor: selectedArtist.color || "#FF5B00" }}
                >
                  {selectedArtist.profilePhoto ? (
                    <img src={selectedArtist.profilePhoto} alt="" className="w-full h-full object-cover" />
                  ) : (
                    selectedArtist.displayName.charAt(0)
                  )}
                </div>
                <div>
                  <h4 className="font-space font-bold text-xs text-white leading-none">
                    {selectedArtist.displayName}
                  </h4>
                  <span className="font-space text-[9px] text-white/40 mt-1 block uppercase tracking-wider">
                    {selectedArtist.instrument} • {selectedArtist.district}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white/40 hover:text-white transition-colors p-1"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#050505]">
              {chatPopupMessages.length > 0 ? (
                chatPopupMessages.map((msg) => {
                  const isMe = msg.senderId === myUid;
                  const contrastText = getContrastTextColor(selectedArtist.color);
                  return (
                    <div key={msg.id} className={`flex items-start ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs font-space ${isMe
                          ? `${contrastText} rounded-tr-none`
                          : "bg-white/5 border border-white/10 text-white rounded-tl-none"
                        }`}
                        style={isMe ? {
                          backgroundColor: selectedArtist.color || "#FF5B00",
                          boxShadow: `0 0 15px ${(selectedArtist.color || "#FF5B00")}40`
                        } : undefined}
                      >
                        <p className="leading-relaxed break-words">{msg.text}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/30 text-xs font-space">
                  <MessageSquare size={20} className="mb-2 opacity-30 animate-pulse" />
                  <span>Start the conversation. Say hello!</span>
                </div>
              )}
              <div ref={popupMessagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendPopupMessage} className="p-3 border-t border-white/5 bg-[#090909] flex items-center gap-2">
              <input
                type="text"
                value={newPopupMessage}
                onChange={(e) => setNewPopupMessage(e.target.value)}
                placeholder="Write message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-space focus:outline-none focus:border-[var(--focus-color)]"
                style={{
                  "--focus-color": selectedArtist.color || "#FF5B00"
                } as React.CSSProperties}
              />
              <button
                type="submit"
                disabled={!newPopupMessage.trim()}
                className="h-8 w-8 rounded-xl bg-[#FF5B00] text-white hover:bg-white flex items-center justify-center shrink-0 disabled:opacity-40 transition-colors"
                style={{
                  backgroundColor: selectedArtist.color || "#FF5B00"
                }}
              >
                <Send size={12} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Community Registration Modal */}
      <AnimatePresence>
        {isRegisterOpen && (
          <CommunityRegisterModal
            isOpen={isRegisterOpen}
            onClose={() => setIsRegisterOpen(false)}
            userProfile={userProfile}
            onSuccess={handleJoinSuccess}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {postToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#111] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF3366] to-[#FF5B00]" />
              <h3 className="font-orbitron font-bold text-xl text-white mb-3">Delete Post?</h3>
              <p className="font-space text-white/70 mb-6 text-sm leading-relaxed">
                Are you sure you want to delete this post? This action cannot be undone and it will be permanently removed from the community wall.
              </p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setPostToDelete(null)}
                  disabled={isDeletingPost}
                  className="px-5 py-2 rounded-lg font-space text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDeletePost}
                  disabled={isDeletingPost}
                  className="px-5 py-2 rounded-lg font-space text-sm font-bold bg-[#FF3366]/10 text-[#FF3366] border border-[#FF3366]/30 hover:bg-[#FF3366] hover:text-white transition-all hover:shadow-[0_0_20px_rgba(255,51,102,0.4)] disabled:opacity-50 flex items-center gap-2"
                >
                  {isDeletingPost ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

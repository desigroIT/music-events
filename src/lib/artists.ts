import { db } from "./firestore";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { UserProfile } from "./auth";
import { communityMusicians } from "@/data/dummy";

export interface ArtistProfile extends UserProfile {
  instrument?: string;
  followers?: string;
  verified?: boolean;
  color?: string;
  coverPhoto?: string;
}

// Convert a dummy musician into an ArtistProfile structure
const mapDummyMusician = (musician: any): ArtistProfile => ({
  uid: musician.id,
  email: `${musician.id}@studiomusicians.com`,
  displayName: musician.name,
  phone: "+1 555-0199",
  aboutMe: musician.bio,
  profilePhoto: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(musician.name)}`,
  videoUrl: "https://res.cloudinary.com/demo/video/upload/v1502213437/dog.mp4",
  isCommunityMember: true,
  district: musician.country,
  instrument: musician.instrument,
  followers: musician.followers,
  verified: musician.verified,
  color: musician.color || "#9D4EDD",
});

/**
 * Get all community profiles.
 * Merges Firestore users flagged as isCommunityMember with static dummy musicians.
 */
export const getCommunityArtists = async (): Promise<ArtistProfile[]> => {
  try {
    const artists: ArtistProfile[] = [];

    // 1. Get Firestore community members from "musicians_community" (PRIORITY for rich data)
    try {
      const communityMusiciansRef = collection(db, "musicians_community");
      const communityMusiciansSnapshot = await getDocs(communityMusiciansRef);
      communityMusiciansSnapshot.forEach((doc) => {
        const data = doc.data();
        artists.push({
          uid: doc.id,
          email: data.email || "",
          displayName: data.name || data.displayName || "Anonymous Musician",
          phone: data.phone || "",
          aboutMe: data.aboutMe || "",
          profilePhoto: data.profilePhoto || "",
          videoUrl: data.videoUrl || "",
          isCommunityMember: true,
          district: data.district || "Colombo",
          instrument: data.instrument || "Musician",
          followers: data.followers || "0",
          verified: data.verified ?? true,
          color: data.color || "#FF5B00",
          coverPhoto: data.coverPhoto || "",
        });
      });
    } catch (dbError) {
      console.error("Error fetching musicians_community:", dbError);
    }

    // 2. Get Firestore community members from "users" (ONLY if not already added)
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("isCommunityMember", "==", true));
      const snapshot = await getDocs(q);
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Prevent duplicates if already added from musicians_community
        if (!artists.some(a => a.email === data.email || a.uid === data.musicianId)) {
          artists.push({
            uid: doc.id,
            email: data.email || "",
            displayName: data.displayName || "Anonymous Musician",
            phone: data.phone || "",
            aboutMe: data.aboutMe || "",
            profilePhoto: data.profilePhoto || "",
            videoUrl: data.videoUrl || "",
            isCommunityMember: true,
            district: data.district || "",
            instrument: data.instrument || "Musician",
            followers: data.followers || "0",
            verified: data.verified || false,
            color: data.color || "#FF5B00",
            coverPhoto: data.coverPhoto || "",
          });
        }
      });
    } catch (usersErr) {
      console.error("Error fetching users:", usersErr);
    }



    return artists;
  } catch (error) {
    console.error("Error fetching community artists:", error);
    return [];
  }
};

/**
 * Get a single artist profile by ID (checks Firestore first, then falls back to dummy)
 */
export const getArtistProfile = async (uid: string): Promise<ArtistProfile | null> => {
  try {
    // 1a. Check musicians_community collection first
    const dbRef = doc(db, "musicians_community", uid);
    const dbSnap = await getDoc(dbRef);
    if (dbSnap.exists()) {
      const data = dbSnap.data();
      return {
        uid: dbSnap.id,
        email: data.email || "",
        displayName: data.name || data.displayName || "Anonymous Musician",
        phone: data.phone || "",
        aboutMe: data.aboutMe || "",
        profilePhoto: data.profilePhoto || "",
        videoUrl: data.videoUrl || "",
        isCommunityMember: true,
        district: data.district || "Colombo",
        instrument: data.instrument || "Musician",
        followers: data.followers || "0",
        verified: data.verified ?? true,
        color: data.color || "#9D4EDD",
        coverPhoto: data.coverPhoto || "",
      };
    }

    // 1b. Check Users collection
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.isCommunityMember) {
        return {
          uid: docSnap.id,
          email: data.email || "",
          displayName: data.displayName || "Anonymous Musician",
          phone: data.phone || "",
          aboutMe: data.aboutMe || "",
          profilePhoto: data.profilePhoto || "",
          videoUrl: data.videoUrl || "",
          isCommunityMember: true,
          district: data.district || "",
          instrument: data.instrument || "Musician",
          followers: data.followers || "0",
          verified: data.verified || false,
          color: data.color || "#FF5B00",
          coverPhoto: data.coverPhoto || "",
        };
      }
    }

    // 2. Fallback to dummy
    const dummy = communityMusicians.find((m) => m.id === uid);
    if (dummy) {
      return mapDummyMusician(dummy);
    }

    return null;
  } catch (error) {
    console.error("Error fetching artist profile:", error);
    const dummy = communityMusicians.find((m) => m.id === uid);
    return dummy ? mapDummyMusician(dummy) : null;
  }
};

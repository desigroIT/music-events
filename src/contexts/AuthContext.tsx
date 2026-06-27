"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "firebase/auth";
import { subscribeToAuthState, getUserProfile, UserProfile } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Fetch user profile from Firestore
        let profile = await getUserProfile(firebaseUser.uid);

        // Sync isCommunityMember status with Community_members_email collection
        try {
          const { doc, getDoc, setDoc, updateDoc } = await import("firebase/firestore");
          const { db } = await import("@/lib/firestore");
          
          if (firebaseUser.email) {
            const emailDocRef = doc(db, "Community_members_email", firebaseUser.email.toLowerCase().trim());
            const emailDocSnap = await getDoc(emailDocRef);
            
            if (emailDocSnap.exists()) {
              const emailData = emailDocSnap.data();
              const musicianId = emailData?.musicianId || null;
              if (!profile) {
                profile = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName || "Anonymous User",
                  isCommunityMember: true,
                  musicianId
                };
                await setDoc(doc(db, "users", firebaseUser.uid), profile);
              } else if (!profile.isCommunityMember || profile.musicianId !== musicianId) {
                profile.isCommunityMember = true;
                profile.musicianId = musicianId;
                await updateDoc(doc(db, "users", firebaseUser.uid), { 
                  isCommunityMember: true,
                  musicianId
                });
              }
            } else {
              if (profile && profile.isCommunityMember) {
                profile.isCommunityMember = false;
                await updateDoc(doc(db, "users", firebaseUser.uid), { isCommunityMember: false });
              }
            }
          }
        } catch (syncError) {
          console.error("Error syncing community membership status:", syncError);
        }

        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

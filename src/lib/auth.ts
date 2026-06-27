import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, User, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { app } from "./firebase";
import { db } from "./firestore";

export const auth = getAuth(app);

// User Profile Interface
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  // Required fields
  createdAt?: any;
  updatedAt?: any;
  // Optional fields
  district?: string;
  age?: number;
  phone?: string;
  schoolOrUniversity?: string;
  aboutMe?: string;
  profilePhoto?: string;
  videoUrl?: string;
  isCommunityMember?: boolean;
  musicianId?: string;
}

/**
 * Register a new user with email/password
 * @param email - User's email
 * @param password - User's password
 * @param displayName - User's display name (Required)
 * @param optionalData - Optional user data (district, age, phone, schoolOrUniversity)
 */
export const registerUser = async (
  email: string,
  password: string,
  displayName: string,
  optionalData?: {
    district?: string;
    age?: number;
    phone?: string;
    schoolOrUniversity?: string;
  }
): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name in Firebase Auth
    await updateProfile(user, { displayName });

    // Save additional user data to Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...optionalData,
    };

    // Filter out undefined values to prevent Firestore setDoc crashes
    const cleanedProfile = Object.fromEntries(
      Object.entries(userProfile).filter(([_, v]) => v !== undefined)
    );

    await setDoc(doc(db, "users", user.uid), cleanedProfile);

    return { success: true, user };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Sign in existing user
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error("Login error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Sign out current user
 */
export const logoutUser = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error("Logout error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

/**
 * Update user profile in Firestore
 */
export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<boolean> => {
  try {
    const docRef = doc(db, "users", uid);
    // Filter out undefined values to prevent Firestore crashes
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );
    await setDoc(
      docRef,
      {
        ...cleanedData,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return false;
  }
};

/**
 * Subscribe to auth state changes
 */
export const subscribeToAuthState = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

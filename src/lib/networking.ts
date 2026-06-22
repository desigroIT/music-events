import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
  QueryConstraint
} from "firebase/firestore";
import { db, COLLECTIONS } from "./firestore";

export type NetworkingPostType = "item" | "job";

export interface NetworkingPost {
  id?: string;
  type: NetworkingPostType;
  title: string;
  location: string;
  contactNumber: string;
  userId: string;
  createdAt?: any;
  updatedAt?: any;
  // Item specific fields
  price?: string;
  // Job specific fields
  description?: string;
  address?: string;
  dueDate?: string;
}

export interface NetworkingFilter {
  category?: NetworkingPostType | "all";
  location?: string;
}

export const createNetworkingPost = async (post: Omit<NetworkingPost, "id" | "createdAt" | "updatedAt">): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.NETWORKING), {
      ...post,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating networking post:", error);
    return null;
  }
};

export const getNetworkingPosts = async (filters?: NetworkingFilter, limitCount?: number): Promise<NetworkingPost[]> => {
  try {
    const constraints: QueryConstraint[] = [];
    
    if (filters?.category && filters.category !== "all") {
      constraints.push(where("type", "==", filters.category));
    }
    
    if (filters?.location) {
      constraints.push(where("location", "==", filters.location));
    }
    
    // We remove orderBy("createdAt", "desc") here because combining where() on multiple fields
    // with orderBy() requires a composite index in Firestore.
    // Instead, we will sort the results in Javascript below.
    // NOTE: If using limit(), it needs to be imported from firestore
    
    const q = query(collection(db, COLLECTIONS.NETWORKING), ...constraints);
    const snapshot = await getDocs(q);
    
    let results = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NetworkingPost[];
    
    // Sort by createdAt descending in Javascript
    results.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || 0;
      const timeB = b.createdAt?.toMillis?.() || 0;
      return timeB - timeA;
    });
    
    if (limitCount && limitCount > 0) {
      results = results.slice(0, limitCount);
    }
    
    return results;
  } catch (error) {
    console.error("Error fetching networking posts:", error);
    return [];
  }
};

export const updateNetworkingPost = async (id: string, post: Partial<NetworkingPost>): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.NETWORKING, id);
    await updateDoc(docRef, {
      ...post,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating networking post:", error);
    return false;
  }
};

export const deleteNetworkingPost = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.NETWORKING, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting networking post:", error);
    return false;
  }
};

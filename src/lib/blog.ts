import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { db } from "./firestore";

export const BLOG_COLLECTION = "Blog_Articles";

export interface BlogPost {
  id?: string;
  title: string;
  subDescription: string;
  description: string;
  images: string[];
  authorName: string;
  authorId: string;
  category: string;
  createdAt?: any;
  likes?: string[]; // Array of user IDs
}

export interface BlogComment {
  id?: string;
  userId: string;
  userName: string;
  content: string;
  createdAt?: any;
}

// ── CREATE ────────────────────────────────────────────────────
export const createBlogPost = async (
  post: Omit<BlogPost, "id" | "createdAt">
): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, BLOG_COLLECTION), {
      ...post,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating blog post:", error);
    return null;
  }
};

// ── READ ALL ──────────────────────────────────────────────────
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const q = query(collection(db, BLOG_COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BlogPost[];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
};

// ── READ ONE ──────────────────────────────────────────────────
export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    const docRef = doc(db, BLOG_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as BlogPost;
    }
    return null;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
};

// ── DELETE ────────────────────────────────────────────────────
export const deleteBlogPost = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, BLOG_COLLECTION, id));
    return true;
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return false;
  }
};

// ── LIKES & COMMENTS ──────────────────────────────────────────
export const toggleLikeBlogPost = async (blogId: string, userId: string, isLiked: boolean): Promise<boolean> => {
  try {
    const docRef = doc(db, BLOG_COLLECTION, blogId);
    await updateDoc(docRef, {
      likes: isLiked ? arrayRemove(userId) : arrayUnion(userId)
    });
    return true;
  } catch (error) {
    console.error("Error toggling like:", error);
    return false;
  }
};

export const addComment = async (blogId: string, comment: Omit<BlogComment, "id" | "createdAt">): Promise<string | null> => {
  try {
    const commentsRef = collection(db, BLOG_COLLECTION, blogId, "Comments");
    const docRef = await addDoc(commentsRef, {
      ...comment,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding comment:", error);
    return null;
  }
};

export const getComments = async (blogId: string): Promise<BlogComment[]> => {
  try {
    const commentsRef = collection(db, BLOG_COLLECTION, blogId, "Comments");
    const q = query(commentsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BlogComment[];
  } catch (error) {
    console.error("Error getting comments:", error);
    return [];
  }
};

// ── CLOUDINARY UPLOAD HELPER (unsigned) ───────────────────────
export const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error("Cloudinary env vars missing");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "blog_articles");

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    return data.secure_url as string;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
};

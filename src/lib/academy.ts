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
} from "firebase/firestore";
import { db, COLLECTIONS } from "./firestore";

export interface AcademyFeature {
  id?: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  stats: string;
  createdAt?: any;
  updatedAt?: any;
  order?: number;
}

export interface AcademyLesson {
  id: string; // client-generated uuid
  name: string;
  description: string;
  videoLink: string;
}

export interface AcademyModule {
  id?: string;
  featureId: string; // parent feature id
  title: string;
  description: string;
  bannerImage: string;
  lessons: AcademyLesson[];
  createdAt?: any;
  updatedAt?: any;
}

export interface AcademyStat {
  id?: string;
  value: string;
  label: string;
  order?: number;
  createdAt?: any;
  updatedAt?: any;
}

// --- Features CRUD ---

export const getAcademyFeatures = async (): Promise<AcademyFeature[]> => {
  try {
    const q = query(collection(db, COLLECTIONS.ACADEMY), orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AcademyFeature[];
  } catch (error) {
    console.error("Error fetching academy features:", error);
    return [];
  }
};

export const getAcademyFeatureById = async (id: string): Promise<AcademyFeature | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.ACADEMY, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as AcademyFeature;
    }
    return null;
  } catch (error) {
    console.error("Error fetching academy feature by id:", error);
    return null;
  }
};

export const createAcademyFeature = async (
  data: Omit<AcademyFeature, "id" | "createdAt" | "updatedAt">
): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.ACADEMY), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating academy feature:", error);
    return null;
  }
};

export const updateAcademyFeature = async (
  id: string,
  data: Partial<AcademyFeature>
): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.ACADEMY, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating academy feature:", error);
    return false;
  }
};

export const deleteAcademyFeature = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.ACADEMY, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting academy feature:", error);
    return false;
  }
};

// --- Modules CRUD (Subcollection) ---

export const getAcademyModules = async (featureId: string): Promise<AcademyModule[]> => {
  try {
    const modulesRef = collection(db, COLLECTIONS.ACADEMY, featureId, "modules");
    const snapshot = await getDocs(modulesRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AcademyModule[];
  } catch (error) {
    console.error("Error fetching academy modules:", error);
    return [];
  }
};

export const createAcademyModule = async (
  featureId: string,
  data: Omit<AcademyModule, "id" | "featureId" | "createdAt" | "updatedAt">
): Promise<string | null> => {
  try {
    const modulesRef = collection(db, COLLECTIONS.ACADEMY, featureId, "modules");
    const docRef = await addDoc(modulesRef, {
      ...data,
      featureId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating academy module:", error);
    return null;
  }
};

export const updateAcademyModule = async (
  featureId: string,
  moduleId: string,
  data: Partial<AcademyModule>
): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.ACADEMY, featureId, "modules", moduleId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating academy module:", error);
    return false;
  }
};

export const deleteAcademyModule = async (featureId: string, moduleId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.ACADEMY, featureId, "modules", moduleId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting academy module:", error);
    return false;
  }
};

// --- Stats CRUD ---

export const getAcademyStats = async (): Promise<AcademyStat[]> => {
  try {
    const q = query(collection(db, COLLECTIONS.ACADEMY_STATS), orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AcademyStat[];
  } catch (error) {
    console.error("Error fetching academy stats:", error);
    return [];
  }
};

export const createAcademyStat = async (
  data: Omit<AcademyStat, "id" | "createdAt" | "updatedAt">
): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.ACADEMY_STATS), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating academy stat:", error);
    return null;
  }
};

export const updateAcademyStat = async (
  id: string,
  data: Partial<AcademyStat>
): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.ACADEMY_STATS, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating academy stat:", error);
    return false;
  }
};

export const deleteAcademyStat = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.ACADEMY_STATS, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting academy stat:", error);
    return false;
  }
};
// --- Live Classes CRUD (Subcollection under Academy Feature) ---

export interface LiveClass {
  id?: string;
  className: string;
  grade?: string;
  date: string;
  time: string;
  description: string;
  meetLink: string;
  createdAt?: any;
  updatedAt?: any;
}

export const getLiveClasses = async (featureId: string): Promise<LiveClass[]> => {
  try {
    const classesRef = collection(db, COLLECTIONS.ACADEMY, featureId, "liveClasses");
    const snapshot = await getDocs(classesRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as LiveClass[];
  } catch (error) {
    console.error("Error fetching live classes:", error);
    return [];
  }
};

export const createLiveClass = async (
  featureId: string,
  data: Omit<LiveClass, "id" | "createdAt" | "updatedAt">
): Promise<string | null> => {
  try {
    const classesRef = collection(db, COLLECTIONS.ACADEMY, featureId, "liveClasses");
    const docRef = await addDoc(classesRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating live class:", error);
    return null;
  }
};

export const updateLiveClass = async (
  featureId: string,
  classId: string,
  data: Partial<LiveClass>
): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.ACADEMY, featureId, "liveClasses", classId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating live class:", error);
    return false;
  }
};

export const deleteLiveClass = async (featureId: string, classId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.ACADEMY, featureId, "liveClasses", classId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting live class:", error);
    return false;
  }
};

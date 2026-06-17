import {
  getFirestore,
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
  setDoc
} from "firebase/firestore";
import { app } from "./firebase";

export const db = getFirestore(app);

// Course type definition
export interface Course {
  id?: string;
  title: string;
  instructor: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  price: number;
  badge: string;
  badgeColor: string;
  tags: string[];
  description: string;
  createdAt?: any;
  updatedAt?: any;
}

// Collections
export const COLLECTIONS = {
  COURSES: "courses",
  ACADEMY: "academy",
  COMMUNITY: "community",
  NETWORKING: "networking",
  BLOG: "blog",
  EVENTS: "events",
  MEMBERSHIP: "membership",
  SETTINGS: "settings",
};

// Section Header type
export interface SectionHeader {
  id?: string;
  sectionLabel: string;
  mainTitle: string;
  subtitle: string;
  updatedAt?: any;
}

// ============== COURSES CRUD ==============

export const getCourses = async (): Promise<Course[]> => {
  try {
    const q = query(collection(db, COLLECTIONS.COURSES), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Course[];
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

export const getCourseById = async (id: string): Promise<Course | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.COURSES, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Course;
    }
    return null;
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
};

export const createCourse = async (course: Omit<Course, "id">): Promise<string | null> => {
  try {
    // Create course in main courses collection
    const docRef = await addDoc(collection(db, COLLECTIONS.COURSES), {
      ...course,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Also add to myCourses subcollection
    const myCoursesRef = collection(db, COLLECTIONS.COURSES, docRef.id, "myCourses");
    await addDoc(myCoursesRef, {
      ...course,
      courseId: docRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating course:", error);
    return null;
  }
};

export const updateCourse = async (id: string, course: Partial<Course>): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.COURSES, id);
    await updateDoc(docRef, {
      ...course,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating course:", error);
    return false;
  }
};

export const deleteCourse = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.COURSES, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting course:", error);
    return false;
  }
};

// ============== MY COURSES SUBCOLLECTION ==============

export const getMyCourses = async (courseId: string): Promise<Course[]> => {
  try {
    const myCoursesRef = collection(db, COLLECTIONS.COURSES, courseId, "myCourses");
    const q = query(myCoursesRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Course[];
  } catch (error) {
    console.error("Error fetching my courses:", error);
    return [];
  }
};

export const getAllMyCourses = async (): Promise<Course[]> => {
  try {
    // Get all courses first
    const coursesSnapshot = await getDocs(collection(db, COLLECTIONS.COURSES));
    const allMyCourses: Course[] = [];

    // For each course, get its myCourses subcollection
    for (const courseDoc of coursesSnapshot.docs) {
      const myCoursesRef = collection(db, COLLECTIONS.COURSES, courseDoc.id, "myCourses");
      const myCoursesSnapshot = await getDocs(myCoursesRef);

      myCoursesSnapshot.docs.forEach((doc) => {
        allMyCourses.push({
          id: doc.id,
          ...doc.data(),
        } as Course);
      });
    }

    return allMyCourses;
  } catch (error) {
    console.error("Error fetching all my courses:", error);
    return [];
  }
};

// Utility to sync dummy data to Firestore (run once)
export const syncDummyDataToFirestore = async (courses: any[]) => {
  try {
    for (const course of courses) {
      const { id, ...courseData } = course;
      await addDoc(collection(db, COLLECTIONS.COURSES), {
        ...courseData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    console.log("Dummy data synced successfully");
  } catch (error) {
    console.error("Error syncing dummy data:", error);
  }
};

// ============== SECTION HEADERS CRUD ==============
// Saves to: courses/header-section/data

export const getSectionHeader = async (section?: string): Promise<SectionHeader | null> => {
  try {
    // Path: courses (collection) -> config (document) -> header-section (subcollection) -> data (document)
    const sectionName = section || "courses";
    const docRef = doc(db, sectionName, "config", "header-section", "data");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as SectionHeader;
    }
    return null;
  } catch (error) {
    console.error("Error fetching section header:", error);
    return null;
  }
};

export const updateSectionHeader = async (
  header: Omit<SectionHeader, "id">,
  section?: string
): Promise<boolean> => {
  try {
    // Path: courses (collection) -> config (document) -> header-section (subcollection) -> data (document)
    const sectionName = section || "courses";
    const docRef = doc(db, sectionName, "config", "header-section", "data");

    // Use setDoc with merge to create or update in one operation
    await setDoc(
      docRef,
      {
        ...header,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.error("Error updating section header:", error);
    return false;
  }
};

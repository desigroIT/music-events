import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
  query,
  limit,
} from "firebase/firestore";
import { db } from "./firestore";

// Course Content Types
export interface CourseHeader {
  courseName: string;
  description: string;
  totalStudents: number;
  price: number;
  offerPrice: number;
  offerValidPeriod: string;
  numberOfLessons: number;
  completionTime: string;
  enableCertificate: boolean;
}

export interface CurriculumItem {
  id: string;
  title: string;
  order: number;
}

export interface Lesson {
  id: string;
  order: number;
  title: string;
  youtubeLink: string;
  description: string;
  isFree: boolean;
}

export interface CourseContent {
  courseName: string;
  description: string;
  totalStudents: number;
  price: number;
  offerPrice: number;
  offerValidPeriod: string;
  numberOfLessons: number;
  completionTime: string;
  enableCertificate: boolean;
  curriculum: CurriculumItem[];
  lessons: Lesson[];
  updatedAt?: any;
  badge?: string;
  badgeColor?: string;
}

/**
 * Get the first document ID from myCourses subcollection
 * This is where we'll store the course content
 */
const getMyCourseDocId = async (courseId: string): Promise<string | null> => {
  try {
    const myCoursesRef = collection(db, "courses", courseId, "myCourses");
    const q = query(myCoursesRef, limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    }

    // If no document exists, create one with a default ID
    const newDocId = "content";
    await setDoc(doc(db, "courses", courseId, "myCourses", newDocId), {
      createdAt: serverTimestamp(),
    });

    return newDocId;
  } catch (error) {
    console.error("Error getting myCourse doc ID:", error);
    return null;
  }
};

/**
 * Get complete course content
 */
export const getCourseContent = async (
  courseId: string
): Promise<CourseContent | null> => {
  try {
    const docId = await getMyCourseDocId(courseId);
    if (!docId) return null;

    const docRef = doc(db, "courses", courseId, "myCourses", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        courseName: data.courseName || "",
        description: data.description || "",
        totalStudents: data.totalStudents || 0,
        price: data.price || 0,
        offerPrice: data.offerPrice || 0,
        offerValidPeriod: data.offerValidPeriod || "",
        numberOfLessons: data.numberOfLessons || 0,
        completionTime: data.completionTime || "",
        enableCertificate: data.enableCertificate || false,
        curriculum: data.curriculum || [],
        lessons: data.lessons || [],
        updatedAt: data.updatedAt,
        badge: data.badge || "",
        badgeColor: data.badgeColor || "",
      };
    }

    // Return empty structure if no data exists yet
    return {
      courseName: "",
      description: "",
      totalStudents: 0,
      price: 0,
      offerPrice: 0,
      offerValidPeriod: "",
      numberOfLessons: 0,
      completionTime: "",
      enableCertificate: false,
      curriculum: [],
      lessons: [],
      badge: "",
      badgeColor: "",
    };
  } catch (error) {
    console.error("Error fetching course content:", error);
    return null;
  }
};

/**
 * Save course header section
 */
export const saveCourseHeader = async (
  courseId: string,
  headerData: CourseHeader
): Promise<boolean> => {
  try {
    const docId = await getMyCourseDocId(courseId);
    if (!docId) return false;

    const docRef = doc(db, "courses", courseId, "myCourses", docId);

    await setDoc(
      docRef,
      {
        courseName: headerData.courseName,
        description: headerData.description,
        totalStudents: headerData.totalStudents,
        price: headerData.price,
        offerPrice: headerData.offerPrice,
        offerValidPeriod: headerData.offerValidPeriod,
        numberOfLessons: headerData.numberOfLessons,
        completionTime: headerData.completionTime,
        enableCertificate: headerData.enableCertificate,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.error("Error saving course header:", error);
    return false;
  }
};

/**
 * Save course curriculum section
 */
export const saveCourseCurriculum = async (
  courseId: string,
  curriculum: CurriculumItem[]
): Promise<boolean> => {
  try {
    const docId = await getMyCourseDocId(courseId);
    if (!docId) return false;

    const docRef = doc(db, "courses", courseId, "myCourses", docId);

    await setDoc(
      docRef,
      {
        curriculum: curriculum,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.error("Error saving curriculum:", error);
    return false;
  }
};

/**
 * Save course lessons section
 */
export const saveCourseLessons = async (
  courseId: string,
  lessons: Lesson[]
): Promise<boolean> => {
  try {
    const docId = await getMyCourseDocId(courseId);
    if (!docId) return false;

    const docRef = doc(db, "courses", courseId, "myCourses", docId);

    await setDoc(
      docRef,
      {
        lessons: lessons,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.error("Error saving lessons:", error);
    return false;
  }
};

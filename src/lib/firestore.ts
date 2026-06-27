import {
  getFirestore,
  collection,
  collectionGroup,
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
  completionTime?: string;
  numberOfLessons?: number;
  totalStudents?: number;
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
  MUSICIANS_COMMUNITY: "musicians_community",
  BANNER_ADS: "banner_ads",
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

// ============== MUSICIANS COMMUNITY CRUD ==============

export interface CommunityMusician {
  id?: string;
  name: string;
  email: string;
  aboutMe: string;
  profilePhoto: string;
  coverPhoto: string;
  instrument?: string;
  district?: string;
  followers?: string;
  verified?: boolean;
  color?: string;
  createdAt?: any;
  updatedAt?: any;
}

export const getCommunityMusiciansDb = async (): Promise<CommunityMusician[]> => {
  try {
    const q = query(collection(db, COLLECTIONS.MUSICIANS_COMMUNITY), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CommunityMusician[];
  } catch (error) {
    console.error("Error fetching community musicians from db:", error);
    return [];
  }
};

export const createCommunityMusicianDb = async (
  musician: Omit<CommunityMusician, "id">
): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.MUSICIANS_COMMUNITY), {
      ...musician,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating community musician in db:", error);
    return null;
  }
};

export const deleteCommunityMusicianDb = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.MUSICIANS_COMMUNITY, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const email = data.email;
      if (email) {
        const emailDocRef = doc(db, "Community_members_email", email.trim().toLowerCase());
        await deleteDoc(emailDocRef);
      }
    }
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting community musician:", error);
    return false;
  }
};

export const updateCommunityMusicianDb = async (
  id: string,
  musician: Partial<CommunityMusician>
): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.MUSICIANS_COMMUNITY, id);
    if (musician.email) {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const oldData = docSnap.data();
        const oldEmail = oldData.email;
        const newEmail = musician.email.trim().toLowerCase();
        if (oldEmail && oldEmail.trim().toLowerCase() !== newEmail) {
          // Delete old email record from whitelist
          const oldEmailDocRef = doc(db, "Community_members_email", oldEmail.trim().toLowerCase());
          await deleteDoc(oldEmailDocRef);
          
          // Save new email record to whitelist
          const newEmailDocRef = doc(db, "Community_members_email", newEmail);
          await setDoc(newEmailDocRef, {
            email: newEmail,
            musicianId: id,
            createdAt: serverTimestamp(),
          });
        } else if (!oldEmail) {
          // Save new email record to whitelist if none existed
          const newEmailDocRef = doc(db, "Community_members_email", newEmail);
          await setDoc(newEmailDocRef, {
            email: newEmail,
            musicianId: id,
            createdAt: serverTimestamp(),
          });
        }
      }
    }
    await setDoc(docRef, { ...musician, updatedAt: serverTimestamp() }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating community musician:", error);
    return false;
  }
};

// ============== BANNER ADS CRUD ==============

export interface BannerAd {
  id?: string;
  musicianId?: string;
  type: "image" | "text";
  title?: string;
  tagline?: string;
  image?: string;
  text?: string;
  color: string;
  createdAt?: any;
}

export const getBannerAdsDb = async (): Promise<BannerAd[]> => {
  try {
    const q = query(collectionGroup(db, COLLECTIONS.BANNER_ADS));
    const snapshot = await getDocs(q);
    const ads = snapshot.docs.map((doc) => {
      const data = doc.data();
      const musicianId = doc.ref.parent.parent?.id || "";
      return {
        id: doc.id,
        musicianId,
        ...data,
      };
    }) as BannerAd[];

    // Sort by createdAt in memory
    return ads.sort((a: any, b: any) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.error("Error fetching banner ads from db:", error);
    return [];
  }
};

export const createBannerAdDb = async (
  musicianId: string,
  ad: Omit<BannerAd, "id">
): Promise<string | null> => {
  try {
    const docRef = await addDoc(
      collection(db, COLLECTIONS.MUSICIANS_COMMUNITY, musicianId, COLLECTIONS.BANNER_ADS),
      {
        ...ad,
        createdAt: serverTimestamp(),
      }
    );
    return docRef.id;
  } catch (error) {
    console.error("Error creating banner ad in subcollection:", error);
    return null;
  }
};

export const deleteBannerAdDb = async (musicianId: string, adId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.MUSICIANS_COMMUNITY, musicianId, COLLECTIONS.BANNER_ADS, adId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting banner ad from subcollection:", error);
    return false;
  }
};

export const saveCommunityMemberEmailDb = async (email: string, musicianId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, "Community_members_email", email.trim().toLowerCase());
    await setDoc(docRef, {
      email: email.trim().toLowerCase(),
      musicianId,
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error saving community member email:", error);
    return false;
  }
};


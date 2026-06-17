import { app } from "./firebase";
import { getFirestore, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

// Initialize Firestore
const db = getFirestore(app);

/**
 * Add a user's email to the registeredStudents array for a course
 */
export async function addRegisteredStudent(
  courseId: string,
  userEmail: string
): Promise<void> {
  try {
    const courseRef = doc(db, "courses", courseId);

    // Add email to registeredStudents array (won't add duplicates)
    await updateDoc(courseRef, {
      registeredStudents: arrayUnion(userEmail),
    });

    console.log(`User ${userEmail} registered to course ${courseId}`);
  } catch (error) {
    console.error("Error adding registered student:", error);
    throw error;
  }
}

/**
 * Check if a user is registered for a course
 */
export async function isUserRegistered(
  courseId: string,
  userEmail: string
): Promise<boolean> {
  try {
    const courseRef = doc(db, "courses", courseId);
    const courseDoc = await getDoc(courseRef);

    if (!courseDoc.exists()) {
      return false;
    }

    const data = courseDoc.data();
    const registeredStudents = data.registeredStudents || [];

    return registeredStudents.includes(userEmail);
  } catch (error) {
    console.error("Error checking user registration:", error);
    return false;
  }
}

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

export interface AppEvent {
  id?: string;
  type: string; // e.g. "Masterclass", "Workshop", "Concert", "Jam Session"
  title: string;
  host: string;
  date: string;
  time: string;
  mode: string; // e.g. "Live", "Online", "In-Person"
  price: string;
  spots: number;
  spotsLeft: number;
  color: string;
  tag: string;
  createdAt?: any;
  updatedAt?: any;
}

export const createEvent = async (eventData: Omit<AppEvent, "id" | "createdAt" | "updatedAt">): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.EVENTS), {
      ...eventData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating event:", error);
    return null;
  }
};

export const getEvents = async (): Promise<AppEvent[]> => {
  try {
    const q = query(collection(db, COLLECTIONS.EVENTS), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AppEvent[];
  } catch (error) {
    console.error("Error fetching events:", error);
    // Return empty array on index error or other errors
    return [];
  }
};

export const updateEvent = async (id: string, eventData: Partial<AppEvent>): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.EVENTS, id);
    await updateDoc(docRef, {
      ...eventData,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating event:", error);
    return false;
  }
};

export const deleteEvent = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.EVENTS, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    return false;
  }
};

// ============== REGISTRATIONS SUBCOLLECTION ==============

export interface EventRegistration {
  id?: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  participants: number;
  message?: string;
  registeredAt?: any;
}

export const createRegistration = async (
  eventId: string,
  data: Omit<EventRegistration, "id" | "registeredAt">
): Promise<string | null> => {
  try {
    const ref = collection(db, COLLECTIONS.EVENTS, eventId, "registrations");
    const docRef = await addDoc(ref, {
      ...data,
      registeredAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating registration:", error);
    return null;
  }
};

export const getRegistrations = async (eventId: string): Promise<EventRegistration[]> => {
  try {
    const ref = collection(db, COLLECTIONS.EVENTS, eventId, "registrations");
    const q = query(ref, orderBy("registeredAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as EventRegistration[];
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return [];
  }
};

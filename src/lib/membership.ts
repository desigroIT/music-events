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
  setDoc,
} from "firebase/firestore";
import { db, COLLECTIONS } from "./firestore";

export interface MembershipFeature {
  label: string;
  included: boolean;
}

export interface MembershipPlan {
  id?: string;
  tier: string;
  price: number | string;
  period: string;
  color: string;
  description: string;
  popular: boolean;
  cta: string;
  features: MembershipFeature[];
  createdAt?: any;
  updatedAt?: any;
  order?: number;
}

export interface MembershipSettings {
  isEnabled: boolean;
}

export const getMembershipSettings = async (): Promise<MembershipSettings> => {
  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, "membership");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as MembershipSettings;
    }
    return { isEnabled: true }; // Default to true
  } catch (error) {
    console.error("Error fetching membership settings:", error);
    return { isEnabled: true };
  }
};

export const updateMembershipSettings = async (settings: MembershipSettings): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, "membership");
    await setDoc(docRef, settings, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating membership settings:", error);
    return false;
  }
};

export const createMembershipPlan = async (
  planData: Omit<MembershipPlan, "id" | "createdAt" | "updatedAt">
): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.MEMBERSHIP), {
      ...planData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating membership plan:", error);
    return null;
  }
};

export const getMembershipPlans = async (): Promise<MembershipPlan[]> => {
  try {
    const q = query(collection(db, COLLECTIONS.MEMBERSHIP), orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    
    // If order field isn't used or some docs don't have it, we sort by price in memory just in case
    let plans = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MembershipPlan[];

    // If order is missing, sort by price
    if (plans.length > 0 && plans[0].order === undefined) {
      plans = plans.sort((a, b) => Number(a.price) - Number(b.price));
    }

    return plans;
  } catch (error) {
    console.error("Error fetching membership plans:", error);
    return [];
  }
};

export const getMembershipPlanById = async (id: string): Promise<MembershipPlan | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.MEMBERSHIP, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as MembershipPlan;
    }
    return null;
  } catch (error) {
    console.error("Error fetching membership plan:", error);
    return null;
  }
};

export const updateMembershipPlan = async (
  id: string,
  planData: Partial<MembershipPlan>
): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.MEMBERSHIP, id);
    await updateDoc(docRef, {
      ...planData,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating membership plan:", error);
    return false;
  }
};

export const deleteMembershipPlan = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.MEMBERSHIP, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting membership plan:", error);
    return false;
  }
};

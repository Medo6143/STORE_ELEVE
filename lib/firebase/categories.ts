import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "./config";
import type { Category } from "@/types";

function fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): Category {
  return { id: snap.id, ...snap.data() } as Category;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const q = query(
      collection(db, "categories"),
      where("isActive", "==", true),
      orderBy("order", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(fromFirestore);
  } catch (error) {
    console.error("[getCategories]", error);
    throw error;
  }
}

export async function getCategoriesByCollection(
  collectionId: string
): Promise<Category[]> {
  try {
    const q = query(
      collection(db, "categories"),
      where("collectionId", "==", collectionId),
      where("isActive", "==", true),
      orderBy("order", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(fromFirestore);
  } catch (error) {
    console.error("[getCategoriesByCollection]", error);
    throw error;
  }
}

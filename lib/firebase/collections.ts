import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "./config";
import type { Collection } from "@/types";

function fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): Collection {
  return { id: snap.id, ...snap.data() } as Collection;
}

export async function getCollections(): Promise<Collection[]> {
  try {
    const q = query(
      collection(db, "collections"),
      where("isActive", "==", true),
      orderBy("order", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(fromFirestore);
  } catch (error) {
    console.error("[getCollections]", error);
    throw error;
  }
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  try {
    const q = query(collection(db, "collections"), where("slug", "==", slug));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as Collection;
  } catch (error) {
    console.error("[getCollectionBySlug]", error);
    throw error;
  }
}

export async function getCollectionById(id: string): Promise<Collection | null> {
  try {
    const snap = await getDoc(doc(db, "collections", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Collection;
  } catch (error) {
    console.error("[getCollectionById]", error);
    throw error;
  }
}

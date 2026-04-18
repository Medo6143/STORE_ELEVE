import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "./config";
import type { Product } from "@/types";

function fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): Product {
  return { id: snap.id, ...snap.data() } as Product;
}

export async function getActiveProducts(limitCount = 20): Promise<Product[]> {
  try {
    const q = query(
      collection(db, "products"),
      where("isActive", "==", true),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map(fromFirestore);
  } catch (error) {
    console.error("[getProducts]", error);
    throw error;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const snap = await getDoc(doc(db, "products", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Product;
  } catch (error) {
    console.error("[getProductById]", error);
    throw error;
  }
}

export async function getProductsByCollection(
  collectionId: string,
  limitCount = 20
): Promise<Product[]> {
  try {
    const q = query(
      collection(db, "products"),
      where("collectionId", "==", collectionId),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map(fromFirestore).filter((p) => p.isActive !== false);
  } catch (error) {
    console.error("[getProductsByCollection]", error);
    throw error;
  }
}

export async function getProductsByCategory(
  categoryId: string,
  limitCount = 20
): Promise<Product[]> {
  try {
    const q = query(
      collection(db, "products"),
      where("categoryId", "==", categoryId),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map(fromFirestore).filter((p) => p.isActive !== false);
  } catch (error) {
    console.error("[getProductsByCategory]", error);
    throw error;
  }
}

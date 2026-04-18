import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "./config";
import type { Review } from "@/types";

function fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): Review {
  return { id: snap.id, ...snap.data() } as Review;
}

export async function getReviewsByProduct(
  productId: string,
  limitCount = 20
): Promise<Review[]> {
  try {
    const q = query(
      collection(db, "reviews"),
      where("productId", "==", productId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map(fromFirestore);
  } catch (error) {
    console.error("[getReviewsByProduct]", error);
    throw error;
  }
}

export async function addReview(
  review: Omit<Review, "id" | "createdAt">
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "reviews"), {
      ...review,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("[addReview]", error);
    throw error;
  }
}

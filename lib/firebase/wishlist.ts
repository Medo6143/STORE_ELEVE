import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

export async function getWishlist(userId: string): Promise<string[]> {
  try {
    const snap = await getDoc(doc(db, "wishlist", userId));
    if (!snap.exists()) return [];
    return (snap.data().productIds ?? []) as string[];
  } catch (error) {
    console.error("[getWishlist]", error);
    throw error;
  }
}

export async function addToWishlist(userId: string, productId: string): Promise<void> {
  try {
    const ref = doc(db, "wishlist", userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        userId,
        productIds: [productId],
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(ref, {
        productIds: arrayUnion(productId),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("[addToWishlist]", error);
    throw error;
  }
}

export async function removeFromWishlist(userId: string, productId: string): Promise<void> {
  try {
    await updateDoc(doc(db, "wishlist", userId), {
      productIds: arrayRemove(productId),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("[removeFromWishlist]", error);
    throw error;
  }
}

export async function syncWishlist(userId: string, productIds: string[]): Promise<void> {
  try {
    await setDoc(doc(db, "wishlist", userId), {
      userId,
      productIds,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("[syncWishlist]", error);
    throw error;
  }
}

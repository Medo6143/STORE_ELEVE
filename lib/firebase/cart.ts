import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";
import type { CartItem } from "@/types";

export async function getCart(userId: string): Promise<CartItem[]> {
  try {
    const snap = await getDoc(doc(db, "cart", userId));
    if (!snap.exists()) return [];
    return (snap.data().items ?? []) as CartItem[];
  } catch (error) {
    console.error("[getCart]", error);
    throw error;
  }
}

export async function syncCart(userId: string, items: CartItem[]): Promise<void> {
  try {
    await setDoc(doc(db, "cart", userId), {
      userId,
      items,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("[syncCart]", error);
    throw error;
  }
}

export async function clearCartInFirestore(userId: string): Promise<void> {
  try {
    await setDoc(doc(db, "cart", userId), {
      userId,
      items: [],
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("[clearCartInFirestore]", error);
    throw error;
  }
}

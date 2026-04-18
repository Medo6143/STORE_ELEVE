import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentData,
  runTransaction,
} from "firebase/firestore";
import { db } from "./config";
import type { Order, Product } from "@/types";

function fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): Order {
  return { id: snap.id, ...snap.data() } as Order;
}

export async function createOrder(
  orderData: Omit<Order, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  try {
    const orderRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return orderRef.id;
  } catch (error) {
    console.error("[createOrder API Client]", error);
    throw error;
  }
}

export async function getOrdersByUser(
  userId: string,
  limitCount = 20
): Promise<Order[]> {
  try {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map(fromFirestore);
  } catch (error: any) {
    if (error.code === "failed-precondition") {
      console.warn("[getOrdersByUser] Missing index. Falling back to unordered query.");
      // Fallback: try without orderBy if index is missing
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", userId),
          limit(limitCount)
        );
        const snap = await getDocs(q);
        // Sort manually in memory as a temporary fix
        return snap.docs
          .map(fromFirestore)
          .sort((a, b) => {
            const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
            const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
            return timeB - timeA;
          });
      } catch (fallbackError) {
        console.error("[getOrdersByUser Fallback]", fallbackError);
      }
    }
    console.error("[getOrdersByUser]", error);
    throw error;
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const snap = await getDoc(doc(db, "orders", orderId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Order;
  } catch (error) {
    console.error("[getOrderById]", error);
    throw error;
  }
}

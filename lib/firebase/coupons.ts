import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";
import { db } from "./config";
import type { Coupon } from "@/types";

export async function validateCoupon(code: string): Promise<Coupon | null> {
  try {
    const q = query(
      collection(db, "coupons"),
      where("code", "==", code.toUpperCase()),
      where("isActive", "==", true)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;

    const coupon = { id: snap.docs[0].id, ...snap.docs[0].data() } as Coupon;
    const now = new Date();
    const expiresAt = coupon.expiresAt.toDate();

    if (expiresAt < now) return null;
    if (coupon.usedCount >= coupon.usageLimit) return null;

    return coupon;
  } catch (error) {
    console.error("[validateCoupon]", error);
    throw error;
  }
}

export async function useCoupon(couponId: string): Promise<void> {
  try {
    await updateDoc(doc(db, "coupons", couponId), {
      usedCount: increment(1),
    });
  } catch (error) {
    console.error("[useCoupon]", error);
    throw error;
  }
}

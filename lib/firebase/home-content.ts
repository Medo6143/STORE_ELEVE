import { doc, getDoc } from "firebase/firestore";
import { db } from "./config";
import type { HomeContent } from "@/types";

export async function getHomeContent(): Promise<HomeContent | null> {
  try {
    const snap = await getDoc(doc(db, "homeContent", "main"));
    if (!snap.exists()) return null;
    return snap.data() as HomeContent;
  } catch (error) {
    console.error("[getHomeContent]", error);
    throw error;
  }
}

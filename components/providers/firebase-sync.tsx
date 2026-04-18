"use client";

import { useEffect, useRef } from "react";
import { useAppSelector } from "@/hooks/redux";
import { selectCartItems } from "@/store/slices/cartSlice";
import { selectWishlistIds } from "@/store/slices/wishlistSlice";
import { selectUser } from "@/store/slices/authSlice";
import { syncCart } from "@/lib/firebase/cart";
import { syncWishlist } from "@/lib/firebase/wishlist";

export default function FirebaseSyncProvider() {
  const user = useAppSelector(selectUser);
  const cartItems = useAppSelector(selectCartItems);
  const wishlistIds = useAppSelector(selectWishlistIds);

  // Track whether the initial load from Firebase has completed
  // so we don't immediately overwrite with stale/empty data
  const isInitialLoad = useRef(true);
  const prevUserId = useRef<string | null>(null);

  // Reset initial load flag when user changes (login/logout)
  useEffect(() => {
    if (user?.id !== prevUserId.current) {
      isInitialLoad.current = true;
      prevUserId.current = user?.id ?? null;
      // Give AuthListener time to load data from Firebase before syncing
      const timer = setTimeout(() => {
        isInitialLoad.current = false;
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user?.id]);

  // Sync cart to Firebase on changes
  useEffect(() => {
    if (!user?.id || isInitialLoad.current) return;

    const timeout = setTimeout(() => {
      syncCart(user.id, cartItems).catch((e: unknown) =>
        console.error("[FirebaseSync] cart sync failed:", e)
      );
    }, 500); // debounce 500ms

    return () => clearTimeout(timeout);
  }, [cartItems, user?.id]);

  // Sync wishlist to Firebase on changes
  useEffect(() => {
    if (!user?.id || isInitialLoad.current) return;

    const timeout = setTimeout(() => {
      syncWishlist(user.id, wishlistIds).catch((e: unknown) =>
        console.error("[FirebaseSync] wishlist sync failed:", e)
      );
    }, 500); // debounce 500ms

    return () => clearTimeout(timeout);
  }, [wishlistIds, user?.id]);

  return null;
}

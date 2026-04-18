"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { getUserProfile } from "@/lib/firebase/auth";
import { useAppDispatch } from "@/hooks/redux";
import { setUser, clearUser } from "@/store/slices/authSlice";
import { setCartItems } from "@/store/slices/cartSlice";
import { setWishlist } from "@/store/slices/wishlistSlice";
import { getCart } from "@/lib/firebase/cart";
import { getWishlist } from "@/lib/firebase/wishlist";

export default function AuthListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          dispatch(setUser(profile));
          const [cartItems, wishlistIds] = await Promise.all([
            getCart(firebaseUser.uid),
            getWishlist(firebaseUser.uid),
          ]);
          dispatch(setCartItems(cartItems));
          dispatch(setWishlist(wishlistIds));
        } catch (err) {
          console.error("[AuthListener]", err);
          dispatch(clearUser());
        }
      } else {
        dispatch(clearUser());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return null;
}

"use client";

import Link from "next/link";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/hooks/redux";
import { selectCartCount } from "@/store/slices/cartSlice";
import { selectWishlistIds } from "@/store/slices/wishlistSlice";
import { selectIsLoggedIn } from "@/store/slices/authSlice";
import { useEffect } from "react";
import { db } from "@/lib/firebase/config";
import { doc, onSnapshot } from "firebase/firestore";

interface BannerData {
  isActive: boolean;
  text: string;
  bgColor: string;
  textColor: string;
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const cartCount = useAppSelector(selectCartCount);
  const wishlistIds = useAppSelector(selectWishlistIds);
  const isAuthenticated = useAppSelector(selectIsLoggedIn);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "homeContent", "main"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.banner) {
          setBannerData(data.banner as BannerData);
        }
      }
    });
    return () => unsub();
  }, []);

  return (
    <>
      {/* Dynamic Promo Banner */}
      {bannerData?.isActive && (
        <div 
          className="w-full overflow-hidden whitespace-nowrap py-2"
          style={{ 
            backgroundColor: bannerData.bgColor || "#1a1c1b", 
            color: bannerData.textColor || "#ffffff" 
          }}
        >
          <div className="inline-block animate-marquee uppercase tracking-[0.3em] text-[10px] font-label px-4">
            {/* Repeat content for smooth marquee effect */}
            <span className="mx-4">{bannerData.text}</span>
            <span className="mx-4">—</span>
            <span className="mx-4">{bannerData.text}</span>
            <span className="mx-4">—</span>
            <span className="mx-4">{bannerData.text}</span>
            <span className="mx-4">—</span>
            <span className="mx-4">{bannerData.text}</span>
            <span className="mx-4">—</span>
            <span className="mx-4">{bannerData.text}</span>
          </div>
        </div>
      )}

      {/* Navbar (TopAppBar) */}
      <header className="sticky top-0 z-50 bg-[#f9f9f7]/85 dark:bg-[#1a1c1b]/85 backdrop-blur-3xl flex justify-between items-center px-12 py-6 w-full max-w-[100vw]">
        <div className="flex-1 hidden md:flex gap-8 items-center">
          <nav className="flex gap-8">
            <Link
              className="font-notoSerif text-[#c9a96e] border-b border-[#c9a96e] pb-1 uppercase tracking-[0.2em] text-xs"
              href="/"
            >
              Home
            </Link>
            <Link
              className="font-notoSerif text-[#1a1c1b] dark:text-[#f9f9f7] opacity-70 hover:opacity-100 transition-opacity hover:text-[#c9a96e] uppercase tracking-[0.2em] text-xs"
              href="/shop"
            >
              Shop
            </Link>
            <Link
              className="font-notoSerif text-[#1a1c1b] dark:text-[#f9f9f7] opacity-60 hover:opacity-100 transition-opacity hover:text-[#c9a96e] uppercase tracking-[0.2em] text-xs"
              href="/collections"
            >
              Collections
            </Link>
            <Link
              className="font-notoSerif text-[#1a1c1b] dark:text-[#f9f9f7] opacity-60 hover:opacity-100 transition-opacity hover:text-[#c9a96e] uppercase tracking-[0.2em] text-xs"
              href="/contact"
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Mobile toggle - shown on mobile */}
        <button
          className="md:hidden text-on-surface"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
        </button>

        <Link
          href="/"
          className="text-3xl font-notoSerif tracking-tighter text-[#1a1c1b] dark:text-[#f9f9f7] flex-none"
        >
          Èlevè
        </Link>

        <div className="flex-1 flex justify-end gap-6 items-center">
          <button className="text-on-surface hover:text-primary transition-colors scale-100 active:scale-95 ease-in-out">
            <Search size={24} strokeWidth={1} />
          </button>

          <Link
            href="/wishlist"
            className="relative text-on-surface hover:text-primary transition-colors scale-100 active:scale-95 ease-in-out"
          >
            <Heart size={24} strokeWidth={1} />
            {wishlistIds.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-container text-on-primary-container text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                {wishlistIds.length}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            className="relative text-on-surface hover:text-primary transition-colors scale-100 active:scale-95 ease-in-out"
          >
            <ShoppingBag size={24} strokeWidth={1} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-container text-on-primary-container text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <Link
              href="/account"
              className="text-on-surface hover:text-primary transition-colors flex items-center gap-2 group"
            >
              <User size={20} strokeWidth={1} className="text-primary-container" />
              <span className="hidden lg:inline text-[10px] uppercase tracking-widest font-label font-bold">Account</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-on-surface hover:text-primary transition-colors flex items-center gap-2 group"
            >
              <User size={20} strokeWidth={1} />
              <span className="hidden lg:inline text-[10px] uppercase tracking-widest font-label font-bold">Login</span>
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden fixed inset-0 top-[120px] bg-[#f9f9f7] z-40 flex flex-col items-center pt-16 gap-10 transition-all duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="font-notoSerif text-[#c9a96e] border-b border-[#c9a96e] pb-1 uppercase tracking-[0.2em] text-xs"
        >
          Home
        </Link>
        <Link
          href="/shop"
          onClick={() => setMobileOpen(false)}
          className="font-notoSerif text-[#1a1c1b] opacity-70 hover:opacity-100 transition-opacity uppercase tracking-[0.2em] text-xs"
        >
          Shop
        </Link>
        <Link
          href="/collections"
          onClick={() => setMobileOpen(false)}
          className="font-notoSerif text-[#1a1c1b] opacity-60 hover:opacity-100 transition-opacity uppercase tracking-[0.2em] text-xs"
        >
          Collections
        </Link>
        <Link
          href="/contact"
          onClick={() => setMobileOpen(false)}
          className="font-notoSerif text-[#1a1c1b] opacity-60 hover:opacity-100 transition-opacity uppercase tracking-[0.2em] text-xs"
        >
          Contact
        </Link>
        <Link
          href={isAuthenticated ? "/account" : "/login"}
          onClick={() => setMobileOpen(false)}
          className="font-notoSerif text-[#1a1c1b] opacity-60 hover:opacity-100 transition-opacity uppercase tracking-[0.2em] text-xs"
        >
          {isAuthenticated ? "Account" : "Login"}
        </Link>
      </div>
    </>
  );
}

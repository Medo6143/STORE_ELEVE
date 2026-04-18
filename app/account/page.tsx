"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { selectUser, clearUser } from "@/store/slices/authSlice";
import { clearCart } from "@/store/slices/cartSlice";
import { clearWishlist } from "@/store/slices/wishlistSlice";
import { logout } from "@/lib/firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import Link from "next/link";
import ProtectedRoute from "@/components/providers/protected-route";

export default function AccountPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [street, setStreet] = useState(user?.address?.street ?? "");
  const [city, setCity] = useState(user?.address?.city ?? "");
  const [governorate, setGovernorate] = useState(user?.address?.governorate ?? "");
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <div className="pt-28 pb-20 px-6 md:px-12 max-w-[1440px] mx-auto text-center">
        <h1 className="font-serif text-5xl text-brand-text tracking-tight mb-6">My Account</h1>
        <p className="text-brand-text/50 font-sans mb-8">Please sign in to view your account.</p>
        <Link href="/login">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.id), {
        name,
        phone,
        address: { street, city, governorate },
        updatedAt: serverTimestamp(),
      });
      toast.success("Profile updated!");
    } catch (err) {
      console.error("[AccountPage]", err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(clearUser());
      dispatch(clearCart());
      dispatch(clearWishlist());
      toast.success("Signed out successfully");
      router.push("/");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <ProtectedRoute>
      <div className="pt-28 pb-20 px-6 md:px-12 max-w-[800px] mx-auto">
        <h1 className="font-serif text-5xl text-brand-text tracking-tight mb-4">My Account</h1>
        <div className="w-20 h-[2px] bg-brand-gold mb-16" />

        <form onSubmit={handleSave} className="space-y-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] tracking-[2px] uppercase text-brand-text/50 font-sans mb-2 block">
                Full Name
              </label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="text-[10px] tracking-[2px] uppercase text-brand-text/50 font-sans mb-2 block">
                Email
              </label>
              <Input value={user.email} disabled />
            </div>
          </div>
          <div>
            <label className="text-[10px] tracking-[2px] uppercase text-brand-text/50 font-sans mb-2 block">
              Phone
            </label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] tracking-[2px] uppercase text-brand-text/50 font-sans mb-2 block">
              Street Address
            </label>
            <Input value={street} onChange={(e) => setStreet(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] tracking-[2px] uppercase text-brand-text/50 font-sans mb-2 block">
                City
              </label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] tracking-[2px] uppercase text-brand-text/50 font-sans mb-2 block">
                Governorate
              </label>
              <Input value={governorate} onChange={(e) => setGovernorate(e.target.value)} />
            </div>
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "SAVE CHANGES"}
          </Button>
        </form>

        <div className="border-t border-black/5 pt-8 flex flex-wrap gap-4">
          <Link href="/orders">
            <Button variant="outline">My Orders</Button>
          </Link>
          <Link href="/wishlist">
            <Button variant="outline">My Wishlist</Button>
          </Link>
          <Button variant="ghost" onClick={handleLogout} className="text-red-500 hover:text-red-600">
            Sign Out
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}

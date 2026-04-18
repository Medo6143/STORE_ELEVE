"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/redux";
import { selectUser, selectAuthLoading } from "@/store/slices/authSlice";

interface GuestRouteProps {
  children: React.ReactNode;
}

/**
 * Wraps pages that should only be accessible to guests (login, register).
 * Redirects authenticated users to home or to the ?redirect= param.
 */
export default function GuestRoute({ children }: GuestRouteProps) {
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectAuthLoading);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f9f9f7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-xl font-serif text-[#1a1c1b] tracking-[0.2em] uppercase">
            Èlevè
          </h1>
          <div className="w-6 h-6 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}

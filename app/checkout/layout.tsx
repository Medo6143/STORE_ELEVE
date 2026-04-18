"use client";

import ProtectedRoute from "@/components/providers/protected-route";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

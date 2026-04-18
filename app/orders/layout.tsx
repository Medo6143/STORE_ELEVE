import ProtectedRoute from "@/components/providers/protected-route";

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

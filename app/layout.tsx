import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { StoreProvider } from "@/components/providers/store-provider";
import AuthListener from "@/components/providers/auth-listener";
import FirebaseSyncProvider from "@/components/providers/firebase-sync";
import StoreShell from "@/components/layout/StoreShell";

export const metadata: Metadata = {
  title: "Èlevè Store",
  description: "Luxury fashion storefront for Èlevè",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StoreProvider>
          <AuthListener />
          <FirebaseSyncProvider />
          <StoreShell>{children}</StoreShell>
          <Toaster richColors position="top-right" />
        </StoreProvider>
      </body>
    </html>
  );
}

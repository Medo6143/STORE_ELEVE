"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { loginWithEmail } from "@/lib/firebase/auth";
import GuestRoute from "@/components/providers/guest-route";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      toast.success("Welcome back!");
      const params = new URLSearchParams(window.location.search);
      const redirectPath = params.get("redirect") || "/";
      router.push(redirectPath);
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestRoute>
    <main className="flex min-h-screen overflow-hidden">
      {/* Hero Image Section (Left) */}
      <section className="hidden lg:flex lg:w-1/2 relative bg-on-surface">
        <img
          alt="High-end editorial fashion photography"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSIy4go5FSM4aENVoHNa29g7DlEIwglLY6pcywQZdp8kraIbqGOjqIpwNSE8yKy1M-RxP4qiGm3LMsN1_cqyn0KDKFcs_-wwvctUWM11p0ImSvoIrziWF_W4WH1WqDOm2ei0hGFkQAs_-H0WtnPdq4vAoEfAPuaJ8J8GQZcprjq_qmtay8gdwAUotgXs-_osSc56te8i2slvhbeVi-SQfcAD_g3NfMmgBIuIxVrs_YyyT09kg1ARF8YSOpOviEnoTMSF0pTA1bDOE"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 to-transparent" />
        <div className="relative z-10 flex flex-col justify-center px-24 h-full">
          <div className="mb-12">
            <span className="text-primary-container font-label uppercase tracking-[0.4em] text-xs">
              The Digital Curator
            </span>
          </div>
          <blockquote className="text-surface font-headline text-5xl leading-tight italic max-w-lg mb-8">
            &ldquo;Style is a way to say who you are without having to speak.&rdquo;
          </blockquote>
          <div className="w-12 h-[1px] bg-primary-container" />
        </div>
        <div className="absolute bottom-12 left-12">
          <h1 className="text-surface-container-lowest font-headline tracking-[0.2em] text-2xl uppercase">
            Èlevè
          </h1>
        </div>
      </section>

      {/* Login Form Section (Right) */}
      <section className="w-full lg:w-1/2 bg-surface-container-lowest flex items-center justify-center p-8 md:p-24">
        <div className="w-full max-w-md">
          <header className="mb-16">
            <div className="lg:hidden mb-12">
              <h1 className="text-on-surface font-headline tracking-[0.2em] text-2xl uppercase">
                Èlevè
              </h1>
            </div>
            <span className="text-on-surface-variant font-label uppercase tracking-[0.2em] text-[10px]">
              Welcome Back
            </span>
            <h2 className="text-on-surface text-4xl font-headline mt-4 mb-2">Member Sign In</h2>
            <p className="text-on-surface-variant/70 text-sm font-body">
              Enter your details to access your curated collection.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email */}
            <div className="relative group">
              <label
                className="block text-[10px] font-label uppercase tracking-[0.1em] text-on-surface-variant/60 transition-all duration-300 group-focus-within:text-primary-container"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@eleve.com"
                required
                className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-3 px-0 focus:ring-0 focus:border-primary-container transition-all duration-500 text-on-surface placeholder-on-surface-variant/30 font-body"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <label
                className="block text-[10px] font-label uppercase tracking-[0.1em] text-on-surface-variant/60 transition-all duration-300 group-focus-within:text-primary-container"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-3 px-0 focus:ring-0 focus:border-primary-container transition-all duration-500 text-on-surface placeholder-on-surface-variant/30 font-body"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 text-on-surface-variant/50 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Helpers */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="h-4 w-4 border-outline-variant bg-transparent text-primary focus:ring-0 focus:ring-offset-0 rounded-none transition-all"
                />
                <span className="text-[11px] font-label uppercase tracking-[0.05em] text-on-surface-variant/80 group-hover:text-on-surface transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] font-label uppercase tracking-[0.05em] text-on-surface-variant/60 hover:text-primary-container transition-all border-b border-transparent hover:border-primary-container pb-0.5"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Actions */}
            <div className="pt-8 space-y-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-on-surface text-surface-container-lowest font-label uppercase tracking-[0.2em] py-5 text-xs hover:bg-primary-container transition-all duration-500 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant/20" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.1em]">
                  <span className="bg-surface-container-lowest px-4 text-on-surface-variant/40">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center py-4 border border-outline-variant/30 hover:border-on-surface transition-all group"
                >
                  <span className="text-[10px] font-label uppercase tracking-[0.1em] text-on-surface-variant group-hover:text-on-surface">
                    Google
                  </span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center py-4 border border-outline-variant/30 hover:border-on-surface transition-all group"
                >
                  <span className="text-[10px] font-label uppercase tracking-[0.1em] text-on-surface-variant group-hover:text-on-surface">
                    Apple
                  </span>
                </button>
              </div>
            </div>
          </form>

          <footer className="mt-16 text-center">
            <p className="text-xs text-on-surface-variant/60 font-body">
              New to Èlevè?{" "}
              <Link
                href="/register"
                className="text-primary-container font-medium hover:underline underline-offset-4 ml-1"
              >
                Create an account
              </Link>
            </p>
          </footer>
        </div>
      </section>

      {/* Privacy/Terms */}
      <div className="fixed bottom-8 right-8 lg:right-12 z-50 flex space-x-6">
        <Link href="#" className="text-[9px] font-label uppercase tracking-[0.2em] text-on-surface-variant/40 hover:text-on-surface transition-colors">
          Privacy
        </Link>
        <Link href="#" className="text-[9px] font-label uppercase tracking-[0.2em] text-on-surface-variant/40 hover:text-on-surface transition-colors">
          Terms
        </Link>
      </div>
    </main>
    </GuestRoute>
  );
}

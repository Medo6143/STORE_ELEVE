"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { registerWithEmail } from "@/lib/firebase/auth";
import GuestRoute from "@/components/providers/guest-route";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!agreed) {
      toast.error("Please agree to the Privacy Policy");
      return;
    }
    setLoading(true);
    try {
      await registerWithEmail(email, password, name);
      toast.success("Account created successfully!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-transparent border-0 border-b border-outline-variant/30 px-0 py-3 text-on-surface focus:ring-0 focus:border-primary-container placeholder:text-on-surface/20 transition-all duration-300 font-body";

  return (
    <GuestRoute>
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Hero Image Section (Left) */}
      <section className="hidden md:flex md:w-1/2 lg:w-3/5 bg-on-surface relative overflow-hidden">
        <img
          className="absolute inset-0 w-full h-full object-cover opacity-80 grayscale-[20%]"
          alt="Luxury fashion editorial"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAq9JfagOXw28Wo8QuTsrsjSonJfIUWYOT4I94MK6pD-kz3YSnHGf1KyvWLoG3NdSNZBo4kYrSX0cMWBtC_YMmuDPoe1tj6uuv1vAouySUSHmd3Iijj4rqmdRmHUG2tFGQ7gKh2na5LggcB0XMpwbeoFMO4pJs0CtAaCZ-cnO9IKAlE4WwtQaE4QXmNsa3usZptH_8BXPZxGL6Q2lRRF6DMHFXPdhA7ZNE_sWQYxpes9H2ebaOvwamzD2Oj9HsIPny_p_8L-h81zao"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 to-transparent" />
        <div className="relative z-10 p-20 flex flex-col justify-between h-full w-full">
          <div className="flex items-center gap-4">
            <span className="text-surface font-headline text-3xl tracking-[0.3em] uppercase">
              Èlevè
            </span>
          </div>
          <div className="max-w-md">
            <span className="text-primary-container font-label uppercase tracking-[0.2em] text-xs mb-4 block">
              Craftsmanship &amp; Legacy
            </span>
            <h2 className="text-surface font-headline text-5xl leading-tight mb-8">
              Elevate your daily ritual through curated precision.
            </h2>
            <p className="text-surface/70 font-body text-lg leading-relaxed">
              Join a community of connoisseurs dedicated to the art of fine living and editorial
              excellence.
            </p>
          </div>
          <div className="flex gap-12 border-t border-surface/10 pt-8">
            <div>
              <p className="text-surface font-headline text-xl">01</p>
              <p className="text-surface/50 font-label uppercase tracking-widest text-[10px]">
                Curation
              </p>
            </div>
            <div>
              <p className="text-surface font-headline text-xl">02</p>
              <p className="text-surface/50 font-label uppercase tracking-widest text-[10px]">
                Atelier
              </p>
            </div>
            <div>
              <p className="text-surface font-headline text-xl">03</p>
              <p className="text-surface/50 font-label uppercase tracking-widest text-[10px]">
                Archive
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Register Form Section (Right) */}
      <section className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-surface-container-lowest">
        <div className="w-full max-w-md space-y-12">
          <header className="space-y-4">
            <div className="md:hidden mb-12">
              <span className="text-on-surface font-headline text-2xl tracking-[0.2em] uppercase">
                Èlevè
              </span>
            </div>
            <span className="text-primary font-label uppercase tracking-[0.15em] text-[10px]">
              Registration
            </span>
            <h1 className="text-on-surface font-headline text-4xl -tracking-tight">
              Create your profile
            </h1>
            <p className="text-on-surface/60 font-body text-sm">
              Become part of our digital atelier. Please provide your details below.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="relative group">
                <label
                  className="block font-label uppercase tracking-widest text-[10px] text-on-surface/40 group-focus-within:text-primary-container transition-colors duration-300 mb-1"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className={inputCls}
                />
              </div>
              <div className="relative group">
                <label
                  className="block font-label uppercase tracking-widest text-[10px] text-on-surface/40 group-focus-within:text-primary-container transition-colors duration-300 mb-1"
                  htmlFor="reg-email"
                >
                  Email Address
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="atelier@eleve.com"
                  required
                  className={inputCls}
                />
              </div>
              <div className="relative group">
                <label
                  className="block font-label uppercase tracking-widest text-[10px] text-on-surface/40 group-focus-within:text-primary-container transition-colors duration-300 mb-1"
                  htmlFor="reg-password"
                >
                  Password
                </label>
                <input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={inputCls}
                />
              </div>
              <div className="relative group">
                <label
                  className="block font-label uppercase tracking-widest text-[10px] text-on-surface/40 group-focus-within:text-primary-container transition-colors duration-300 mb-1"
                  htmlFor="confirm-password"
                >
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={inputCls}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 border-outline-variant/50 text-primary focus:ring-0 rounded-none bg-transparent"
              />
              <label
                htmlFor="terms"
                className="text-[11px] font-body text-on-surface/60 uppercase tracking-wider"
              >
                I agree to the{" "}
                <Link
                  href="#"
                  className="text-on-surface border-b border-on-surface/20 hover:border-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div className="pt-4 space-y-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-on-surface text-surface py-5 px-8 font-label uppercase tracking-[0.2em] text-xs transition-all duration-500 hover:bg-primary-container hover:text-on-primary-container active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <div className="flex items-center justify-center gap-4 text-center">
                <span className="h-[1px] flex-1 bg-outline-variant/20" />
                <p className="text-[10px] font-label uppercase tracking-[0.1em] text-on-surface/40">
                  Already a member?
                </p>
                <span className="h-[1px] flex-1 bg-outline-variant/20" />
              </div>

              <Link
                href="/login"
                className="block w-full text-center border border-on-surface/10 text-on-surface py-5 px-8 font-label uppercase tracking-[0.2em] text-xs transition-all duration-500 hover:border-primary-container hover:text-primary-container"
              >
                Sign In
              </Link>
            </div>
          </form>

          <footer className="pt-12 text-center md:text-left">
            <p className="text-[10px] font-label uppercase tracking-widest text-on-surface/30">
              © 2025 Èlevè. ALL RIGHTS RESERVED.
            </p>
          </footer>
        </div>
      </section>
    </main>
    </GuestRoute>
  );
}

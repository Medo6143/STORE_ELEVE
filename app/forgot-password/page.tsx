"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { resetPassword } from "@/lib/firebase/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      toast.success("Reset link sent! Check your email.");
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side: Immersive Editorial Image */}
      <section className="relative w-full md:w-1/2 h-64 md:h-screen overflow-hidden">
        <img
          alt="Luxury fashion editorial"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAP2I8_-GELGsafrDF1vJMcv-LOHPPxpL-5i69-ArTiLbQMtyHJ_Vl3vLmlJ09oKTdaMyxISV9WGbVjqd10EKt-uP9F7BBwsN49Oa2uH1zPVGX4vgHJDXbdpDAwE3WVHO_8T2EWzCwcV0b0d2aqzeenQg3ToYb8Li3xmqthSygUqEG3-TAUPpScoGT_pgL2xXCwhbd8cG_NlHpBzpOdcas9HSDDobCFHbgJbphDr39WhZtxOzueQLtof-hEQV2jNNp2f2mg-HRd-yA"
        />
        <div className="absolute inset-0 bg-on-surface/5" />
        {/* Branding */}
        <div className="absolute top-12 left-12">
          <span className="text-2xl font-headline tracking-[0.2em] uppercase text-surface-bright">
            Èlevè
          </span>
        </div>
        {/* Quote */}
        <div className="absolute bottom-12 left-12 right-12 max-w-sm hidden md:block">
          <p className="text-surface-bright font-headline italic text-xl leading-relaxed opacity-90">
            &ldquo;Curating the essence of modern elegance, one detail at a time.&rdquo;
          </p>
        </div>
      </section>

      {/* Right Side: Form */}
      <section className="w-full md:w-1/2 flex items-center justify-center bg-surface-container-lowest px-6 py-12 md:px-24">
        <div className="w-full max-w-md">
          {/* Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-headline text-on-surface tracking-tight mb-4">
              Forgot Password
            </h1>
            <p className="text-on-surface-variant font-body font-light text-base leading-relaxed">
              Enter the email address associated with your account and we will send you a link to
              reset your password.
            </p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="group">
              <label
                className="block text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant mb-3 transition-colors group-focus-within:text-primary-container"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@eleve.com"
                required
                className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-3 px-0 text-on-surface focus:ring-0 focus:border-primary-container font-body transition-all duration-500 placeholder:text-on-surface/20"
              />
            </div>

            <div className="pt-4 flex flex-col space-y-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-on-surface text-surface py-5 px-8 font-label uppercase tracking-[0.15em] text-xs transition-all duration-400 hover:bg-primary-container hover:text-on-primary-container active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Sending..." : "Reset Password"}
              </button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-block relative group text-xs font-label uppercase tracking-[0.1em] text-on-surface/60 hover:text-primary-container transition-colors"
                >
                  Back to Login
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary-container transition-all duration-500 group-hover:w-full" />
                </Link>
              </div>
            </div>
          </form>

          {/* Support */}
          <footer className="mt-24 pt-8 border-t border-outline-variant/10">
            <div className="flex flex-col space-y-4">
              <span className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface/30">
                Need Assistance?
              </span>
              <p className="text-xs font-body text-on-surface-variant leading-relaxed">
                If you&apos;re having trouble resetting your password, please contact our concierge
                at{" "}
                <span className="text-on-surface font-medium underline underline-offset-4 decoration-primary-container/30">
                  support@eleve.com
                </span>
              </p>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}

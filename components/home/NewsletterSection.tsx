"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <section className="bg-surface-container py-24">
      <div className="max-w-[600px] mx-auto px-6 text-center">
        <p className="text-[10px] tracking-[0.2em] font-label uppercase text-on-surface/50 mb-4">
          Stay in the World of Èlevè
        </p>
        <h2 className="font-notoSerif text-3xl md:text-4xl text-on-surface mb-4">
          Join the Atelier
        </h2>
        <p className="text-sm text-on-surface/60 font-body mb-10 leading-relaxed">
          Subscribe to receive updates on new collections, exclusive offers and styling tips.
        </p>
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-surface-container-lowest border border-on-surface/10 px-5 py-4 text-[10px] tracking-widest uppercase font-label outline-none focus:border-primary-container transition-colors"
            required
          />
          <button
            type="submit"
            className="bg-on-surface text-surface px-8 py-4 font-label text-[10px] tracking-[0.3em] uppercase hover:bg-primary-container transition-all duration-400"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

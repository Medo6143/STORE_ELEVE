"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, CreditCard, Wallet } from "lucide-react";

const SHOP_LINKS = [
  { href: "/shop", label: "New Arrivals" },
  { href: "/shop", label: "Women's Collection" },
  { href: "/shop", label: "Men's Collection" },
  { href: "/collections", label: "Bespoke" },
];

const CONCIERGE_LINKS = [
  { href: "/p/about", label: "About Us" },
  { href: "/p/shipping", label: "Shipping & Returns" },
  { href: "/p/privacy", label: "Privacy Policy" },
  { href: "/p/terms", label: "Terms of Service" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Welcome to the circle. Early access awaits.");
    setEmail("");
  };

  return (
    <footer className="bg-[#f4f4f2] dark:bg-[#1a1c1b] mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-6 md:px-12 lg:px-20 py-16 md:py-24">
        {/* Brand Column */}
        <div className="lg:col-span-1">
          <div className="text-3xl md:text-4xl font-notoSerif text-[#1a1c1b] dark:text-[#f9f9f7] mb-4">
            Èlevè
          </div>
          <p className="font-notoSerif leading-relaxed opacity-60 mb-8 max-w-[240px]">
            Curating the intersection of timeless silhouettes and contemporary luxury.
          </p>
          <div className="flex gap-4">
            <CreditCard size={20} className="text-on-surface-variant opacity-60" />
            <Wallet size={20} className="text-on-surface-variant opacity-60" />
          </div>
        </div>

        {/* Shop Links */}
        <div>
          <h5 className="font-label uppercase tracking-widest text-[10px] text-primary mb-8">
            Shop
          </h5>
          <ul className="space-y-4">
            {SHOP_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="font-notoSerif text-[#1a1c1b] dark:text-[#f9f9f7] opacity-60 hover:underline hover:underline-offset-4 decoration-[#c9a96e] transition-opacity"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Concierge Links */}
        <div>
          <h5 className="font-label uppercase tracking-widest text-[10px] text-primary mb-8">
            Concierge
          </h5>
          <ul className="space-y-4">
            {CONCIERGE_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="font-notoSerif text-[#1a1c1b] dark:text-[#f9f9f7] opacity-60 hover:underline hover:underline-offset-4 decoration-[#c9a96e] transition-opacity"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h5 className="font-label uppercase tracking-widest text-[10px] text-primary mb-8">
            Join the Circle
          </h5>
          <p className="font-notoSerif text-sm opacity-60 mb-6">
            Receive early access to collections and curated editorials.
          </p>
          <form onSubmit={handleSubscribe} className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@address.com"
              className="w-full bg-transparent border-0 border-b border-outline-variant/30 px-0 py-3 focus:ring-0 focus:border-primary-container font-notoSerif italic outline-none"
            />
            <button
              type="submit"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-primary-container hover:text-primary transition-colors"
            >
              <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-outline-variant/10 px-6 md:px-12 lg:px-20 py-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-label uppercase tracking-widest opacity-40">
        <p>&copy; {new Date().getFullYear()} Èlevè. The Digital Curator. All Rights Reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <span>Visa</span>
          <span>MasterCard</span>
          <span>Amex</span>
          <span>Apple Pay</span>
        </div>
      </div>
    </footer>
  );
}

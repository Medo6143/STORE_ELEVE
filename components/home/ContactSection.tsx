"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your inquiry. We will be in touch shortly.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="py-24 md:py-40 px-6 md:px-12 bg-surface">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
        {/* Left - Contact Info */}
        <div>
          <h2 className="font-notoSerif text-4xl md:text-5xl mb-8 md:mb-12 tracking-tight">
            Connect with <br />
            the Atelier
          </h2>
          <p className="text-on-surface/70 mb-12 md:mb-16 max-w-md leading-relaxed">
            Whether you seek bespoke tailoring or have inquiries regarding our latest collection, our digital concierge is at your service.
          </p>
          <div className="space-y-8">
            <div>
              <p className="font-label uppercase text-[10px] tracking-[0.3em] text-primary-container mb-2">
                Inquiries
              </p>
              <p className="font-notoSerif text-lg md:text-xl">concierge@eleve.com</p>
            </div>
            <div>
              <p className="font-label uppercase text-[10px] tracking-[0.3em] text-primary-container mb-2">
                Location
              </p>
              <p className="font-notoSerif text-lg md:text-xl">72 Rue du Faubourg Saint-Honoré, Paris</p>
            </div>
            <div className="flex gap-6 pt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-on-surface opacity-60 hover:opacity-100 transition-opacity"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-on-surface opacity-60 hover:opacity-100 transition-opacity"
              >
                Vogue
              </a>
              <a
                href="#"
                className="text-on-surface opacity-60 hover:opacity-100 transition-opacity"
              >
                Pinterest
              </a>
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
          <div className="group">
            <label className="block font-label uppercase text-[10px] tracking-widest text-on-surface opacity-60 mb-4 group-focus-within:text-primary-container transition-colors">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              required
              className="w-full bg-transparent border-0 border-b border-outline-variant/30 px-0 py-3 focus:ring-0 focus:border-primary-container transition-all outline-none"
            />
          </div>
          <div className="group">
            <label className="block font-label uppercase text-[10px] tracking-widest text-on-surface opacity-60 mb-4 group-focus-within:text-primary-container transition-colors">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              required
              className="w-full bg-transparent border-0 border-b border-outline-variant/30 px-0 py-3 focus:ring-0 focus:border-primary-container transition-all outline-none"
            />
          </div>
          <div className="group">
            <label className="block font-label uppercase text-[10px] tracking-widest text-on-surface opacity-60 mb-4 group-focus-within:text-primary-container transition-colors">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Your inquiry..."
              rows={4}
              required
              className="w-full bg-transparent border-0 border-b border-outline-variant/30 px-0 py-3 focus:ring-0 focus:border-primary-container transition-all resize-none outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-on-surface text-surface py-5 uppercase tracking-[0.3em] font-bold text-[10px] hover:bg-primary-container transition-all duration-500"
          >
            Send Inquiry
          </button>
        </form>
      </div>
    </section>
  );
}

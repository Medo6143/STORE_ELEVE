"use client";

import Image from "next/image";

export default function VideoSection() {
  return (
    <section className="relative w-full h-[600px] md:h-[700px] lg:h-[819px] flex items-center justify-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920&q=80"
        alt="The Art of Elevated Living"
        fill
        className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
        priority
      />
      <div className="relative z-10 text-center px-6 md:px-12">
        <h2 className="font-notoSerif text-4xl md:text-5xl lg:text-7xl text-white italic font-light tracking-tight mb-8">
          &ldquo;The Art of Elevated Living&rdquo;
        </h2>
        <button className="text-white border border-white px-8 md:px-12 py-4 font-label uppercase tracking-widest text-[10px] hover:bg-white hover:text-on-surface transition-all duration-500">
          Watch the Film
        </button>
      </div>
    </section>
  );
}

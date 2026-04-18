"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { HeroSlide } from "@/types";

interface HeroCarouselProps {
  slides: HeroSlide[];
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const activeSlides = slides.filter((s) => s.isActive).sort((a, b) => a.order - b.order);
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next, activeSlides.length]);

  if (!activeSlides.length) return null;

  const slide = activeSlides[current];

  return (
    <section className="relative w-full h-[100vh] min-h-[600px] bg-surface-container-low overflow-hidden">
      {activeSlides.map((s, i) => (
        <div
          key={s.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            i === current ? "opacity-100" : "opacity-0"
          )}
        >
          <Image 
            src={s.imageUrl} 
            alt="" 
            fill 
            className="object-cover" 
            style={{ objectPosition: s.imageAlignment || "center" }}
            priority={i === 0} 
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10">
        <p className="text-[10px] tracking-[0.3em] uppercase text-white/80 font-label mb-8">
          {slide?.subtitle || "SPRING / SUMMER 2025"}
        </p>
        <h1 className="font-notoSerif text-white text-4xl md:text-7xl lg:text-[110px] leading-[0.95] tracking-tighter max-w-[800px] text-balance drop-shadow-2xl">
          {slide?.title || "The Quiet"}
        </h1>
        <Link
          href={slide?.link || "/shop"}
          className="mt-12 bg-on-surface text-surface text-[10px] tracking-[0.3em] uppercase px-12 py-5 font-label hover:bg-primary-container transition-all duration-400"
        >
          Shop Now
        </Link>
      </div>

      {activeSlides.length > 1 && (
        <div className="absolute bottom-10 left-12 flex gap-4 z-10">
          {activeSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn("w-12 h-[2px] transition-colors", i === current ? "bg-white" : "bg-white/30")}
            />
          ))}
        </div>
      )}
    </section>
  );
}

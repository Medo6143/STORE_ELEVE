"use client";

import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types";

interface CategorySectionProps {
  categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
  if (!categories.length) return null;

  const large = categories[0];
  const rest = categories.slice(1, 3);

  return (
    <section className="px-6 md:px-12 py-24 max-w-[1440px] mx-auto">
      <p className="text-center text-[10px] tracking-[0.3em] uppercase text-on-surface/50 font-label mb-20">
        SHOP BY CATEGORY
      </p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {large && (
          <Link href={`/shop?category=${large.slug}`} className="md:col-span-7 group">
            <div className="relative h-[400px] md:h-[700px] overflow-hidden bg-surface-container-low">
              {large.image && (
                <Image
                  src={large.image}
                  alt={large.name}
                  fill
                  className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                />
              )}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
            <div className="flex items-baseline justify-between mt-6">
              <h3 className="font-notoSerif text-3xl text-on-surface">{large.name}</h3>
              <span className="text-[10px] tracking-[0.2em] uppercase text-on-surface/40 font-label">
                01 / COLLECTION
              </span>
            </div>
          </Link>
        )}

        <div className="md:col-span-5 flex flex-col gap-8 md:pt-24">
          {rest.map((cat, i) => (
            <Link key={cat.id} href={`/shop?category=${cat.slug}`} className="group">
              <div className="relative h-[300px] md:h-[400px] overflow-hidden bg-surface-container-low">
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
              <div className="flex items-baseline justify-between mt-6">
                <h3 className="font-notoSerif text-3xl text-on-surface">{cat.name}</h3>
                <span className="text-[10px] tracking-[0.2em] uppercase text-on-surface/40 font-label">
                  {String(i + 2).padStart(2, "0")} / {cat.name.toUpperCase()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/types";

interface CollectionsSectionProps {
  collections: Collection[];
}

export default function CollectionsSection({ collections }: CollectionsSectionProps) {
  if (!collections.length) return null;

  return (
    <section className="px-6 md:px-12 py-24 md:py-32 max-w-[1440px] mx-auto">
      <div className="flex items-end justify-between mb-16">
        <div>
          <p className="text-[10px] tracking-[0.2em] font-label uppercase text-on-surface/50 mb-4">
            Curated Selection
          </p>
          <h2 className="font-notoSerif text-4xl md:text-5xl text-on-surface">
            Our Collections
          </h2>
        </div>
        <Link
          href="/collections"
          className="text-[10px] tracking-[0.2em] font-label uppercase text-primary border-b border-primary-container pb-1"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {collections.map((col, i) => (
          <Link
            key={col.id}
            href={`/collections/${col.slug}`}
            className={`group relative overflow-hidden h-[500px] md:h-[600px] ${i % 2 === 1 ? "mt-0 md:mt-12" : ""}`}
          >
            <Image
              src={col.coverImage}
              alt={col.name}
              fill
              className="object-cover grayscale-[10%] group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-0 border border-primary-container scale-0 group-hover:scale-100 transition-transform duration-500 origin-center opacity-0 group-hover:opacity-100" />
            <div className="absolute bottom-8 left-8">
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/60 font-label mb-2">
                {col.description || "COLLECTION"}
              </p>
              <h3 className="font-notoSerif text-2xl text-white">{col.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCollections } from "@/lib/firebase/collections";
import type { Collection } from "@/types";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCollections()
      .then(setCollections)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-28 pb-20 px-6 md:px-12 max-w-[1440px] mx-auto">
      <h1 className="font-serif text-5xl text-brand-text tracking-tight mb-4">Collections</h1>
      <div className="w-20 h-[2px] bg-brand-gold mb-16" />

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className="group relative h-[500px] overflow-hidden"
            >
              <Image
                src={col.coverImage}
                alt={col.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10">
                <p className="text-[10px] tracking-[2px] uppercase text-white/60 font-sans mb-2">
                  {col.description || "COLLECTION"}
                </p>
                <h2 className="font-serif text-3xl text-white">{col.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

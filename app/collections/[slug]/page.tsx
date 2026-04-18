"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCollectionBySlug } from "@/lib/firebase/collections";
import { getProductsByCollection } from "@/lib/firebase/products";
import { getCategoriesByCollection } from "@/lib/firebase/categories";
import { formatPrice } from "@/lib/utils";
import type { Collection, Product, Category } from "@/types";

export default function CollectionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  useEffect(() => {
    async function load() {
      try {
        const col = await getCollectionBySlug(slug);
        if (col) {
          setCollection(col);
          const [prods, cats] = await Promise.all([
            getProductsByCollection(col.id, 50),
            getCategoriesByCollection?.(col.id).catch(() => []) ?? Promise.resolve([]),
          ]);
          setProducts(prods);
          setCategories(cats);
        }
      } catch (err) {
        console.error("[CollectionDetail]", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const filtered = useMemo(() => {
    let result = products;
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.categoryId));
    }
    if (sortBy === "price-asc") result = [...result].sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    if (sortBy === "price-desc") result = [...result].sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    return result;
  }, [products, selectedCategories, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface">
        <div className="w-8 h-8 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface">
        <p className="text-on-surface-variant/40 font-body">Collection not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface">
      {/* Hero Banner */}
      <header className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {collection.coverImage && (
          <div className="absolute inset-0 z-0">
            <Image src={collection.coverImage} alt={collection.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-on-surface/20" />
          </div>
        )}
        <div className="relative z-10 text-center text-surface px-4 max-w-5xl">
          <span className="font-label uppercase tracking-[0.4em] text-xs mb-6 block opacity-90">
            {collection.description || "Exclusive Collection"}
          </span>
          <h1 className="font-headline text-8xl md:text-[10rem] leading-none tracking-tighter italic lowercase">
            {collection.name}
          </h1>
          <p className="mt-8 font-label uppercase tracking-[0.2em] text-sm max-w-lg mx-auto leading-relaxed border-t border-surface/30 pt-8">
            {collection.description || "Discover the curation."}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 md:px-12 py-32">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Filter Sidebar */}
          <aside className="w-full lg:w-64 space-y-12 shrink-0">
            <div>
              <h3 className="font-label uppercase tracking-widest text-xs font-bold mb-8 text-on-surface">Refine Selection</h3>
              <div className="space-y-10">
                {/* Category Filter */}
                {categories.length > 0 && (
                  <div className="group">
                    <label className="font-label uppercase tracking-[0.1em] text-[10px] text-on-surface-variant block mb-4">Category</label>
                    <div className="flex flex-col space-y-3">
                      {categories.map((cat) => (
                        <label key={cat.id} className="flex items-center group cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat.id)}
                            onChange={() => toggleCategory(cat.id)}
                            className="w-4 h-4 border-outline-variant text-primary focus:ring-0 rounded-none mr-3 bg-transparent"
                          />
                          <span className="font-label text-sm text-on-surface/70 group-hover:text-primary transition-colors">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sort */}
                <div>
                  <label className="font-label uppercase tracking-[0.1em] text-[10px] text-on-surface-variant block mb-4">Sort By</label>
                  <div className="flex flex-col space-y-3">
                    {[
                      { value: "default", label: "Default" },
                      { value: "price-asc", label: "Price: Low → High" },
                      { value: "price-desc", label: "Price: High → Low" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSortBy(opt.value as typeof sortBy)}
                        className={`text-left font-label text-sm transition-colors ${sortBy === opt.value ? "text-primary font-bold" : "text-on-surface/70 hover:text-primary"}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Gallery (Asymmetric) */}
          <section className="flex-grow">
            {filtered.length === 0 ? (
              <p className="text-center py-32 text-on-surface-variant/40 font-body">No products match your filters.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-32">
                {filtered.map((product, index) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className={`group cursor-pointer ${index % 2 === 1 ? "md:mt-24" : ""}`}
                  >
                    <div className="relative overflow-hidden mb-8 aspect-[3/4] bg-surface-container-low">
                      <Image
                        src={product.images[0] || product.mainImage || "/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 border border-primary-container opacity-0 transition-all duration-500 scale-95 group-hover:scale-100 group-hover:opacity-100 m-4" />
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-headline text-2xl mb-1">{product.name}</h4>
                        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                          {product.variants?.[0]?.color || ""}
                        </p>
                      </div>
                      <p className="font-body font-medium">{formatPrice(product.salePrice || product.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

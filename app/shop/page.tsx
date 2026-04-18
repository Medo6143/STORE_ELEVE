"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getActiveProducts, getProductsByCategory, getProductsByCollection } from "@/lib/firebase/products";
import { getCollections } from "@/lib/firebase/collections";
import { getCategories } from "@/lib/firebase/categories";
import { ProductCard } from "@/components/shop/ProductCard";
import type { Product, Collection, Category, Size } from "@/types";

const ALL_SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];
const ITEMS_PER_PAGE = 12;

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryFilter = searchParams.get("category");
  const collectionFilter = searchParams.get("collection");

  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchFilters() {
      const [cols, cats] = await Promise.all([getCollections(), getCategories()]);
      setCollections(cols);
      setCategories(cats);
    }
    fetchFilters();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let data: Product[];
        if (categoryFilter) {
          const cat = categories.find((c) => c.slug === categoryFilter);
          data = cat ? await getProductsByCategory(cat.id, 50) : await getActiveProducts(50);
        } else if (collectionFilter) {
          const col = collections.find((c) => c.slug === collectionFilter);
          data = col ? await getProductsByCollection(col.id, 50) : await getActiveProducts(50);
        } else {
          data = await getActiveProducts(50);
        }
        setProducts(data);
      } catch (err) {
        console.error("[ShopPage]", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [categoryFilter, collectionFilter, categories, collections]);

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
    setPage(1);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedSize(null);
    setSortBy("newest");
    setPage(1);
    router.push("/shop");
  };

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.categoryId));
    }
    if (selectedSize) {
      result = result.filter((p) => p.variants.some((v) => v.size === selectedSize));
    }
    if (sortBy === "price-asc") result.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    if (sortBy === "price-desc") result.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    return result;
  }, [products, selectedCategories, selectedSize, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const sortLabels: Record<string, string> = { newest: "Newest", "price-asc": "Price: Low → High", "price-desc": "Price: High → Low" };

  return (
    <main className="pt-32 pb-24 px-6 md:px-12">
      {/* Header */}
      <header className="mb-16">
        <nav className="flex mb-4 gap-2 text-[10px] font-label uppercase tracking-widest opacity-60">
          <Link href="/" className="hover:opacity-100 transition-opacity">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:opacity-100 transition-opacity">Shop</Link>
          <span>/</span>
          <span className="text-on-surface opacity-100">All Products</span>
        </nav>
        <h2 className="text-6xl font-headline tracking-[-0.03em] uppercase">All Products</h2>
      </header>

      <div className="flex gap-20">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 h-fit sticky top-32">
          <div className="mb-10">
            <span className="font-label uppercase tracking-[0.1em] text-[10px] text-primary font-bold">FILTER</span>
            <p className="font-label uppercase tracking-[0.1em] text-[10px] text-on-surface opacity-60">CURATED SELECTION</p>
          </div>

          {/* Category */}
          {categories.length > 0 && (
            <div className="mb-10">
              <h4 className="font-label text-[11px] tracking-widest font-bold mb-6 opacity-80">CATEGORY</h4>
              <ul className="space-y-4">
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className="flex items-center group cursor-pointer"
                  >
                    <div className={`w-3 h-3 border mr-3 transition-colors ${
                      selectedCategories.includes(cat.id)
                        ? "border-primary bg-primary"
                        : "border-outline-variant group-hover:border-primary"
                    }`} />
                    <span className="font-label text-[10px] tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity">
                      {cat.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Size */}
          <div className="mb-10">
            <h4 className="font-label text-[11px] tracking-widest font-bold mb-6 opacity-80">SIZE</h4>
            <div className="grid grid-cols-3 gap-2">
              {ALL_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => { setSelectedSize(selectedSize === size ? null : size); setPage(1); }}
                  className={`px-3 py-2 border font-label text-[10px] transition-colors ${
                    selectedSize === size
                      ? "border-primary text-primary font-bold"
                      : "border-outline-variant/30 hover:border-primary"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color swatches — pulled from products */}
          {products.length > 0 && (
            <div className="mb-10">
              <h4 className="font-label text-[11px] tracking-widest font-bold mb-6 opacity-80">COLOR</h4>
              <div className="flex gap-4">
                {[...new Set(products.flatMap((p) => p.variants.map((v) => v.colorHex)))].slice(0, 5).map((hex, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full cursor-pointer ring-1 ring-offset-2 ring-primary ring-opacity-0 hover:ring-opacity-100 transition-all"
                    style={{ backgroundColor: hex || "#ccc" }}
                  />
                ))}
              </div>
            </div>
          )}

          <button
            onClick={resetFilters}
            className="font-label uppercase tracking-[0.1em] text-[10px] text-primary border-b border-primary/20 pb-2 self-start hover:border-primary transition-colors"
          >
            RESET FILTERS
          </button>

          <div className="mt-20 space-y-4">
            <span className="flex items-center gap-3 font-label text-[10px] tracking-widest opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
              <span className="material-symbols-outlined text-sm">straighten</span> SIZE GUIDE
            </span>
            <span className="flex items-center gap-3 font-label text-[10px] tracking-widest opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
              <span className="material-symbols-outlined text-sm">local_shipping</span> SHIPPING
            </span>
          </div>
        </aside>

        {/* Product Content */}
        <div className="flex-grow">
          {/* Grid Header */}
          <div className="flex justify-between items-end mb-12 pb-6 border-b border-outline-variant/10">
            <span className="font-label text-[10px] tracking-[0.2em] opacity-40 uppercase">
              {filtered.length} PIECE{filtered.length !== 1 ? "S" : ""}
            </span>
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-4 cursor-pointer group"
              >
                <span className="font-label text-[10px] tracking-[0.1em] font-bold">SORT BY:</span>
                <span className="font-label text-[10px] tracking-[0.1em] opacity-60 group-hover:opacity-100 transition-opacity uppercase">
                  {sortLabels[sortBy]}
                </span>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-2 bg-surface-container-lowest border border-outline-variant/20 shadow-lg z-20 py-2 min-w-[180px]">
                  {(Object.entries(sortLabels) as [string, string][]).map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => { setSortBy(val as typeof sortBy); setSortOpen(false); }}
                      className={`block w-full text-left px-6 py-3 font-label text-[10px] tracking-widest uppercase hover:bg-surface-container-low transition-colors ${
                        sortBy === val ? "text-primary font-bold" : "opacity-60"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-8 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />
            </div>
          ) : paged.length === 0 ? (
            <p className="text-center py-32 text-on-surface-variant/40 font-body">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-24">
              {paged.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-32 flex justify-center items-center gap-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`material-symbols-outlined ${page === 1 ? "opacity-30 cursor-not-allowed" : "hover:text-primary transition-colors cursor-pointer"}`}
              >
                arrow_back
              </button>
              <div className="flex items-center gap-6 font-label text-[10px] tracking-[0.2em] font-bold">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`${
                      page === i + 1
                        ? "text-primary border-b border-primary"
                        : "opacity-40 hover:opacity-100 transition-opacity"
                    } cursor-pointer`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`material-symbols-outlined ${page === totalPages ? "opacity-30 cursor-not-allowed" : "hover:text-primary transition-colors cursor-pointer"}`}
              >
                arrow_forward
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

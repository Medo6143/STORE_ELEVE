"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { selectWishlistIds, toggleWishlistItem } from "@/store/slices/wishlistSlice";
import { addItem } from "@/store/slices/cartSlice";
import { getProductById } from "@/lib/firebase/products";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import ProtectedRoute from "@/components/providers/protected-route";
import type { Product } from "@/types";

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const wishlistIds = useAppSelector(selectWishlistIds);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const prods = await Promise.all(wishlistIds.map((id) => getProductById(id)));
        setProducts(prods.filter(Boolean) as Product[]);
      } catch (err) {
        console.error("[WishlistPage]", err);
      } finally {
        setLoading(false);
      }
    }
    if (wishlistIds.length > 0) {
      load();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [wishlistIds]);

  const handleRemove = (productId: string) => {
    dispatch(toggleWishlistItem(productId));
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleAddToCart = (product: Product) => {
    dispatch(
      addItem({
        productId: product.id,
        productName: product.name,
        productImage: product.images[0] || "",
        unitPrice: product.salePrice || product.price,
        quantity: 1,
        size: product.variants?.[0]?.size || "",
        color: product.variants?.[0]?.color || "",
        colorHex: product.variants?.[0]?.colorHex || "",
      })
    );
    toast.success("Added to cart");
  };

  return (
    <ProtectedRoute>
      <div className="pt-32 pb-40 px-6 md:px-12 max-w-screen-2xl mx-auto">
        {/* Header */}
        <header className="mb-20 flex flex-col items-start gap-4">
          <span className="font-label uppercase tracking-[0.2em] text-primary font-bold text-[10px]">Your Curated Collection</span>
          <div className="flex items-baseline gap-6 w-full justify-between">
            <h1 className="text-6xl md:text-8xl font-headline tracking-tighter leading-none">My Wishlist</h1>
            <span className="text-xl font-headline italic opacity-40">({products.length} items)</span>
          </div>
          <div className="h-[1px] w-full bg-outline-variant/30 mt-8" />
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 gap-8">
            <span className="material-symbols-outlined text-8xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            <p className="text-2xl font-headline text-center italic">Your collection is currently empty.</p>
            <Link href="/shop" className="inline-block text-on-surface border-b border-primary-container pb-2 uppercase tracking-widest text-xs font-bold hover:text-primary transition-colors duration-300">
              Explore Products
            </Link>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-y-24 gap-x-12">
            {products.map((product, index) => (
              <div
                key={product.id}
                className={`group relative flex flex-col ${index % 3 === 1 ? "md:mt-12" : ""}`}
              >
                {/* Image */}
                <Link href={`/products/${product.id}`} className="group relative flex flex-col w-full h-full">
                  <div className="relative aspect-[3/4] overflow-hidden bg-surface-container-low mb-6 transition-all duration-700 group-hover:shadow-[0px_20px_40px_rgba(26,28,27,0.04)]">
                    <Image
                      src={product.images[0] || "/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(product.id);
                      }}
                    className="absolute top-6 right-6 w-10 h-10 bg-surface/90 backdrop-blur-sm flex items-center justify-center hover:bg-primary-container transition-colors duration-300"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                  {/* Bottom line effect */}
                  <div className="absolute inset-0 border-primary-container scale-x-0 group-hover:scale-x-100 transition-transform duration-500 border-b-[2px]" />
                </div>

                {/* Info */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-headline uppercase tracking-tight">{product.name}</h3>
                    <span className="text-sm tracking-widest uppercase opacity-60">
                      {formatPrice(product.salePrice || product.price)}
                    </span>
                  </div>
                  <p className="text-xs text-secondary tracking-wide uppercase">
                    {product.variants?.[0]?.color || ""}
                  </p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                    className="mt-4 w-full bg-on-surface text-surface py-5 px-8 font-label text-xs uppercase tracking-[0.2em] hover:bg-primary-container transition-all duration-400"
                  >
                    Add to Cart
                  </button>
                </div>
                </Link>
              </div>
            ))}
          </section>
        )}
      </div>
    </ProtectedRoute>
  );
}

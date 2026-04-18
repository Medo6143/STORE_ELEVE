"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { toggleWishlistItem, selectWishlistIds } from "@/store/slices/wishlistSlice";

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
}

export default function FeaturedProducts({
  products,
  title = "New Arrivals",
}: FeaturedProductsProps) {
  const dispatch = useAppDispatch();
  const wishlistIds = useAppSelector(selectWishlistIds);

  if (!products.length) return null;

  return (
    <section className="px-6 md:px-12 py-24 max-w-[1440px] mx-auto">
      <div className="flex items-end justify-between mb-16">
        <div>
          <p className="text-[10px] tracking-[0.2em] font-label uppercase text-on-surface/50 mb-4">
            Latest Pieces
          </p>
          <h2 className="font-notoSerif text-3xl md:text-4xl text-on-surface">{title}</h2>
        </div>
        <Link
          href="/shop"
          className="text-[10px] tracking-[0.2em] font-label uppercase text-primary border-b border-primary-container pb-1"
        >
          View All
        </Link>
      </div>

      <div className="flex gap-8 overflow-x-auto hide-scrollbar pb-8 -mx-6 px-6 md:mx-0 md:px-0">
        {products.map((product) => {
          const isWished = wishlistIds.includes(product.id);
          const effectivePrice = product.salePrice ?? product.price;

          return (
            <div key={product.id} className="min-w-[280px] lg:min-w-[320px] flex-shrink-0 group">
              <Link href={`/products/${product.id}`}>
                <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-surface-container-low">
                  <Image
                    src={product.mainImage}
                    alt={product.name}
                    fill
                    className="object-cover grayscale-[10%] group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 border border-primary-container scale-0 group-hover:scale-100 transition-transform duration-500 origin-center opacity-0 group-hover:opacity-100" />
                  {product.salePrice && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-primary-container text-[10px] text-on-primary font-label tracking-widest">
                      SALE
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(toggleWishlistItem(product.id));
                    }}
                    className="absolute top-4 right-4 text-on-surface/50 hover:text-primary-container transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <span
                      className="material-symbols-outlined text-xl"
                      style={isWished ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      favorite
                    </span>
                  </button>
                </div>
              </Link>
              <h3 className="text-[10px] tracking-[0.2em] font-label uppercase mb-2">
                {product.name}
              </h3>
              <div className="flex items-center gap-3">
                <p className="font-notoSerif text-lg">{formatPrice(effectivePrice)}</p>
                {product.salePrice && (
                  <span className="font-notoSerif text-sm text-on-surface/30 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

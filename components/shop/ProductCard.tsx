"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { toggleWishlistItem, selectWishlistIds } from "@/store/slices/wishlistSlice";
import { selectUser } from "@/store/slices/authSlice";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const wishlistIds = useAppSelector(selectWishlistIds);
  const isWished = wishlistIds.includes(product.id);
  const price = product.salePrice ?? product.price;
  const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
  const uniqueColors = Array.from(new Set(product.variants?.map((v) => v.colorHex).filter(Boolean))) as string[];

  return (
    <article className="group cursor-pointer">
      <Link href={`/products/${product.id}`}>
        <div className="relative overflow-hidden aspect-[3/4] mb-6 bg-surface-container-low">
          <Image
            src={product.mainImage}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-700 ${product.images?.[1] ? "group-hover:opacity-0" : "group-hover:scale-105"}`}
          />
          
          {product.images?.[1] && (
            <Image
              src={product.images[1]}
              alt={`${product.name} alternate`}
              fill
              className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            />
          )}
          
          {totalStock === 0 && (
            <div className="absolute inset-0 z-10 bg-black/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-[10px] tracking-[0.4em] uppercase font-label text-white border border-white px-6 py-2">
                Sold Out
              </span>
            </div>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!user) {
                toast.error("Please login to add items to your wishlist");
                router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
                return;
              }
              dispatch(toggleWishlistItem(product.id));
            }}
            className="absolute z-20 top-4 right-4 w-10 h-10 flex items-center justify-center bg-surface/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <span
              className="material-symbols-outlined text-on-surface"
              style={{ fontVariationSettings: isWished ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>
        </div>
      </Link>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h3 className="font-headline text-lg tracking-tight">{product.name}</h3>
          {uniqueColors.length > 0 && (
            <div className="flex gap-1.5 pt-2">
              {uniqueColors.map((hex, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: hex || "#ccc" }}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex items-baseline gap-3">
          {product.salePrice && (
            <p className="font-label text-sm tracking-widest text-on-surface/40 line-through">
              {formatPrice(product.price)}
            </p>
          )}
          <p className="font-label text-sm tracking-widest text-primary font-bold">
            {formatPrice(price)}
          </p>
        </div>
      </div>
    </article>
  );
};

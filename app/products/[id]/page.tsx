"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { getProductById, getProductsByCollection } from "@/lib/firebase/products";
import { getReviewsByProduct } from "@/lib/firebase/reviews";
import { formatPrice } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { addItem } from "@/store/slices/cartSlice";
import { toggleWishlistItem, selectWishlistIds } from "@/store/slices/wishlistSlice";
import { selectUser } from "@/store/slices/authSlice";
import type { Product, Review, Size } from "@/types";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const wishlistIds = useAppSelector(selectWishlistIds);

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    async function load() {
      try {
        const p = await getProductById(id);
        setProduct(p);
        if (p?.variants[0]) {
          setSelectedColor(p.variants[0].color);
          setSelectedSize(p.variants[0].size);
        }
        // Load reviews and related products separately so failures don't block the page
        if (p) {
          getReviewsByProduct(id).then(setReviews).catch((e) => console.error("[Reviews]", e));
          if (p.collectionId) {
            getProductsByCollection(p.collectionId, 5)
              .then((rel) => setRelated(rel.filter((r) => r.id !== id)))
              .catch((e) => console.error("[Related]", e));
          }
        }
      } catch (err) {
        console.error("[ProductDetail]", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface">
        <div className="w-8 h-8 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface">
        <p className="text-on-surface-variant/40 font-body">Product not found.</p>
      </div>
    );
  }

  const allImages = [product.mainImage, ...product.images];
  const uniqueColors = [...new Set(product.variants.map((v) => v.color))];
  const uniqueSizes = [...new Set(product.variants.map((v) => v.size))];
  const isWished = wishlistIds.includes(product.id);
  const effectivePrice = product.salePrice ?? product.price;
  const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;

  const currentVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    // Find if any variant with this color has a specific image
    const variantWithImage = product.variants.find(v => v.color === color && v.colorImage);
    if (variantWithImage?.colorImage) {
      // Find index in allImages or add it if not present
      const imgIndex = allImages.indexOf(variantWithImage.colorImage);
      if (imgIndex !== -1) {
        setSelectedImage(imgIndex);
      } else {
        // If not in gallery, we could temporarily show it or just stick to gallery
        // For now, let's assume colorImage is likely in the product.images array anyway
      }
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to your cart");
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color");
      return;
    }
    if (!currentVariant || currentVariant.stock < qty) {
      toast.error("Selected variant is out of stock");
      return;
    }
    dispatch(
      addItem({
        productId: product.id,
        productName: product.name,
        productImage: product.mainImage,
        size: selectedSize,
        color: selectedColor,
        colorHex: currentVariant.colorHex,
        quantity: qty,
        unitPrice: effectivePrice,
      })
    );
    toast.success("Added to cart");
  };

  return (
    <main className="pt-32 pb-24 px-6 md:px-12 max-w-[1440px] mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-3 mb-12 text-[10px] tracking-[0.2em] uppercase text-on-surface/50 font-label">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="w-1 h-1 bg-primary-container rounded-full" />
        <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
        <span className="w-1 h-1 bg-primary-container rounded-full" />
        <span className="text-on-surface">{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        {/* Left: Product Images */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto shrink-0" style={{ scrollbarWidth: "none" }}>
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-24 md:w-24 md:h-32 bg-surface-container-low overflow-hidden transition-all ${
                  i === selectedImage
                    ? "border border-primary-container/20"
                    : "hover:border hover:border-primary-container/40"
                }`}
              >
                <Image
                  src={img}
                  alt=""
                  width={96}
                  height={128}
                  className={`w-full h-full object-cover transition-all ${
                    i !== selectedImage ? "grayscale-[20%] hover:grayscale-0" : ""
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-grow overflow-hidden relative bg-surface-container-low group aspect-[3/4]">
            <Image
              src={allImages[selectedImage]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              priority
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="lg:col-span-5 flex flex-col">
          <span className="text-[10px] tracking-[0.3em] font-label text-primary uppercase mb-4 block">Atelier</span>
          <h1 className="text-5xl lg:text-6xl font-headline mb-6 leading-tight">{product.name}</h1>

          {/* Rating */}
          {avgRating && (
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center text-primary-container">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: `'FILL' ${i < Math.round(Number(avgRating)) ? 1 : 0}` }}
                  >
                    {i + 0.5 < Number(avgRating) && i + 1 > Number(avgRating) ? "star_half" : "star"}
                  </span>
                ))}
                <span className="text-[11px] font-label text-on-surface ml-2 tracking-widest">({avgRating})</span>
              </div>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-4 mb-10">
            <span className="text-3xl font-headline text-on-surface">{formatPrice(effectivePrice)}</span>
            {product.salePrice && (
              <>
                <span className="text-lg font-headline text-on-surface/30 line-through">{formatPrice(product.price)}</span>
                <span className="px-3 py-1 bg-primary-container text-[10px] text-on-primary font-label tracking-widest">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Selectors */}
          <div className="space-y-10 mb-12">
            {/* Color */}
            <div>
              <span className="text-[10px] tracking-[0.2em] font-label uppercase block mb-4">
                Color: {selectedColor}
              </span>
              <div className="flex gap-4">
                {uniqueColors.map((color) => {
                  const variant = product.variants.find((v) => v.color === color);
                  return (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      className={`w-8 h-8 rounded-full transition-all ${
                        selectedColor === color
                          ? "ring-1 ring-offset-4 ring-primary-container"
                          : "ring-offset-4 hover:ring-1 hover:ring-on-surface/20"
                      }`}
                      style={{ backgroundColor: variant?.colorHex || "#ccc" }}
                      title={color}
                    />
                  );
                })}
              </div>
            </div>

            {/* Size */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] tracking-[0.2em] font-label uppercase">Size</span>
                <button className="text-[10px] tracking-[0.2em] font-label uppercase text-primary underline underline-offset-4">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {uniqueSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 border text-xs font-label transition-colors ${
                      selectedSize === size
                        ? "border-primary-container bg-surface-container-lowest"
                        : "border-on-surface/10 hover:border-primary-container"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <span className="text-[10px] tracking-[0.2em] font-label uppercase block mb-4">Quantity</span>
              <div className="flex items-center border border-on-surface/10 w-fit">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-2 hover:bg-surface-container-low transition-colors font-label"
                >
                  −
                </button>
                <span className="px-6 py-2 text-xs font-label">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-4 py-2 hover:bg-surface-container-low transition-colors font-label"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 mb-12">
            <button
              onClick={handleAddToCart}
              className="w-full bg-on-surface text-surface py-5 font-label text-xs tracking-[0.3em] hover:bg-primary-container transition-all duration-400 uppercase"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                if (!user) {
                  toast.error("Please login to add items to your wishlist");
                  router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
                  return;
                }
                dispatch(toggleWishlistItem(product.id));
              }}
              className="w-full border border-on-surface/20 py-5 font-label text-xs tracking-[0.3em] hover:border-on-surface transition-all duration-400 uppercase flex items-center justify-center gap-2"
            >
              <span
                className="material-symbols-outlined text-base"
                style={{ fontVariationSettings: isWished ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
              {isWished ? "In Wishlist" : "Add to Wishlist"}
            </button>
          </div>

          {/* Stock indicator */}
          {currentVariant && (
            <p className="text-[11px] text-on-surface/40 font-label mb-8">
              {currentVariant.stock > 0 ? `${currentVariant.stock} in stock` : "Out of stock"}
            </p>
          )}

          {/* Description & Details */}
          <div className="space-y-6">
            <p className="text-sm leading-relaxed text-on-surface/80 font-body">
              {product.description}
            </p>
            <div className="border-t border-on-surface/5 pt-6 space-y-4">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none py-2">
                  <span className="text-[10px] tracking-[0.2em] font-label uppercase">Material &amp; Care</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="pt-4 pb-2 text-[11px] leading-loose text-on-surface/60 font-body uppercase tracking-widest">
                  Premium quality materials.<br />
                  Refer to product label for care instructions.
                </div>
              </details>
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none py-2 border-t border-on-surface/5 pt-4">
                  <span className="text-[10px] tracking-[0.2em] font-label uppercase">Shipping &amp; Returns</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="pt-4 pb-2 text-[11px] leading-loose text-on-surface/60 font-body uppercase tracking-widest">
                  Complimentary worldwide shipping.<br />
                  14-day returns policy for unworn items.
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <section className="mt-40 pt-20 border-t border-primary-container/10">
          <div className="flex flex-col md:flex-row justify-between items-baseline gap-8 mb-16">
            <div>
              <h2 className="text-4xl font-headline mb-2">Reflections</h2>
              <p className="text-[10px] tracking-[0.2em] text-on-surface/50 font-label uppercase">Customer Experiences</p>
            </div>
            {avgRating && (
              <div className="flex items-center gap-12">
                <div className="text-center">
                  <span className="text-5xl font-headline">{avgRating}</span>
                  <div className="flex text-primary-container mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-xs"
                        style={{ fontVariationSettings: `'FILL' ${i < Math.round(Number(avgRating)) ? 1 : 0}` }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-20 gap-y-16">
            {reviews.map((review) => (
              <div key={review.id} className="space-y-4">
                <div className="flex text-primary-container">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-xs"
                      style={{ fontVariationSettings: `'FILL' ${i < review.rating ? 1 : 0}` }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="text-sm font-headline italic leading-relaxed">&ldquo;{review.comment}&rdquo;</p>
                <div>
                  <span className="text-[10px] font-label tracking-[0.2em] block uppercase">{review.userName}</span>
                  <span className="text-[9px] font-label text-on-surface/40 uppercase">Verified Purchase</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-40">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-headline">Complete the Look</h2>
            <Link href="/shop" className="text-[10px] tracking-[0.2em] font-label uppercase text-primary border-b border-primary-container pb-1">
              View Collection
            </Link>
          </div>
          <div className="flex gap-8 overflow-x-auto pb-8 -mx-6 px-6 md:mx-0 md:px-0" style={{ scrollbarWidth: "none" }}>
            {related.map((rel) => (
              <Link key={rel.id} href={`/products/${rel.id}`} className="min-w-[280px] lg:min-w-[320px] flex-shrink-0 group">
                <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-surface-container-low">
                  <Image
                    src={rel.mainImage}
                    alt={rel.name}
                    fill
                    className="object-cover grayscale-[10%] group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 border border-primary-container scale-0 group-hover:scale-100 transition-transform duration-500 origin-center opacity-0 group-hover:opacity-100" />
                </div>
                <h3 className="text-[10px] tracking-[0.2em] font-label uppercase mb-2">{rel.name}</h3>
                <p className="font-headline text-lg">{formatPrice(rel.salePrice ?? rel.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

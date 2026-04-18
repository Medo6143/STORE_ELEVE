"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { selectCartItems, selectCartTotal, removeItem, updateQuantity } from "@/store/slices/cartSlice";
import { validateCoupon } from "@/lib/firebase/coupons";
import { formatPrice } from "@/lib/utils";
import ProtectedRoute from "@/components/providers/protected-route";
import type { Coupon } from "@/types";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [validating, setValidating] = useState(false);

  // Calculate discount and total
  const discount = appliedCoupon
    ? appliedCoupon.type === "percentage"
      ? subtotal * (appliedCoupon.value / 100)
      : appliedCoupon.value
    : 0;
  const total = subtotal - discount;

  if (items.length === 0) {
    return (
      <ProtectedRoute>
        <div className="pt-32 pb-20 px-6 md:px-12 max-w-[1440px] mx-auto text-center">
          <span className="font-label uppercase tracking-[0.2em] text-[10px] text-primary mb-4 block">Current Selection</span>
          <h1 className="font-headline text-5xl md:text-6xl font-light tracking-tight text-on-surface mb-6">Shopping Bag</h1>
          <p className="text-secondary font-body mb-10">Your shopping bag is empty.</p>
          <Link href="/shop" className="inline-block px-10 py-4 bg-on-surface text-surface font-label text-xs uppercase tracking-widest hover:bg-primary-container transition-colors duration-500">
            Continue Shopping
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-32 pb-20">
        {/* Header */}
        <header className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between border-b border-outline-variant/30 pb-8">
          <div>
            <span className="font-label uppercase tracking-[0.2em] text-[10px] text-primary mb-4 block">Current Selection</span>
            <h1 className="font-headline text-5xl md:text-6xl font-light tracking-tight text-on-surface">Shopping Bag</h1>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="font-label uppercase tracking-widest text-xs text-secondary">{items.length} ITEM{items.length > 1 ? "S" : ""}</p>
          </div>
        </header>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {/* Left: Cart Items */}
          <section className="lg:col-span-7 space-y-12">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`}>
                <div className="flex gap-8 group">
                  <div className="w-[120px] h-[160px] flex-shrink-0 bg-surface-container overflow-hidden relative">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-grow py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-headline text-xl tracking-tight text-on-surface mb-2">{item.productName}</h3>
                        {item.size && <p className="font-label text-[11px] uppercase tracking-widest text-secondary mb-1">Size: {item.size}</p>}
                        {item.color && <p className="font-label text-[11px] uppercase tracking-widest text-secondary">Color: {item.color}</p>}
                      </div>
                      <p className="font-headline text-lg text-on-surface">{formatPrice(item.unitPrice * item.quantity)}</p>
                    </div>
                    <div className="flex justify-between items-end">
                      {/* Quantity */}
                      <div className="flex items-center border border-outline-variant/40 px-4 py-2 space-x-6">
                        <button
                          onClick={() => dispatch(updateQuantity({ productId: item.productId, size: item.size, color: item.color, quantity: Math.max(1, item.quantity - 1) }))}
                          className="text-secondary hover:text-on-surface transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">remove</span>
                        </button>
                        <span className="font-label text-sm w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(updateQuantity({ productId: item.productId, size: item.size, color: item.color, quantity: item.quantity + 1 }))}
                          className="text-secondary hover:text-on-surface transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">add</span>
                        </button>
                      </div>
                      {/* Delete */}
                      <button
                        onClick={() => dispatch(removeItem({ productId: item.productId, size: item.size, color: item.color }))}
                        className="text-outline hover:text-error transition-colors flex items-center"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="h-px w-full bg-outline-variant/30 mt-12" />
              </div>
            ))}

            {/* Continue Shopping */}
            <div className="pt-8">
              <Link href="/shop" className="inline-flex items-center text-primary-container border-b border-primary-container pb-1 uppercase tracking-widest text-[10px] font-bold hover:pb-2 transition-all duration-300">
                <span className="material-symbols-outlined text-[16px] mr-2">arrow_back</span>
                Continue Shopping
              </Link>
            </div>
          </section>

          {/* Right: Summary */}
          <aside className="lg:col-span-5 sticky top-32">
            <div className="bg-surface-container-low p-8 md:p-12">
              <h2 className="font-headline text-2xl tracking-tight text-on-surface mb-10">Order Summary</h2>
              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-label text-secondary uppercase tracking-widest">Subtotal</span>
                  <span className="font-label text-on-surface">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-label text-secondary uppercase tracking-widest">Shipping</span>
                  <span className="font-label text-secondary italic">Calculated at checkout</span>
                </div>
                {/* Coupon */}
                <div className="pt-6">
                  <label className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary mb-2 block" htmlFor="coupon">Promotional Code</label>
                  <div className="flex border-b border-outline-variant/50 focus-within:border-primary-container transition-colors pb-1">
                    <input
                      id="coupon"
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      disabled={validating}
                      className="bg-transparent border-none focus:ring-0 w-full font-label text-sm px-0 placeholder:text-outline-variant uppercase tracking-widest disabled:opacity-50"
                    />
                    <button
                      onClick={async () => {
                        if (!couponCode) return;
                        setValidating(true);
                        try {
                          const coupon = await validateCoupon(couponCode);
                          if (!coupon) {
                            toast.error("Invalid or expired coupon");
                            setAppliedCoupon(null);
                          } else if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
                            toast.error(`Minimum order is ${formatPrice(coupon.minOrderAmount)}`);
                            setAppliedCoupon(null);
                          } else {
                            setAppliedCoupon(coupon);
                            toast.success("Coupon applied!");
                          }
                        } catch {
                          toast.error("Failed to validate coupon");
                        } finally {
                          setValidating(false);
                        }
                      }}
                      disabled={validating}
                      className="font-label text-[10px] uppercase tracking-widest font-bold text-primary-container hover:text-primary transition-colors disabled:opacity-50"
                    >
                      {validating ? "..." : "Apply"}
                    </button>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between items-center mt-4 text-sm">
                      <span className="font-label text-primary uppercase tracking-widest text-[10px]">
                        Discount ({appliedCoupon.code})
                      </span>
                      <span className="font-label text-primary font-bold">-{formatPrice(discount)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-outline-variant/30 pt-8 mb-10">
                <div className="flex justify-between items-end">
                  <span className="font-label text-sm uppercase tracking-[0.3em] font-light">Total</span>
                  <span className="font-headline text-4xl font-light text-on-surface tracking-tighter">{formatPrice(total)}</span>
                </div>
              </div>

              <Link href={`/checkout${appliedCoupon ? `?coupon=${appliedCoupon.code}` : ""}`} className="w-full py-6 bg-on-surface text-surface uppercase tracking-[0.3em] text-xs font-medium hover:bg-primary-container transition-colors duration-500 flex justify-center items-center group">
                Proceed to Checkout
                <span className="material-symbols-outlined ml-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2">arrow_forward</span>
              </Link>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4 text-secondary">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                  <span className="text-[10px] uppercase tracking-widest">Secure checkout &amp; encrypted payment</span>
                </div>
                <div className="flex items-center gap-4 text-secondary">
                  <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                  <span className="text-[10px] uppercase tracking-widest">Complimentary carbon-neutral shipping</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </ProtectedRoute>
  );
}

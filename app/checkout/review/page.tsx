"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Image from "next/image";
import { Lock, ArrowLeft, ArrowRight } from "lucide-react";

export default function ReviewPage() {
  const router = useRouter();
  const items = useSelector((state: RootState) => state.cart.items);
  const shippingInfo = useSelector((state: RootState) => state.cart.shippingInfo);
  const shippingFee = useSelector((state: RootState) => state.cart.shippingFee);

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shipping = shippingFee || 250;
  const total = subtotal + shipping;

  if (!shippingInfo) {
    router.push("/checkout/shipping");
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-16">
        <p className="font-sans uppercase tracking-[0.2em] text-[10px] text-[#c9a96e] mb-4">
          Step 02 — Final Review
        </p>
        <h1 className="font-serif text-5xl md:text-6xl tracking-tighter text-[#1a1c1b]">
          Confirm Selection
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        {/* Left: Items & Shipping */}
        <div className="lg:col-span-8">
          <section className="space-y-16">
            {/* Cart Items */}
            <div className="space-y-12">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex flex-col md:flex-row gap-8 group"
                >
                  <div className="w-full md:w-48 aspect-[3/4] bg-[#f4f4f2] overflow-hidden">
                    <Image
                      src={item.productImage || "/images/placeholder.jpg"}
                      alt={item.productName}
                      width={192}
                      height={256}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-serif text-2xl tracking-tight text-[#1a1c1b]">
                          {item.productName}
                        </h3>
                        <p className="font-serif text-xl text-[#c9a96e]">
                          {(item.unitPrice * item.quantity).toLocaleString()} EGP
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-sans text-[10px] uppercase tracking-widest text-[#1a1c1b]/50">
                          Size: <span className="text-[#1a1c1b]">{item.size || "N/A"}</span>
                        </p>
                        <p className="font-sans text-[10px] uppercase tracking-widest text-[#1a1c1b]/50">
                          Color: <span className="text-[#1a1c1b]">{item.color || "N/A"}</span>
                        </p>
                        <p className="font-sans text-[10px] uppercase tracking-widest text-[#1a1c1b]/50">
                          Quantity: <span className="text-[#1a1c1b]">{item.quantity.toString().padStart(2, "0")}</span>
                        </p>
                      </div>
                    </div>
                    <button className="w-fit font-sans text-[10px] uppercase tracking-widest border-b border-[#c9a96e]/20 pb-1 hover:border-[#c9a96e] transition-all text-[#1a1c1b]">
                      Remove Item
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Summary */}
            <div className="bg-[#f4f4f2] p-12 border-l-4 border-[#c9a96e]">
              <div className="flex justify-between items-center mb-8">
                <h4 className="font-serif text-xl tracking-tight text-[#1a1c1b]">
                  Shipping Destination
                </h4>
                <button
                  onClick={() => router.push("/checkout/shipping")}
                  className="font-sans text-[10px] uppercase tracking-widest text-[#c9a96e] border-b border-[#c9a96e]"
                >
                  Edit Details
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-[#1a1c1b]/40 mb-2">
                    Recipient
                  </p>
                  <p className="font-serif text-lg text-[#1a1c1b]">{shippingInfo.fullName}</p>
                  <p className="font-sans text-sm text-[#1a1c1b]/70">{shippingInfo.phone}</p>
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-[#1a1c1b]/40 mb-2">
                    Address
                  </p>
                  <p className="font-sans text-sm text-[#1a1c1b]/70 leading-relaxed">
                    {shippingInfo.street}
                    <br />
                    {shippingInfo.city}, {shippingInfo.governorate}
                    <br />
                    {shippingInfo.postalCode}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right: Summary & Actions */}
        <div className="lg:col-span-4">
          <div className="sticky top-32 space-y-12">
            {/* Pricing */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-sans text-[10px] uppercase tracking-widest text-[#1a1c1b]/60">
                  Subtotal
                </span>
                <span className="font-serif text-lg text-[#1a1c1b]">
                  {subtotal.toLocaleString()} EGP
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-sans text-[10px] uppercase tracking-widest text-[#1a1c1b]/60">
                  Shipping
                </span>
                <span className="font-sans text-[10px] uppercase tracking-widest text-[#1a1c1b]/60">
                  Complimentary
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-sans text-[10px] uppercase tracking-widest text-[#1a1c1b]/60">
                  Tax
                </span>
                <span className="font-serif text-lg text-[#1a1c1b]">Included</span>
              </div>
              <div className="pt-6 border-t border-[#1a1c1b]/10 flex justify-between items-center">
                <span className="font-serif text-xl tracking-tight text-[#1a1c1b]">Total</span>
                <span className="font-serif text-3xl text-[#c9a96e] tracking-tighter">
                  {total.toLocaleString()} EGP
                </span>
              </div>
            </div>

            {/* Promo Code */}
            <div className="relative">
              <input
                type="text"
                placeholder="Promo Code"
                className="w-full bg-transparent border-0 border-b border-[#d0c5b5]/30 focus:ring-0 focus:border-[#c9a96e] py-4 font-sans text-[10px] uppercase tracking-widest placeholder:text-[#1a1c1b]/30 text-[#1a1c1b]"
              />
              <button className="absolute right-0 bottom-4 font-sans text-[10px] uppercase tracking-widest text-[#c9a96e]">
                Apply
              </button>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={() => router.push("/checkout/payment")}
                className="w-full py-6 bg-[#1a1c1b] text-[#f9f9f7] font-sans text-[11px] uppercase tracking-[0.3em] hover:bg-[#c9a96e] transition-all duration-500 flex items-center justify-center gap-3"
              >
                Confirm & Pay
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => router.push("/checkout/shipping")}
                className="w-full py-6 bg-transparent text-[#1a1c1b] border border-[#1a1c1b]/10 font-sans text-[11px] uppercase tracking-[0.3em] hover:bg-[#f4f4f2] transition-all duration-500 flex items-center justify-center gap-3"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Shipping
              </button>
            </div>

            {/* Security */}
            <div className="flex items-center gap-4 text-[#1a1c1b]/40">
              <Lock className="w-5 h-5" />
              <p className="font-sans text-[10px] uppercase tracking-widest">
                Encrypted Checkout Experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

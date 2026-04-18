"use client";

import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function OrderSummary() {
  const items = useSelector((state: RootState) => state.cart.items);
  const shippingFee = useSelector((state: RootState) => state.cart.shippingFee);

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shipping = shippingFee || 250; // Default 250 EGP
  const total = subtotal + shipping;

  return (
    <div className="space-y-8">
      {/* Order Items */}
      <div className="p-8 bg-white shadow-[0px_20px_40px_rgba(26,28,27,0.04)]">
        <h3 className="text-xl font-serif mb-8 border-b border-[#d0c5b5]/10 pb-4 text-[#1a1c1b]">
          Your Order
        </h3>

        {/* Items */}
        <div className="space-y-6">
          {items.map((item) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4">
              <div className="w-20 h-24 flex-shrink-0 bg-[#eeeeec] overflow-hidden">
                <Image
                  src={item.productImage || "/images/placeholder.jpg"}
                  alt={item.productName}
                  width={80}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-between py-1">
                <div>
                  <p className="font-serif text-sm text-[#1a1c1b]">{item.productName}</p>
                  <p className="font-sans uppercase tracking-widest text-[10px] text-[#1a1c1b]/40 mt-1">
                    {item.color || "Default"} / {item.size || "One Size"}
                  </p>
                  <p className="font-sans text-xs text-[#1a1c1b]/60 mt-1">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-sans text-sm font-semibold text-[#1a1c1b]">
                  {(item.unitPrice * item.quantity).toLocaleString()} EGP
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-4 pt-6 border-t border-[#d0c5b5]/10 mt-6">
          <div className="flex justify-between text-sm">
            <span className="font-sans uppercase tracking-widest text-[#1a1c1b]/60">Subtotal</span>
            <span className="font-sans">{subtotal.toLocaleString()} EGP</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-sans uppercase tracking-widest text-[#1a1c1b]/60">Shipping</span>
            <span className="font-sans">{shipping.toLocaleString()} EGP</span>
          </div>
          <div className="flex justify-between pt-4 border-t border-[#d0c5b5]/20">
            <span className="font-serif text-lg text-[#1a1c1b]">Total</span>
            <span className="font-sans text-lg font-bold text-[#1a1c1b]">
              {total.toLocaleString()} EGP
            </span>
          </div>
        </div>
      </div>

      {/* Editorial Teaser */}
      <div className="relative group aspect-[3/4] overflow-hidden">
        <Image
          src="/images/checkout-editorial.jpg"
          alt="Fashion Editorial"
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 flex flex-col justify-end p-8">
          <h4 className="text-white font-serif text-2xl mb-2">The Winter Collection</h4>
          <a
            href="/collections"
            className="text-[#c9a96e] font-sans uppercase tracking-[0.2em] text-[10px] inline-block border-b border-[#c9a96e] pb-1 w-fit"
          >
            Explore the Lookbook
          </a>
        </div>
      </div>
    </div>
  );
}

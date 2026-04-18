"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getOrderById } from "@/lib/firebase/orders";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order } from "@/types";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id)
      .then(setOrder)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-brand-text/40 font-sans">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-6 md:px-12 max-w-[1440px] mx-auto">
      <h1 className="font-serif text-4xl text-brand-text tracking-tight mb-2">
        Order #{order.id.slice(0, 8)}
      </h1>
      <p className="text-sm text-brand-text/50 font-sans mb-2">
        {order.createdAt ? formatDate(order.createdAt.toDate()) : ""}
      </p>
      <div className="w-20 h-[2px] bg-brand-gold mb-16" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-6 border-b border-black/5 pb-6">
              <div className="relative w-20 h-28 bg-brand-bg-alt shrink-0 overflow-hidden">
                <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-brand-text">{item.productName}</h3>
                <p className="text-[11px] tracking-[1px] uppercase text-brand-text/50 font-sans mt-1">
                  {item.color} / {item.size} — Qty: {item.quantity}
                </p>
                <p className="text-sm font-sans mt-2">{formatPrice(item.unitPrice * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-brand-bg-alt p-8 h-fit space-y-4">
          <h3 className="font-serif text-xl text-brand-text mb-6">Summary</h3>
          <div className="flex justify-between text-sm font-sans">
            <span className="text-brand-text/60">Status</span>
            <span className="uppercase text-[10px] tracking-[1px]">{order.status}</span>
          </div>
          <div className="flex justify-between text-sm font-sans">
            <span className="text-brand-text/60">Payment</span>
            <span className="uppercase text-[10px] tracking-[1px]">{order.paymentStatus}</span>
          </div>
          <div className="border-t border-black/10 pt-4 space-y-2">
            <div className="flex justify-between text-sm font-sans">
              <span className="text-brand-text/60">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm font-sans">
              <span className="text-brand-text/60">Shipping</span>
              <span>{formatPrice(order.shippingFee)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm font-sans text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
          </div>
          <div className="border-t border-black/10 pt-4">
            <div className="flex justify-between text-lg font-sans font-medium">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border-t border-black/10 pt-4 mt-4">
            <h4 className="text-[10px] tracking-[2px] uppercase text-brand-text/50 font-sans mb-3">
              Shipping To
            </h4>
            <p className="text-sm font-sans">{order.shippingAddress.fullName}</p>
            <p className="text-xs text-brand-text/60 font-sans">{order.shippingAddress.phone}</p>
            <p className="text-xs text-brand-text/60 font-sans">
              {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.governorate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

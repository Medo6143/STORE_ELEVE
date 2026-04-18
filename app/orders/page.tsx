"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/store/slices/authSlice";
import { getOrdersByUser } from "@/lib/firebase/orders";
import { formatPrice, formatDate } from "@/lib/utils";
import ProtectedRoute from "@/components/providers/protected-route";
import type { Order } from "@/types";

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-surface-container-high text-on-surface-variant",
  processing: "bg-primary-container/10 text-primary-container border border-primary-container/20",
  shipped: "bg-primary-container/10 text-primary-container border border-primary-container/20",
  delivered: "bg-on-surface text-surface",
  cancelled: "bg-error/10 text-error border border-error/20",
};

export default function OrdersPage() {
  const user = useAppSelector(selectUser);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getOrdersByUser(user.id)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <span className="font-label uppercase tracking-[0.15em] text-[10px] text-primary mb-4 block">Archive &amp; History</span>
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-[-0.03em] text-on-surface leading-tight mb-6">My Orders</h1>
        <p className="text-on-surface-variant/70 font-body mb-10">Please sign in to view your orders.</p>
        <Link href="/login" className="inline-block px-10 py-4 bg-on-surface text-surface font-label text-xs uppercase tracking-widest hover:bg-primary-container transition-colors duration-400">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-20 text-center md:text-left">
          <span className="font-label uppercase tracking-[0.15em] text-[10px] text-primary mb-4 block">Archive &amp; History</span>
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-[-0.03em] text-on-surface leading-tight">My Orders</h1>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <section className="py-20 bg-surface-container-low text-center">
            <h2 className="font-headline text-3xl mb-4">No orders yet</h2>
            <p className="font-body text-on-surface-variant/70 mb-10 max-w-md mx-auto">Start exploring our collections and place your first order.</p>
            <Link href="/shop" className="font-label text-xs uppercase tracking-[0.2em] border-b border-primary-container pb-1 hover:text-primary-container transition-colors">
              Explore Collections
            </Link>
          </section>
        ) : (
          <div className="space-y-20">
            {orders.map((order) => (
              <article key={order.id} className="bg-surface-container-lowest shadow-[0px_20px_40px_rgba(26,28,27,0.04)] hover:outline hover:outline-1 hover:outline-primary-container hover:-outline-offset-1 transition-all duration-500 overflow-hidden">
                <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-start gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <h2 className="font-headline text-2xl font-bold text-on-surface">#{order.id.slice(0, 12).toUpperCase()}</h2>
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${STATUS_BADGE[order.status] || "bg-surface-container-high text-on-surface-variant"}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="font-label text-sm text-on-surface-variant/70">
                      Placed on {order.createdAt ? formatDate(order.createdAt.toDate()) : "—"}
                    </p>
                    {/* Item thumbnails */}
                    <div className="flex gap-4 pt-4">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div key={i} className="w-20 h-28 bg-surface-container overflow-hidden relative">
                          <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                          {i === 2 && order.items.length > 3 && (
                            <div className="absolute inset-0 bg-surface/50 flex items-center justify-center font-label text-xs font-bold text-on-surface">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-full md:w-auto flex flex-col items-end gap-6">
                    <div className="text-right">
                      <span className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Total Amount</span>
                      <p className="font-headline text-3xl font-bold text-on-surface">{formatPrice(order.total)}</p>
                    </div>
                    <button
                      onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                      className="w-full md:w-auto px-10 py-4 bg-on-surface text-surface font-label text-xs uppercase tracking-widest hover:bg-primary-container transition-colors duration-400 group flex items-center justify-center gap-2"
                    >
                      {expandedId === order.id ? "Hide Details" : "View Details"}
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                        {expandedId === order.id ? "expand_less" : "arrow_forward"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Expanded detail */}
                {expandedId === order.id && (
                  <div className="border-t border-outline-variant/10 bg-surface-container-low/30 p-8 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                      {/* Items */}
                      <div className="lg:col-span-2">
                        <h3 className="font-label text-[10px] uppercase tracking-[0.2em] mb-6 text-primary">Items</h3>
                        <div className="space-y-6">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-16 bg-surface-container relative overflow-hidden">
                                  <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                                </div>
                                <div>
                                  <p className="font-headline font-bold">{item.productName}</p>
                                  <p className="text-xs text-on-surface-variant/70">
                                    {item.size && `Size: ${item.size}`} {item.color && `| Color: ${item.color}`} | Qty: {item.quantity}
                                  </p>
                                </div>
                              </div>
                              <p className="font-headline font-bold">{formatPrice(item.unitPrice * item.quantity)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Summary */}
                      <div className="space-y-12 bg-surface p-8">
                        {order.shippingAddress && (
                          <div>
                            <h3 className="font-label text-[10px] uppercase tracking-[0.2em] mb-4 text-primary">Shipping Address</h3>
                            <p className="font-headline text-lg leading-relaxed">
                              {order.shippingAddress.fullName}<br />
                              {order.shippingAddress.street}<br />
                              {order.shippingAddress.city}, {order.shippingAddress.governorate}
                            </p>
                          </div>
                        )}
                        <div className="pt-8 border-t border-outline-variant/20">
                          <h3 className="font-label text-[10px] uppercase tracking-[0.2em] mb-6 text-primary">Price Breakdown</h3>
                          <div className="space-y-3 font-label text-sm">
                            <div className="flex justify-between">
                              <span className="text-on-surface-variant/70">Subtotal</span>
                              <span>{formatPrice(order.total)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-on-surface-variant/70">Shipping</span>
                              <span className="text-primary font-bold uppercase text-[10px]">Complimentary</span>
                            </div>
                            <div className="flex justify-between pt-4 border-t border-outline-variant/10">
                              <span className="font-bold text-on-surface">Total</span>
                              <span className="font-headline font-bold text-xl">{formatPrice(order.total)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {/* Support CTA */}
        <section className="mt-32 py-20 bg-surface-container-low text-center">
          <h2 className="font-headline text-3xl mb-4">Looking for something else?</h2>
          <p className="font-body text-on-surface-variant/70 mb-10 max-w-md mx-auto">Our concierge is available to assist with your order inquiries and collection styling.</p>
          <div className="flex justify-center gap-8">
            <Link href="#" className="font-label text-xs uppercase tracking-[0.2em] border-b border-primary-container pb-1 hover:text-primary-container transition-colors">Contact Atelier</Link>
            <Link href="#" className="font-label text-xs uppercase tracking-[0.2em] border-b border-primary-container pb-1 hover:text-primary-container transition-colors">Shipping FAQ</Link>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Lock, Shield, CreditCard } from "lucide-react";

// Get Paymob config from environment
const PAYMOB_IFRAME_URL = process.env.NEXT_PUBLIC_PAYMOB_IFRAME_URL || "";

export default function PaymentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentToken, setPaymentToken] = useState<string | null>(null);
  
  const items = useSelector((state: RootState) => state.cart.items);
  const shippingInfo = useSelector((state: RootState) => state.cart.shippingInfo);
  const shippingFee = useSelector((state: RootState) => state.cart.shippingFee);

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shipping = shippingFee || 250;
  const total = subtotal + shipping;

  useEffect(() => {
    if (!shippingInfo) {
      router.push("/checkout/shipping");
      return;
    }

    // Initialize Paymob payment
    const initializePayment = async () => {
      try {
        const response = await fetch("/api/paymob/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total * 100, // Paymob expects amount in cents
            currency: "EGP",
            items: items.map((item) => ({
              name: item.productName,
              amount_cents: item.unitPrice * 100,
              quantity: item.quantity,
            })),
            shipping: shippingInfo,
          }),
        });

        const data = await response.json();
        
        if (data.paymentToken) {
          setPaymentToken(data.paymentToken);
          setIsLoading(false);
        } else {
          console.error("Failed to get payment token", data);
        }
      } catch (error) {
        console.error("Payment initialization failed", error);
      }
    };

    initializePayment();
  }, [shippingInfo, items, total, shipping, router]);

  const iframeSrc = paymentToken 
    ? `${PAYMOB_IFRAME_URL}${paymentToken}`
    : "";

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-16">
      {/* Main Content */}
      <section className="flex-1">
        <header className="mb-12">
          <p className="font-sans uppercase tracking-[0.2em] text-[10px] text-[#c9a96e] mb-2">
            Step 03 — Finalize Order
          </p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-[#1a1c1b] mb-6">
            Secure Payment
          </h1>
          <div className="h-px w-full bg-[#d0c5b5]/20" />
        </header>

        {/* Payment Frame */}
        <div className="bg-white border border-[#d0c5b5]/10 p-1">
          <div className="relative aspect-[16/10] md:aspect-[21/10] w-full bg-[#f9f9f7] overflow-hidden flex flex-col items-center justify-center p-8 text-center">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="font-sans text-sm text-[#1a1c1b]/60">Initializing secure payment...</p>
              </div>
            ) : paymentToken ? (
              <iframe
                src={iframeSrc}
                className="w-full h-full absolute inset-0"
                frameBorder="0"
                allow="payment"
                title="Paymob Secure Payment"
              />
            ) : (
              <div className="max-w-md w-full">
                <div className="flex justify-center mb-6">
                  <Lock className="w-12 h-12 text-[#c9a96e]/40" />
                </div>
                <h3 className="font-serif text-xl mb-4 text-[#1a1c1b]">Paymob Secure Gateway</h3>
                <p className="text-sm text-[#5f5e5e] mb-8">
                  Your transaction is encrypted and processed securely by Paymob. We do not store your full card details.
                </p>
                {/* Fallback UI */}
                <div className="space-y-4">
                  <div className="h-12 border-b border-[#d0c5b5]/30 flex items-center px-4">
                    <span className="text-xs text-[#1a1c1b]/40 uppercase tracking-widest">Card Number</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-12 border-b border-[#d0c5b5]/30 flex-1 flex items-center px-4">
                      <span className="text-xs text-[#1a1c1b]/40 uppercase tracking-widest">Expiry</span>
                    </div>
                    <div className="h-12 border-b border-[#d0c5b5]/30 flex-1 flex items-center px-4">
                      <span className="text-xs text-[#1a1c1b]/40 uppercase tracking-widest">CVV</span>
                    </div>
                  </div>
                </div>
                <button className="mt-12 w-full bg-[#1a1c1b] text-[#f9f9f7] py-5 uppercase tracking-[0.2em] text-xs font-semibold hover:bg-[#745a27] transition-colors duration-500">
                  Complete Purchase
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Security Badges */}
        <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="flex items-center gap-2 text-[#1a1c1b]">
            <Shield className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-widest">PCI DSS Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-[#1a1c1b]">
            <Lock className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-widest">256-Bit SSL Encryption</span>
          </div>
          <div className="flex items-center gap-2 text-[#1a1c1b]">
            <CreditCard className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-widest">Fraud Protection Active</span>
          </div>
        </div>
      </section>

      {/* Order Summary Sidebar */}
      <aside className="w-full md:w-80 space-y-8">
        <div className="bg-[#f4f4f2] p-8">
          <h3 className="font-serif text-lg mb-6 border-b border-[#d0c5b5]/20 pb-4 uppercase tracking-tight text-[#1a1c1b]">
            Order Summary
          </h3>
          
          {/* Items */}
          <div className="space-y-4 mb-8">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-16 bg-[#f9f9f7] overflow-hidden">
                    <img 
                      src={item.productImage} 
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase text-[#1a1c1b]">{item.productName}</p>
                    <p className="text-[10px] text-[#5f5e5e]">{item.color} / {item.size}</p>
                  </div>
                </div>
                <p className="text-xs font-serif text-[#1a1c1b]">
                  {(item.unitPrice * item.quantity).toLocaleString()} EGP
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-2 pt-6 border-t border-[#d0c5b5]/20">
            <div className="flex justify-between text-[11px] uppercase tracking-wider text-[#5f5e5e]">
              <span>Subtotal</span>
              <span>{subtotal.toLocaleString()} EGP</span>
            </div>
            <div className="flex justify-between text-[11px] uppercase tracking-wider text-[#5f5e5e]">
              <span>Shipping</span>
              <span className="text-[#745a27]">Complimentary</span>
            </div>
            <div className="flex justify-between text-[11px] uppercase tracking-wider text-[#5f5e5e]">
              <span>Tax</span>
              <span>Included</span>
            </div>
            <div className="flex justify-between text-base font-serif mt-4 pt-4 border-t border-[#1a1c1b]/10 text-[#1a1c1b]">
              <span>Total</span>
              <span className="text-[#745a27] font-bold">{total.toLocaleString()} EGP</span>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="p-4 border border-[#c9a96e]/10 bg-[#c9a96e]/5">
          <p className="text-[10px] text-center italic text-[#745a27] font-serif">
            &ldquo;Crafting elegance, one thread at a time. Your Èlevè pieces are being prepared for their journey.&rdquo;
          </p>
        </div>
      </aside>
    </div>
  );
}

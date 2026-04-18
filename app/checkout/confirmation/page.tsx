"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { clearCart, clearShippingInfo } from "@/store/slices/cartSlice";
import { CheckCircle, Package, Mail } from "lucide-react";
import { createOrder } from "@/lib/firebase/orders";
import { clearCartInFirestore } from "@/lib/firebase/cart";
import { auth } from "@/lib/firebase/config";
import { toast } from "sonner";

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  const items = useSelector((state: RootState) => state.cart.items);
  const shippingInfo = useSelector((state: RootState) => state.cart.shippingInfo);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // Prevent multiple executions
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const paymentId = searchParams.get("id"); // Paymob transaction ID
    const success = searchParams.get("success");
    const pending = searchParams.get("pending");
    const isSuccessfulPayment = success === "true" && pending !== "true";

    if (!paymentId || !isSuccessfulPayment) {
      setPaymentError("Payment was not completed successfully. No order was created.");
      setLoading(false);
      return;
    }

    const cachedOrderId = sessionStorage.getItem(`order_for_payment_${paymentId}`);
    if (cachedOrderId) {
      setOrderId(cachedOrderId);
      setLoading(false);
      return;
    }

    // Priority: if we have payment ID + cart items, create Firestore order.
    if (paymentId && items.length > 0) {
      createOrderFromPayment(paymentId);
    } else {
      setPaymentError("Payment is successful but order data is missing. Please contact support.");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const createOrderFromPayment = async (paymentId: string) => {
    try {
      // Ensure Firebase Auth is fully initialized to avoid Permission Denied on addDoc
      await auth.authStateReady();

      const shippingFee = 250;
      const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      const total = subtotal + shippingFee;

      const orderIdCreated = await createOrder({
        userId: user?.id || "guest",
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        shippingAddress: {
          fullName: shippingInfo?.fullName || "",
          phone: shippingInfo?.phone || "",
          street: shippingInfo?.street || "",
          city: shippingInfo?.city || "",
          governorate: shippingInfo?.governorate || "",
        },
        status: "processing",
        paymentStatus: "paid",
        subtotal,
        shippingFee,
        discount: 0,
        total,
        paymobTransactionId: paymentId,
        notes: shippingInfo?.notes ?? undefined,
      });

      if (orderIdCreated) {
        sessionStorage.setItem(`order_for_payment_${paymentId}`, orderIdCreated);
        setOrderId(orderIdCreated);
        dispatch(clearCart());
        dispatch(clearShippingInfo());
        
        // Clear remote cart in Firestore
        if (user?.id) {
          await clearCartInFirestore(user.id);
        }
      }
    } catch (error) {
      console.error("Failed to create order:", error);
      toast.error("Failed to create order: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f9f7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif text-lg text-[#1a1c1b]">Processing your order...</p>
        </div>
      </div>
    );
  }

  if (paymentError) {
    return (
      <div className="min-h-screen bg-[#f9f9f7] flex items-center justify-center px-6">
        <div className="max-w-xl w-full bg-white p-8 text-center shadow-[0px_20px_40px_rgba(26,28,27,0.06)]">
          <h1 className="font-serif text-3xl text-[#1a1c1b] mb-4">Payment Not Confirmed</h1>
          <p className="text-[#5f5e5e] font-sans mb-8">{paymentError}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/checkout/payment")}
              className="px-8 py-4 bg-[#1a1c1b] text-[#f9f9f7] font-sans text-sm uppercase tracking-[0.2em] hover:bg-[#c9a96e] transition-colors"
            >
              Try Payment Again
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-4 border border-[#1a1c1b]/10 text-[#1a1c1b] font-sans text-sm uppercase tracking-[0.2em] hover:bg-[#f4f4f2] transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f7] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-[#c9a96e]/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-[#c9a96e]" />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-serif text-4xl md:text-5xl text-[#1a1c1b] mb-4">
          Order Confirmed
        </h1>
        <p className="text-[#5f5e5e] font-sans mb-8">
          Thank you for your purchase. Your order has been received and is being prepared.
        </p>

        {/* Order ID */}
        {orderId && (
          <div className="bg-white p-6 mb-8 shadow-[0px_20px_40px_rgba(26,28,27,0.04)]">
            <p className="font-sans text-[10px] uppercase tracking-widest text-[#1a1c1b]/50 mb-2">
              Order Number
            </p>
            <p className="font-serif text-2xl text-[#1a1c1b]">#{orderId.slice(-8).toUpperCase()}</p>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 text-left">
            <Package className="w-6 h-6 text-[#c9a96e] mb-4" />
            <h3 className="font-serif text-lg text-[#1a1c1b] mb-2">Order Status</h3>
            <p className="font-sans text-sm text-[#5f5e5e]">
              Your order is being processed. You will receive an email when it ships.
            </p>
          </div>
          <div className="bg-white p-6 text-left">
            <Mail className="w-6 h-6 text-[#c9a96e] mb-4" />
            <h3 className="font-serif text-lg text-[#1a1c1b] mb-2">Confirmation Email</h3>
            <p className="font-sans text-sm text-[#5f5e5e]">
              A confirmation email has been sent to your inbox.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/orders")}
            className="px-8 py-4 bg-[#1a1c1b] text-[#f9f9f7] font-sans text-sm uppercase tracking-[0.2em] hover:bg-[#c9a96e] transition-colors"
          >
            View Orders
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-8 py-4 border border-[#1a1c1b]/10 text-[#1a1c1b] font-sans text-sm uppercase tracking-[0.2em] hover:bg-[#f4f4f2] transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        {/* Quote */}
        <div className="mt-16 pt-8 border-t border-[#d0c5b5]/20">
          <p className="font-serif italic text-[#745a27] text-lg">
            &ldquo;Crafting elegance, one thread at a time.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

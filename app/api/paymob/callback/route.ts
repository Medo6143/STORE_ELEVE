import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// This handles the redirect back from Paymob after payment
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const id = searchParams.get("id"); // Paymob transaction ID
  const orderId = searchParams.get("order"); // Paymob order ID
  const pending = searchParams.get("pending");
  const success = searchParams.get("success");

  // Redirect to confirmation page with params
  const redirectUrl = new URL("/checkout/confirmation", request.url);

  if (id) redirectUrl.searchParams.set("id", id);
  if (orderId) redirectUrl.searchParams.set("order", orderId);
  if (pending) redirectUrl.searchParams.set("pending", pending);
  if (success) redirectUrl.searchParams.set("success", success);

  return NextResponse.redirect(redirectUrl);
}

// This handles POST callback from Paymob (server-to-server)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Paymob sends transaction data
    const {
      id: transactionId,
      order,
      success,
      amount_cents,
      currency,
      payment_method,
    } = body;

    if (success === "true" || success === true) {
      // Update order status in database
      // You might want to store this in a transactions collection
      await addDoc(collection(db, "transactions"), {
        paymobTransactionId: transactionId,
        paymobOrderId: order?.id,
        amount: parseInt(amount_cents) / 100,
        currency,
        paymentMethod: payment_method,
        status: "success",
        createdAt: serverTimestamp(),
      });

      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true, status: "failed" });
  } catch (error) {
    console.error("Paymob callback error:", error);
    return NextResponse.json({ error: "Failed to process callback" }, { status: 500 });
  }
}

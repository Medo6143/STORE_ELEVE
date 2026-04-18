import { NextRequest, NextResponse } from "next/server";

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY || "";
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID || "";
const PAYMOB_TEST_MODE = (process.env.PAYMOB_TEST_MODE || "true").toLowerCase() === "true";

export async function POST(request: NextRequest) {
  try {
    if (!PAYMOB_TEST_MODE) {
      return NextResponse.json(
        {
          error:
            "Payments are locked to TEST mode only. Set PAYMOB_TEST_MODE=true and use test credentials.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { amount, currency, items, shipping } = body;

    if (!PAYMOB_API_KEY || !PAYMOB_INTEGRATION_ID) {
      return NextResponse.json(
        { error: "Paymob configuration missing" },
        { status: 500 }
      );
    }

    // Step 1: Get authentication token
    const authResponse = await fetch("https://accept.paymob.com/api/auth/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: PAYMOB_API_KEY }),
    });

    const authData = await authResponse.json();
    const token = authData.token;

    if (!token) {
      return NextResponse.json(
        { error: "Failed to authenticate with Paymob" },
        { status: 500 }
      );
    }

    // Step 2: Create order
    const orderResponse = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: token,
        delivery_needed: "false",
        amount_cents: amount.toString(),
        currency,
        items: items.map((item: { name: string; amount_cents: number; quantity: number }) => ({
          name: item.name,
          amount_cents: item.amount_cents.toString(),
          description: item.name,
          quantity: item.quantity.toString(),
        })),
      }),
    });

    const orderData = await orderResponse.json();
    const orderId = orderData.id;

    if (!orderId) {
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Build redirect URLs
    const baseUrl = request.headers.get("origin") || "http://localhost:3000";
    
    // Step 3: Generate payment key
    const paymentKeyResponse = await fetch(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth_token: token,
          amount_cents: amount.toString(),
          expiration: 3600,
          order_id: orderId.toString(),
          billing_data: {
            apartment: "NA",
            email: shipping.email || "customer@example.com",
            floor: "NA",
            first_name: shipping.fullName?.split(" ")[0] || "Customer",
            street: shipping.street || "NA",
            building: "NA",
            phone_number: shipping.phone || "NA",
            shipping_method: "PKG",
            postal_code: shipping.postalCode || "NA",
            city: shipping.city || "NA",
            country: "EG",
            last_name: shipping.fullName?.split(" ").slice(1).join(" ") || "NA",
            state: shipping.governorate || "NA",
          },
          currency,
          integration_id: parseInt(PAYMOB_INTEGRATION_ID),
          lock_order_when_paid: true,
          redirection_url: `${baseUrl}/api/paymob/callback`,
        }),
      }
    );

    const paymentKeyData = await paymentKeyResponse.json();
    const paymentToken = paymentKeyData.token;

    if (!paymentToken) {
      return NextResponse.json(
        { error: "Failed to generate payment key" },
        { status: 500 }
      );
    }

    return NextResponse.json({ paymentToken, orderId });
  } catch (error) {
    console.error("Paymob initiation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

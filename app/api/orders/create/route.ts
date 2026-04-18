import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      shippingAddress,
      subtotal,
      shippingFee,
      total,
      paymobTransactionId,
      notes,
      userId,
    } = body;

    // Get user from auth header or session
    // For now, we'll accept userId from client (you may want to verify this server-side)
    const finalUserId = userId || "guest";

    // Create order document
    const orderData = {
      userId: finalUserId,
      items: items.map((item: {
        productId: string;
        productName: string;
        productImage: string;
        size: string;
        color: string;
        quantity: number;
        unitPrice: number;
      }) => ({
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        street: shippingAddress.street,
        city: shippingAddress.city,
        governorate: shippingAddress.governorate,
      },
      status: "processing", // Set to processing since payment is confirmed
      paymentStatus: "paid", // Payment confirmed via Paymob
      subtotal,
      shippingFee,
      discount: 0,
      total,
      paymobTransactionId,
      notes: notes || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const orderRef = await addDoc(collection(db, "orders"), orderData);

    return NextResponse.json({ 
      success: true, 
      orderId: orderRef.id,
      message: "Order created successfully" 
    });

  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Failed to create order", details: (error as Error).message },
      { status: 500 }
    );
  }
}

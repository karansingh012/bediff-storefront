import { NextResponse } from "next/server";
import { cashfree } from "@/lib/cashfree";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const response = await cashfree.PGFetchOrder(orderId);
    
    // Return only safe data to frontend
    return NextResponse.json({
      order_id: response.data.order_id,
      order_status: response.data.order_status,
      order_amount: response.data.order_amount,
      customer_email: response.data.customer_details?.customer_email,
    });
  } catch (error: any) {
    console.error("Order Status API Error:", error?.response?.data || error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { cashfree } from "@/lib/cashfree";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const timestamp = request.headers.get("x-webhook-timestamp");
    const signature = request.headers.get("x-webhook-signature");

    if (!timestamp || !signature) {
      return NextResponse.json(
        { error: "Missing webhook signature headers" },
        { status: 400 }
      );
    }

    try {
      cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook Error: Invalid signature` },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody);

    // Handle the event securely and idempotently
    if (event.type === "PAYMENT_SUCCESS_WEBHOOK" || event?.data?.payment?.payment_status === "SUCCESS") {
      const orderId = event.data?.order?.order_id;
      
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // We need to define this or use a generic client if we just have anon, but webhooks require service role
      );

      const { error } = await supabaseAdmin
        .from("orders")
        .update({ 
          payment_status: 'PAID',
          status: 'CONFIRMED'
        })
        .eq('order_number', orderId);

      if (error) {
        console.error(`Failed to update order status for ${orderId}:`, error);
      } else {
        console.log(`✅ Cashfree Webhook: Payment successful for Order ID: ${orderId}`);
      }
    } else {
      console.log(`Cashfree Webhook: Received unhandled event type: ${event.type || "unknown"}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

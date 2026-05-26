import { NextResponse } from "next/server";
import { z } from "zod";
import { razorpay, razorpayConfigured, publicKeyId } from "@/lib/razorpay";

const orderSchema = z.object({
  amount: z.number().int().positive().max(10_000_000), // paise
  currency: z.string().default("INR"),
  label: z.string().max(120).optional(),
});

export async function POST(request: Request) {
  if (!razorpayConfigured || !razorpay) {
    return NextResponse.json(
      { error: "Payments are not configured yet. Please get in touch to book." },
      { status: 503 },
    );
  }

  const json = await request.json().catch(() => null);
  const parsed = orderSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order request." }, { status: 422 });
  }

  const { amount, currency, label } = parsed.data;

  try {
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `rcpt_${Date.now()}`,
      notes: label ? { label } : undefined,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: publicKeyId,
    });
  } catch (err) {
    console.error("[razorpay] order error:", err);
    return NextResponse.json(
      { error: "Could not start payment. Please try again." },
      { status: 502 },
    );
  }
}

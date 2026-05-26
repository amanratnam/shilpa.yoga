import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyPaymentSignature } from "@/lib/razorpay";

const verifySchema = z.object({
  orderId: z.string().min(1),
  paymentId: z.string().min(1),
  signature: z.string().min(1),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = verifySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid verification request." }, { status: 422 });
  }

  const valid = verifyPaymentSignature(parsed.data);
  if (!valid) {
    return NextResponse.json({ error: "Payment could not be verified." }, { status: 400 });
  }

  // Scaffold: signature verified. At launch, record the booking / notify here.
  return NextResponse.json({ ok: true });
}

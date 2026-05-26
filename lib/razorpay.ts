import Razorpay from "razorpay";
import crypto from "node:crypto";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

export const razorpayConfigured = Boolean(keyId && keySecret);

/** Razorpay client, or null when keys are not configured (scaffold/dev). */
export const razorpay = razorpayConfigured
  ? new Razorpay({ key_id: keyId as string, key_secret: keySecret as string })
  : null;

/** Public key id exposed to the browser checkout. */
export const publicKeyId =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? keyId ?? "";

export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  if (!keySecret) return false;
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex");
  // Constant-time compare
  const a = Buffer.from(expected);
  const b = Buffer.from(params.signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

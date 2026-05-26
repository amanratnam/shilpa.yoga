"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";
import type { Tone } from "@/components/ui/Section";

type RazorpayInstance = { open: () => void };
type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (res: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: { ondismiss?: () => void };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadCheckout(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

type Status = "idle" | "loading" | "success" | "unconfigured" | "error";

export function RazorpayButton({
  amountInPaise,
  label,
  description,
  ctaLabel,
  tone = "light",
  fallbackHref = "/contact",
}: {
  amountInPaise: number;
  label: string;
  description?: string;
  ctaLabel?: string;
  tone?: Tone;
  fallbackHref?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const muted = tone === "dark" ? "text-brand-cream/70" : "text-brand-stone";

  async function handleClick() {
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInPaise, currency: "INR", label }),
      });

      if (res.status === 503) {
        setStatus("unconfigured");
        return;
      }
      if (!res.ok) {
        setStatus("error");
        setMessage("Could not start payment. Please try again.");
        return;
      }

      const order = (await res.json()) as {
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
      };

      const ok = await loadCheckout();
      if (!ok || !window.Razorpay) {
        setStatus("error");
        setMessage("Payment window failed to load. Please try again.");
        return;
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: siteConfig.name,
        description: description ?? label,
        order_id: order.orderId,
        theme: { color: "#1F3D2E" },
        modal: { ondismiss: () => setStatus("idle") },
        handler: async (response) => {
          const verify = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });
          if (verify.ok) {
            setStatus("success");
          } else {
            setStatus("error");
            setMessage("Payment received but could not be verified. I'll be in touch.");
          }
        },
      });
      rzp.open();
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <p className="text-small font-medium text-brand-green">
        Payment confirmed — thank you. You&apos;ll receive details by email shortly.
      </p>
    );
  }

  if (status === "unconfigured") {
    return (
      <div className="flex flex-col gap-2">
        <p className={`text-small ${muted}`}>
          Online payment opens soon. For now, reserve your place directly.
        </p>
        <Button href={fallbackHref} tone={tone} variant="secondary">
          Enquire to book
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        tone={tone}
        onClick={handleClick}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Starting…" : (ctaLabel ?? "Pay & book")}
      </Button>
      {message ? <p className={`text-small ${muted}`}>{message}</p> : null}
      <p className={`text-small ${muted}`}>
        Secure payment via Razorpay ·{" "}
        <Link href={fallbackHref} className="body-link">
          prefer to enquire first?
        </Link>
      </p>
    </div>
  );
}

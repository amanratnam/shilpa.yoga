"use client";

import { useFormStatus } from "react-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : label}
    </Button>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="flex items-center gap-1.5 text-small font-medium text-brand-ink sm:col-span-2"
    >
      <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
      {message}
    </p>
  );
}

/** Checkbox styled as a switch, matching the brand's near-square language. */
export function Toggle({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 sm:col-span-2">
      <input type="checkbox" name={name} className="peer sr-only" defaultChecked={defaultChecked} />
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full bg-brand-ink/20 transition-colors duration-300",
          "peer-checked:bg-brand-green",
          "after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-brand-white after:transition-transform after:duration-300",
          "peer-checked:after:translate-x-5",
          "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-gold",
        )}
        aria-hidden
      />
      <span className="text-small font-medium text-brand-ink">{label}</span>
    </label>
  );
}

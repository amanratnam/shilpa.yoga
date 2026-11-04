"use client";

import { useFormStatus } from "react-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending} className="min-h-11">
      {pending ? "Saving…" : label}
    </Button>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="col-span-full flex items-center gap-1.5 text-small font-medium text-brand-ink"
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
  className,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
  className?: string;
}) {
  return (
    <label className={cn("flex min-h-11 cursor-pointer items-center gap-3", className)}>
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

/**
 * Cancel / save row, pinned to the bottom of the modal's scroll area so it is
 * always in reach — on a phone the keyboard would otherwise cover it.
 */
export function FormActions({
  onCancel,
  submitLabel,
}: {
  onCancel: () => void;
  submitLabel: string;
}) {
  return (
    <div className="sticky bottom-0 col-span-full -mx-5 mt-1 flex gap-3 border-t border-brand-ink/10 bg-brand-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:-mx-6 sm:justify-end sm:px-6 sm:pb-5 [&>*]:flex-1 sm:[&>*]:flex-none">
      <Button type="button" size="sm" variant="quiet" onClick={onCancel} className="min-h-11">
        Cancel
      </Button>
      <SubmitButton label={submitLabel} />
    </div>
  );
}

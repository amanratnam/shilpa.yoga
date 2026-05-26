import { forwardRef } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-brand border bg-brand-white px-4 py-3 text-body text-brand-ink placeholder:text-brand-stone/60 transition-colors";

const fieldState = (invalid?: boolean) =>
  invalid
    ? "border-brand-ink ring-1 ring-brand-ink"
    : "border-brand-ink/15 hover:border-brand-ink/30";

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
>(function Input({ className, invalid, ...props }, ref) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(fieldBase, fieldState(invalid), className)}
      {...props}
    />
  );
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(function Textarea({ className, invalid, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(fieldBase, fieldState(invalid), "min-h-32 resize-y", className)}
      {...props}
    />
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }
>(function Select({ className, invalid, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(fieldBase, fieldState(invalid), "appearance-none pr-10", className)}
      {...props}
    >
      {children}
    </select>
  );
});

export function FormField({
  label,
  htmlFor,
  required,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={htmlFor}
        className="text-small font-medium text-brand-ink"
      >
        {label}
        {required ? <span className="text-brand-gold"> *</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p className="text-small text-brand-stone">{hint}</p>
      ) : null}
      {error ? (
        <p className="flex items-center gap-1.5 text-small font-medium text-brand-ink">
          <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
          {error}
        </p>
      ) : null}
    </div>
  );
}

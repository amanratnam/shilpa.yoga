"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Plus, X } from "lucide-react";
import { createClientAction, type ActionState } from "@/app/admin/actions";
import { FormField, Input, Select, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type PackageOption = { id: string; label: string; mode: string };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : "Save client"}
    </Button>
  );
}

export function AddClientModal({
  packages,
  genders,
  modes,
}: {
  packages: PackageOption[];
  genders: { value: string; label: string }[];
  modes: { value: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(modes[0]?.value ?? "online");
  const [state, formAction] = useActionState<ActionState, FormData>(createClientAction, {});
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape, and lock background scroll while the modal is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  // The package list depends on the chosen mode.
  const visiblePackages = packages.filter((p) => p.mode === mode);
  const errors = state.fieldErrors ?? {};

  return (
    <>
      <Button onClick={() => setOpen(true)} className="shrink-0">
        <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
        Add a new client
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-brand-ink/50 p-4 sm:p-8"
          onMouseDown={(e) => {
            if (!dialogRef.current?.contains(e.target as Node)) setOpen(false);
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-client-title"
            className="my-auto w-full max-w-2xl rounded-brand bg-brand-white p-8 shadow-[0_24px_60px_-24px_rgba(26,26,26,0.5)]"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 id="add-client-title" className="text-h3 text-brand-ink">
                  Add a new client
                </h2>
                <p className="mt-1.5 text-small text-brand-stone">
                  Packages are pulled from the live pricing on the classes pages.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-brand p-1.5 text-brand-stone transition-colors hover:bg-brand-cream hover:text-brand-ink"
              >
                <X className="h-5 w-5" strokeWidth={2} aria-hidden />
              </button>
            </div>

            <form action={formAction} className="mt-8 grid gap-5 sm:grid-cols-2">
              <FormField
                label="Full name"
                htmlFor="fullName"
                required
                error={errors.fullName}
                className="sm:col-span-2"
              >
                <Input
                  id="fullName"
                  name="fullName"
                  autoComplete="off"
                  invalid={Boolean(errors.fullName)}
                />
              </FormField>

              <FormField label="Age" htmlFor="age" required error={errors.age}>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min={1}
                  max={120}
                  invalid={Boolean(errors.age)}
                />
              </FormField>

              <FormField label="Gender" htmlFor="gender" required error={errors.gender}>
                <Select id="gender" name="gender" defaultValue="" invalid={Boolean(errors.gender)}>
                  <option value="" disabled>
                    Select…
                  </option>
                  {genders.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Yoga mode" htmlFor="yogaMode" required error={errors.yogaMode}>
                <Select
                  id="yogaMode"
                  name="yogaMode"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  invalid={Boolean(errors.yogaMode)}
                >
                  {modes.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Yoga package"
                htmlFor="yogaPackage"
                required
                error={errors.yogaPackage}
              >
                {/* Remount on mode change so the default selection resets. */}
                <Select
                  key={mode}
                  id="yogaPackage"
                  name="yogaPackage"
                  defaultValue=""
                  invalid={Boolean(errors.yogaPackage)}
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {visiblePackages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Subscription start"
                htmlFor="startDate"
                required
                error={errors.startDate}
              >
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  invalid={Boolean(errors.startDate)}
                />
              </FormField>

              <FormField
                label="Subscription end"
                htmlFor="endDate"
                required
                error={errors.endDate}
              >
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  invalid={Boolean(errors.endDate)}
                />
              </FormField>

              <FormField
                label="Notes"
                htmlFor="notes"
                hint="Injuries, goals, scheduling preferences."
                error={errors.notes}
                className="sm:col-span-2"
              >
                <Textarea id="notes" name="notes" className="min-h-24" />
              </FormField>

              <label className="flex cursor-pointer items-center gap-3 sm:col-span-2">
                <input
                  type="checkbox"
                  name="paymentDone"
                  className="peer sr-only"
                  defaultChecked={false}
                />
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
                <span className="text-small font-medium text-brand-ink">Payment done</span>
              </label>

              {state.error ? (
                <p
                  role="alert"
                  className="flex items-center gap-1.5 text-small font-medium text-brand-ink sm:col-span-2"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                  {state.error}
                </p>
              ) : null}

              <div className="mt-2 flex justify-end gap-3 sm:col-span-2">
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <SubmitButton />
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

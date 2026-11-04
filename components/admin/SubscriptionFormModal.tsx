"use client";

import { useActionState, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { saveSubscriptionAction, type ActionState } from "@/app/admin/actions";
import { FormField, Input, Select, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/admin/Modal";
import { FormActions, FormError, Toggle } from "@/components/admin/FormBits";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };
type PackageOption = { id: string; label: string; mode: string };

export type SubscriptionDefaults = {
  id: string;
  clientId: string;
  yogaMode: string;
  yogaPackage: string;
  startDate: string;
  endDate: string;
  paymentDone: boolean;
  paymentMethod: string;
  notes: string;
};

export function SubscriptionFormModal({
  clients,
  packages,
  modes,
  paymentMethods,
  defaults,
  /** Preselected and locked, when adding from a client's own page. */
  fixedClientId,
  returnTo,
  triggerLabel,
}: {
  clients: { id: string; label: string }[];
  packages: PackageOption[];
  modes: Option[];
  paymentMethods: Option[];
  defaults?: SubscriptionDefaults;
  fixedClientId?: string;
  returnTo?: string;
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(defaults?.yogaMode ?? modes[0]?.value ?? "online");
  const [state, formAction] = useActionState<ActionState, FormData>(saveSubscriptionAction, {});
  const editing = Boolean(defaults);
  const errors = state.fieldErrors ?? {};

  // The package list depends on the chosen mode.
  const forMode = packages.filter((p) => p.mode === mode);
  // A subscription may sit on a package the admin has since retired from the
  // configurator. Keep it selectable while editing that row, clearly marked,
  // so its history stays editable instead of silently changing package.
  const retired =
    defaults && mode === defaults.yogaMode && !packages.some((p) => p.id === defaults.yogaPackage)
      ? { id: defaults.yogaPackage, label: `${defaults.yogaPackage} (retired)`, mode }
      : null;
  const visiblePackages = retired ? [retired, ...forMode] : forMode;
  const noClients = clients.length === 0 && !fixedClientId;

  return (
    <>
      {editing ? (
        <Button size="sm" variant="quiet" onClick={() => setOpen(true)}>
          <Pencil className="h-4 w-4" strokeWidth={2} aria-hidden />
          {triggerLabel ?? "Edit"}
        </Button>
      ) : (
        <Button size="sm" onClick={() => setOpen(true)} className="min-h-10 shrink-0" disabled={noClients}>
          <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
          {triggerLabel ?? "Add a subscription"}
        </Button>
      )}

      {open ? (
        <Modal
          title={editing ? "Edit subscription" : "Add a subscription"}
          description="Packages and prices come from Pricing."
          onClose={() => setOpen(false)}
        >
          <form action={formAction} className="grid grid-cols-2 gap-x-3 gap-y-4">
            {editing ? <input type="hidden" name="id" value={defaults!.id} /> : null}
            {editing ? (
              <input type="hidden" name="existingPackage" value={defaults!.yogaPackage} />
            ) : null}
            {returnTo ? <input type="hidden" name="returnTo" value={returnTo} /> : null}

            {fixedClientId ? (
              <input type="hidden" name="clientId" value={fixedClientId} />
            ) : (
              <FormField
                label="Client"
                htmlFor="clientId"
                required
                error={errors.clientId}
                className="col-span-2"
              >
                <Select
                  id="clientId"
                  name="clientId"
                  compact
                  defaultValue={defaults?.clientId ?? ""}
                  invalid={Boolean(errors.clientId)}
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </FormField>
            )}

            {/* Two modes only, so a segmented switch beats a dropdown. */}
            <fieldset className="col-span-2 sm:col-span-1">
              <legend className="mb-2 text-small font-medium text-brand-ink">
                Mode<span className="text-brand-gold"> *</span>
              </legend>
              <div className="grid grid-cols-2 gap-1 rounded-brand border border-brand-ink/15 bg-brand-cream/50 p-1">
                {modes.map((m) => (
                  <label
                    key={m.value}
                    className={cn(
                      "flex min-h-9 cursor-pointer items-center justify-center rounded-[3px] px-2 text-small font-medium transition-colors",
                      mode === m.value
                        ? "bg-brand-white text-brand-green shadow-sm"
                        : "text-brand-stone hover:text-brand-ink",
                    )}
                  >
                    <input
                      type="radio"
                      name="yogaMode"
                      value={m.value}
                      checked={mode === m.value}
                      onChange={() => setMode(m.value)}
                      className="sr-only"
                    />
                    {m.label.replace(/\s*\(.*\)/, "")}
                  </label>
                ))}
              </div>
              {errors.yogaMode ? (
                <p className="mt-1.5 text-small font-medium text-brand-ink">{errors.yogaMode}</p>
              ) : null}
            </fieldset>

            <FormField
              label="Package"
              htmlFor="yogaPackage"
              required
              error={errors.yogaPackage}
              className="col-span-2 sm:col-span-1"
            >
              {/* Remount on mode change so the default selection resets. */}
              <Select
                key={mode}
                id="yogaPackage"
                name="yogaPackage"
                compact
                defaultValue={mode === defaults?.yogaMode ? defaults.yogaPackage : ""}
                invalid={Boolean(errors.yogaPackage)}
              >
                <option value="" disabled>
                  Select…
                </option>
                {visiblePackages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {/* The mode is already chosen above, so drop its prefix. */}
                    {p.label.replace(/^[^·]*·\s*/, "")}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Starts" htmlFor="startDate" required error={errors.startDate}>
              <Input
                id="startDate"
                name="startDate"
                compact
                type="date"
                defaultValue={defaults?.startDate}
                invalid={Boolean(errors.startDate)}
              />
            </FormField>

            <FormField label="Ends" htmlFor="endDate" required error={errors.endDate}>
              <Input
                id="endDate"
                name="endDate"
                compact
                type="date"
                defaultValue={defaults?.endDate}
                invalid={Boolean(errors.endDate)}
              />
            </FormField>

            <FormField
              label="Payment method"
              htmlFor="paymentMethod"
              required
              error={errors.paymentMethod}
            >
              <Select
                id="paymentMethod"
                name="paymentMethod"
                compact
                defaultValue={defaults?.paymentMethod ?? ""}
                invalid={Boolean(errors.paymentMethod)}
              >
                <option value="" disabled>
                  Select…
                </option>
                {paymentMethods.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <Toggle
              name="paymentDone"
              label="Paid"
              defaultChecked={defaults?.paymentDone}
              className="self-end"
            />

            <FormField
              label="Notes"
              htmlFor="subscriptionNotes"
              error={errors.notes}
              className="col-span-2"
            >
              <Textarea
                id="subscriptionNotes"
                name="notes"
                compact
                rows={2}
                className="min-h-16"
                placeholder="Anything specific to this package"
                defaultValue={defaults?.notes}
              />
            </FormField>

            <FormError message={state.error} />

            <FormActions
              onCancel={() => setOpen(false)}
              submitLabel={editing ? "Save changes" : "Save subscription"}
            />
          </form>
        </Modal>
      ) : null}
    </>
  );
}

"use client";

import { useActionState, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { saveSubscriptionAction, type ActionState } from "@/app/admin/actions";
import { FormField, Input, Select, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/admin/Modal";
import { FormError, SubmitButton, Toggle } from "@/components/admin/FormBits";

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
  const visiblePackages = packages.filter((p) => p.mode === mode);
  const noClients = clients.length === 0 && !fixedClientId;

  return (
    <>
      {editing ? (
        <Button variant="secondary" onClick={() => setOpen(true)}>
          <Pencil className="h-4 w-4" strokeWidth={2} aria-hidden />
          {triggerLabel ?? "Edit"}
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)} className="shrink-0" disabled={noClients}>
          <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
          {triggerLabel ?? "Add a subscription"}
        </Button>
      )}

      {open ? (
        <Modal
          title={editing ? "Edit subscription" : "Add a subscription"}
          description="Packages are pulled from the live pricing on the classes pages."
          onClose={() => setOpen(false)}
        >
          <form action={formAction} className="mt-8 grid gap-5 sm:grid-cols-2">
            {editing ? <input type="hidden" name="id" value={defaults!.id} /> : null}
            {returnTo ? <input type="hidden" name="returnTo" value={returnTo} /> : null}

            {fixedClientId ? (
              <input type="hidden" name="clientId" value={fixedClientId} />
            ) : (
              <FormField
                label="Client"
                htmlFor="clientId"
                required
                error={errors.clientId}
                hint="Only clients already in the repository can be selected."
                className="sm:col-span-2"
              >
                <Select
                  id="clientId"
                  name="clientId"
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
                defaultValue={mode === defaults?.yogaMode ? defaults.yogaPackage : ""}
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
                defaultValue={defaults?.startDate}
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
                defaultValue={defaults?.endDate}
                invalid={Boolean(errors.endDate)}
              />
            </FormField>

            <FormField
              label="Payment method"
              htmlFor="paymentMethod"
              required
              error={errors.paymentMethod}
              className="sm:col-span-2"
            >
              <Select
                id="paymentMethod"
                name="paymentMethod"
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

            <FormField
              label="Notes"
              htmlFor="subscriptionNotes"
              hint="Anything specific to this package."
              error={errors.notes}
              className="sm:col-span-2"
            >
              <Textarea
                id="subscriptionNotes"
                name="notes"
                className="min-h-24"
                defaultValue={defaults?.notes}
              />
            </FormField>

            <Toggle name="paymentDone" label="Payment done" defaultChecked={defaults?.paymentDone} />

            <FormError message={state.error} />

            <div className="mt-2 flex justify-end gap-3 sm:col-span-2">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <SubmitButton label={editing ? "Save changes" : "Save subscription"} />
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  );
}

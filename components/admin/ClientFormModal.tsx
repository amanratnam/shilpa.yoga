"use client";

import { useActionState, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { saveClientAction, type ActionState } from "@/app/admin/actions";
import { FormField, Input, Select, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/admin/Modal";
import { FormActions, FormError } from "@/components/admin/FormBits";

type Option = { value: string; label: string };

/** Existing values when editing; omitted when adding. */
export type ClientDefaults = {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  referralSource: string;
  status: string;
  notes: string;
};

export function ClientFormModal({
  genders,
  statuses,
  referralSources,
  defaults,
  triggerLabel,
}: {
  genders: Option[];
  statuses: Option[];
  referralSources: Option[];
  defaults?: ClientDefaults;
  /** Shorter button text, e.g. on the dashboard's quick actions. */
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<ActionState, FormData>(saveClientAction, {});
  const editing = Boolean(defaults);
  const errors = state.fieldErrors ?? {};

  return (
    <>
      {editing ? (
        <Button size="sm" variant="quiet" onClick={() => setOpen(true)}>
          <Pencil className="h-4 w-4" strokeWidth={2} aria-hidden />
          Edit client
        </Button>
      ) : (
        <Button size="sm" onClick={() => setOpen(true)} className="min-h-10 shrink-0">
          <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
          {triggerLabel ?? "Add a new client"}
        </Button>
      )}

      {open ? (
        <Modal
          title={editing ? "Edit client" : "Add a new client"}
          description={editing ? "Update this client's details." : "For the client list and newsletter."}
          onClose={() => setOpen(false)}
        >
          <form
            action={formAction}
            className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-4"
          >
            {editing ? <input type="hidden" name="id" value={defaults!.id} /> : null}

            {/* Phones: two columns, short fields paired. From sm: four. */}
            <FormField
              label="Full name"
              htmlFor="fullName"
              required
              error={errors.fullName}
              className="col-span-2 sm:col-span-3"
            >
              <Input
                id="fullName"
                name="fullName"
                compact
                autoComplete="off"
                autoCapitalize="words"
                defaultValue={defaults?.fullName}
                invalid={Boolean(errors.fullName)}
              />
            </FormField>

            <FormField label="Age" htmlFor="age" required error={errors.age}>
              <Input
                id="age"
                name="age"
                compact
                type="number"
                inputMode="numeric"
                min={1}
                max={120}
                defaultValue={defaults?.age}
                invalid={Boolean(errors.age)}
              />
            </FormField>

            <FormField label="Gender" htmlFor="gender" required error={errors.gender}>
              <Select
                id="gender"
                name="gender"
                compact
                defaultValue={defaults?.gender ?? ""}
                invalid={Boolean(errors.gender)}
              >
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

            <FormField
              label="Email"
              htmlFor="email"
              error={errors.email}
              className="col-span-2"
            >
              <Input
                id="email"
                name="email"
                compact
                type="email"
                inputMode="email"
                autoComplete="off"
                placeholder="For newsletters"
                defaultValue={defaults?.email}
                invalid={Boolean(errors.email)}
              />
            </FormField>

            <FormField label="Phone" htmlFor="phone" error={errors.phone}>
              <Input
                id="phone"
                name="phone"
                compact
                type="tel"
                inputMode="tel"
                autoComplete="off"
                placeholder="On receipts"
                defaultValue={defaults?.phone}
                invalid={Boolean(errors.phone)}
              />
            </FormField>

            <FormField
              label="Status"
              htmlFor="status"
              required
              error={errors.status}
              className="sm:col-span-2"
            >
              <Select
                id="status"
                name="status"
                compact
                defaultValue={defaults?.status ?? ""}
                invalid={Boolean(errors.status)}
              >
                <option value="" disabled>
                  Select…
                </option>
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField
              label="Found us via"
              htmlFor="referralSource"
              required
              error={errors.referralSource}
              className="col-span-2"
            >
              <Select
                id="referralSource"
                name="referralSource"
                compact
                defaultValue={defaults?.referralSource ?? ""}
                invalid={Boolean(errors.referralSource)}
              >
                <option value="" disabled>
                  Select…
                </option>
                {referralSources.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField
              label="Notes"
              htmlFor="notes"
              error={errors.notes}
              className="col-span-full"
            >
              <Textarea
                id="notes"
                name="notes"
                compact
                rows={3}
                className="min-h-20"
                placeholder="Injuries, goals, scheduling preferences"
                defaultValue={defaults?.notes}
              />
            </FormField>

            <FormError message={state.error} />

            <FormActions
              onCancel={() => setOpen(false)}
              submitLabel={editing ? "Save changes" : "Save client"}
            />
          </form>
        </Modal>
      ) : null}
    </>
  );
}

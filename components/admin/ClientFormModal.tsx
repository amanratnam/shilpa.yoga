"use client";

import { useActionState, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { saveClientAction, type ActionState } from "@/app/admin/actions";
import { FormField, Input, Select, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/admin/Modal";
import { FormError, SubmitButton } from "@/components/admin/FormBits";

type Option = { value: string; label: string };

/** Existing values when editing; omitted when adding. */
export type ClientDefaults = {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  email: string;
  referralSource: string;
  status: string;
  notes: string;
};

export function ClientFormModal({
  genders,
  statuses,
  referralSources,
  defaults,
}: {
  genders: Option[];
  statuses: Option[];
  referralSources: Option[];
  defaults?: ClientDefaults;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<ActionState, FormData>(saveClientAction, {});
  const editing = Boolean(defaults);
  const errors = state.fieldErrors ?? {};

  return (
    <>
      {editing ? (
        <Button variant="secondary" onClick={() => setOpen(true)}>
          <Pencil className="h-4 w-4" strokeWidth={2} aria-hidden />
          Edit client
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)} className="shrink-0">
          <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
          Add a new client
        </Button>
      )}

      {open ? (
        <Modal
          title={editing ? "Edit client" : "Add a new client"}
          description={
            editing
              ? "Update this client's details."
              : "Their details for the client repository and newsletter list."
          }
          onClose={() => setOpen(false)}
        >
          <form action={formAction} className="mt-8 grid gap-5 sm:grid-cols-2">
            {editing ? <input type="hidden" name="id" value={defaults!.id} /> : null}

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
                defaultValue={defaults?.fullName}
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
                defaultValue={defaults?.age}
                invalid={Boolean(errors.age)}
              />
            </FormField>

            <FormField label="Gender" htmlFor="gender" required error={errors.gender}>
              <Select
                id="gender"
                name="gender"
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
              hint="Optional, but needed for newsletters."
              error={errors.email}
            >
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="off"
                defaultValue={defaults?.email}
                invalid={Boolean(errors.email)}
              />
            </FormField>

            <FormField
              label="Client status"
              htmlFor="status"
              required
              error={errors.status}
            >
              <Select
                id="status"
                name="status"
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
              label="How did they find us?"
              htmlFor="referralSource"
              required
              error={errors.referralSource}
              className="sm:col-span-2"
            >
              <Select
                id="referralSource"
                name="referralSource"
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
              hint="Injuries, goals, scheduling preferences."
              error={errors.notes}
              className="sm:col-span-2"
            >
              <Textarea
                id="notes"
                name="notes"
                className="min-h-24"
                defaultValue={defaults?.notes}
              />
            </FormField>

            <FormError message={state.error} />

            <div className="mt-2 flex justify-end gap-3 sm:col-span-2">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <SubmitButton label={editing ? "Save changes" : "Save client"} />
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  );
}

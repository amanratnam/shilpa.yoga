"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle } from "lucide-react";
import { loginAction, type ActionState } from "@/app/admin/actions";
import { FormField, Input } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="mt-1 w-full" disabled={pending}>
      {pending ? "Signing in…" : "Sign in"}
    </Button>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState<ActionState, FormData>(loginAction, {});

  return (
    <form action={formAction} className="mt-7 flex flex-col gap-4">
      <input type="hidden" name="next" value={next ?? ""} />

      <FormField label="Username" htmlFor="username" required>
        <Input
          id="username"
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          compact
          required
          invalid={Boolean(state.error)}
        />
      </FormField>

      <FormField label="Password" htmlFor="password" required>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          compact
          required
          invalid={Boolean(state.error)}
        />
      </FormField>

      {state.error ? (
        <p
          role="alert"
          className="flex items-center gap-1.5 text-small font-medium text-brand-ink"
        >
          <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}

import { clientStatusLabels, type ClientStatus } from "@/lib/admin/enums";
import { subscriptionStateLabels, type SubscriptionState } from "@/lib/admin/subscriptions";
import { cn } from "@/lib/utils";

const pill =
  "inline-flex rounded-brand border px-3 py-1.5 text-eyebrow uppercase tracking-[0.1em]";

const statusTone: Record<ClientStatus, string> = {
  active: "border-brand-green/40 bg-brand-green/5 text-brand-green",
  potential: "border-brand-gold/70 bg-brand-gold/10 text-brand-stone",
  churned: "border-brand-ink/20 text-brand-stone",
};

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
  return <span className={cn(pill, statusTone[status])}>{clientStatusLabels[status]}</span>;
}

const stateTone: Record<SubscriptionState, string> = {
  current: "border-brand-green/40 bg-brand-green/5 text-brand-green",
  upcoming: "border-brand-gold/70 bg-brand-gold/10 text-brand-stone",
  expired: "border-brand-ink/20 text-brand-stone",
};

export function SubscriptionStateBadge({ state }: { state: SubscriptionState }) {
  return <span className={cn(pill, stateTone[state])}>{subscriptionStateLabels[state]}</span>;
}

export function PaymentBadge({ paid }: { paid: boolean }) {
  return (
    <span
      className={cn(
        pill,
        paid ? "border-brand-green/40 text-brand-green" : "border-brand-gold/70 text-brand-stone",
      )}
    >
      {paid ? "Paid" : "Pending"}
    </span>
  );
}

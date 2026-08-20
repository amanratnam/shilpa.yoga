import { clientStatusLabels, type ClientStatus } from "@/lib/admin/enums";
import { subscriptionStateLabels, type SubscriptionState } from "@/lib/admin/subscriptions";
import { cn } from "@/lib/utils";

/**
 * Status chips are CRM furniture, not marketing pills: sentence case, no
 * letter-spacing, and tight padding so the chip stays close to the width of
 * its own label. Anything larger reads as a button and invites a click.
 */
const chip =
  "inline-flex items-center gap-1.5 rounded-brand border px-2 py-0.5 text-[0.6875rem] font-medium leading-5 whitespace-nowrap";

const dot = "h-1.5 w-1.5 shrink-0 rounded-full";

const statusTone: Record<ClientStatus, { chip: string; dot: string }> = {
  active: { chip: "border-brand-green/25 bg-brand-green/5 text-brand-green", dot: "bg-brand-green" },
  potential: { chip: "border-brand-gold/50 bg-brand-gold/10 text-brand-stone", dot: "bg-brand-gold" },
  churned: { chip: "border-brand-ink/15 bg-brand-ink/[0.03] text-brand-stone", dot: "bg-brand-stone/50" },
};

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
  const tone = statusTone[status];
  return (
    <span className={cn(chip, tone.chip)}>
      <span className={cn(dot, tone.dot)} aria-hidden />
      {clientStatusLabels[status]}
    </span>
  );
}

const stateTone: Record<SubscriptionState, { chip: string; dot: string }> = {
  current: { chip: "border-brand-green/25 bg-brand-green/5 text-brand-green", dot: "bg-brand-green" },
  upcoming: { chip: "border-brand-gold/50 bg-brand-gold/10 text-brand-stone", dot: "bg-brand-gold" },
  expired: { chip: "border-brand-ink/15 bg-brand-ink/[0.03] text-brand-stone", dot: "bg-brand-stone/50" },
};

export function SubscriptionStateBadge({ state }: { state: SubscriptionState }) {
  const tone = stateTone[state];
  return (
    <span className={cn(chip, tone.chip)}>
      <span className={cn(dot, tone.dot)} aria-hidden />
      {subscriptionStateLabels[state]}
    </span>
  );
}

/**
 * Payment reads as plain text with a status dot rather than a second chip.
 * Two chips side by side made every table row look like a pair of controls,
 * and left nothing for the eye to rank.
 */
export function PaymentStatus({ paid }: { paid: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-small text-brand-ink whitespace-nowrap">
      <span
        className={cn(dot, paid ? "bg-brand-green" : "bg-brand-gold")}
        aria-hidden
      />
      {paid ? "Paid" : "Pending"}
    </span>
  );
}

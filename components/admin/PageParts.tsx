import Link from "next/link";
import { cn } from "@/lib/utils";

/** Title row shared by every admin screen: heading, one line of context, actions. */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-brand-ink sm:text-h2">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 text-small text-brand-stone sm:text-body">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export type ChipItem = {
  label: string;
  count: number;
  href: string;
  active: boolean;
};

/**
 * Filter chips that are plain links (`?status=…`), so a filtered view is
 * shareable, survives a refresh, and is rendered on the server. On phones the
 * row scrolls sideways rather than wrapping into a second line.
 */
export function FilterChips({ items, label }: { items: ChipItem[]; label: string }) {
  return (
    <nav
      aria-label={label}
      className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
    >
      <ul className="flex w-max gap-2">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              scroll={false}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-small font-medium transition-colors duration-200",
                item.active
                  ? "border-brand-green bg-brand-green text-brand-cream"
                  : "border-brand-ink/15 bg-brand-white text-brand-ink hover:border-brand-green/50",
              )}
            >
              {item.label}
              <span
                className={cn(
                  "min-w-6 rounded-full px-1.5 text-center text-[0.75rem] tabular-nums leading-5",
                  item.active ? "bg-brand-cream/20 text-brand-cream" : "bg-brand-cream text-brand-stone",
                )}
              >
                {item.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Dashed placeholder for an empty list or an empty filter. */
export function EmptyState({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="grid place-items-center rounded-brand border border-dashed border-brand-ink/20 bg-brand-white px-6 py-16 text-center">
      {icon}
      <h2 className="mt-4 text-h4 text-brand-ink">{title}</h2>
      {children ? <div className="mt-1.5 max-w-sm text-small text-brand-stone">{children}</div> : null}
    </div>
  );
}

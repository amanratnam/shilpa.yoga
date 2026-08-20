/** Shared date formatting for the admin views. */

export function formatDate(value: string, month: "short" | "long" = "short"): string {
  // Dates are stored as plain ISO days; pin to midnight to avoid TZ drift.
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month,
    year: "numeric",
  });
}

export function formatDateRange(start: string, end: string): string {
  return `${formatDate(start)} – ${formatDate(end)}`;
}

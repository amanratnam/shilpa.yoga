import { AlertTriangle } from "lucide-react";
import { diagnose } from "@/lib/admin/errors";

/**
 * Shown in place of a list when the database cannot be read. Rendered on the
 * server, where the real error message is still available — in production
 * Next.js strips it before it ever reaches an error boundary.
 */
export function DataProblem({ error }: { error: unknown }) {
  const { title, detail, steps } = diagnose(error);
  const technical = error instanceof Error ? error.message : String(error ?? "");

  return (
    <div className="mt-10 rounded-brand border border-brand-gold/60 bg-brand-white p-8">
      <div className="flex items-start gap-4">
        <AlertTriangle
          className="mt-0.5 h-6 w-6 shrink-0 text-brand-gold"
          strokeWidth={1.75}
          aria-hidden
        />
        <div className="min-w-0">
          <h2 className="text-h4 text-brand-ink">{title}</h2>
          <p className="mt-2 max-w-2xl text-body text-brand-stone">{detail}</p>

          <ol className="mt-5 flex list-decimal flex-col gap-2 pl-5 text-small text-brand-ink marker:text-brand-gold">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          {technical ? (
            <details className="mt-6">
              <summary className="cursor-pointer text-small font-medium text-brand-stone">
                Technical detail
              </summary>
              <pre className="mt-2 overflow-x-auto rounded-brand bg-brand-cream p-4 text-small text-brand-ink">
                {technical}
              </pre>
            </details>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/**
 * Turns raw Supabase/Postgres failures into something a non-engineer can act
 * on. Next.js strips error messages from Server Components in production, so
 * admin pages catch their own data errors and render this diagnosis inline
 * rather than letting a bare 500 through.
 */

export type Diagnosis = {
  title: string;
  detail: string;
  steps: string[];
};

/** Raised by the data layer with a message already fit to show. */
export class AdminDataError extends Error {
  constructor(
    message: string,
    readonly diagnosis: Diagnosis,
  ) {
    super(message);
    this.name = "AdminDataError";
  }
}

const RUN_MIGRATION = "Run supabase/001_schema.sql in the Supabase SQL editor.";

const SETUP_TABLES: Diagnosis = {
  title: "The database tables are missing",
  detail:
    "Supabase answered, but it has no clients/subscriptions tables — the schema has not been created yet, or an older version of it is still in place.",
  steps: [
    RUN_MIGRATION,
    "It drops and recreates both tables, so export anything you want to keep first.",
    "Then reload this page.",
  ],
};

const SETUP_COLUMNS: Diagnosis = {
  title: "The database schema is out of date",
  detail:
    "The tables exist but are missing a column this build expects, so the schema predates the current code.",
  steps: [RUN_MIGRATION, "Then reload this page."],
};

const NOT_CONFIGURED: Diagnosis = {
  title: "Supabase is not configured",
  detail: "The environment variables the admin panel needs are missing.",
  steps: [
    "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.",
    "On Vercel, add them under Project Settings → Environment Variables, then redeploy.",
  ],
};

const UNREACHABLE: Diagnosis = {
  title: "Could not reach Supabase",
  detail: "The request to the database failed before it got an answer.",
  steps: [
    "Check that SUPABASE_URL points at your project and has no typos.",
    "Confirm the Supabase project is not paused.",
  ],
};

const UNAUTHORISED: Diagnosis = {
  title: "Supabase rejected the credentials",
  detail: "The database is reachable, but the key was not accepted.",
  steps: [
    "Check SUPABASE_SERVICE_ROLE_KEY is the service_role key, not the anon key.",
    "Re-copy it from Project Settings → API, then redeploy.",
  ],
};

const UNKNOWN: Diagnosis = {
  title: "Something went wrong loading this page",
  detail: "The database returned an error that the panel did not recognise.",
  steps: ["Try reloading.", "If it keeps happening, check the Supabase logs."],
};

/** Postgres / PostgREST codes that mean "your schema isn't set up". */
const MISSING_TABLE_CODES = new Set([
  "42P01", // undefined_table
  "PGRST200", // no relationship between tables in the schema cache
  "PGRST205", // table not found in the schema cache
]);

export function diagnose(error: unknown): Diagnosis {
  if (error instanceof AdminDataError) return error.diagnosis;

  const code = typeof error === "object" && error !== null && "code" in error
    ? String((error as { code: unknown }).code)
    : "";
  // Supabase returns plain objects, not Error instances, so read `message`
  // off the object too rather than stringifying it to "[object Object]".
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message: unknown }).message)
        : String(error ?? "");

  if (message.includes("Supabase is not configured")) return NOT_CONFIGURED;
  if (MISSING_TABLE_CODES.has(code)) return SETUP_TABLES;
  if (code === "42703") return SETUP_COLUMNS;
  if (code === "PGRST301" || code === "401" || /jwt|api key/i.test(message)) return UNAUTHORISED;
  if (/fetch failed|ECONNREFUSED|ENOTFOUND|network/i.test(message)) return UNREACHABLE;

  return UNKNOWN;
}

/** Wrap a Supabase error so the page can show a useful diagnosis. */
export function dataError(error: { code?: string; message: string }, what: string): AdminDataError {
  return new AdminDataError(`${what}: ${error.message}`, diagnose(error));
}

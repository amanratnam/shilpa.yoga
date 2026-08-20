/**
 * Minimal signed-cookie sessions for the admin panel.
 *
 * The payload is not secret (it only names the logged-in admin), so it is
 * stored as base64url JSON with an appended HMAC-SHA256 signature. Web Crypto
 * is used rather than node:crypto so this module also runs inside `proxy.ts`.
 */

export const SESSION_COOKIE = "shilpa_admin_session";

/**
 * One hour, in seconds. This is an absolute lifetime measured from sign-in,
 * not an idle timeout — the session ends an hour later even if you are still
 * working. `SessionWatcher` warns shortly before that happens.
 */
export const SESSION_MAX_AGE = 60 * 60;

/** Warn the admin this many seconds before the session ends. */
export const SESSION_WARN_BEFORE = 5 * 60;

export type SessionPayload = {
  username: string;
  /** Expiry, as a Unix timestamp in seconds. */
  exp: number;
};

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set. Add it to your environment before using the admin panel.",
    );
  }
  return value;
}

const encoder = new TextEncoder();

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function key(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function sign(data: string): Promise<string> {
  const signature = await crypto.subtle.sign("HMAC", await key(), encoder.encode(data));
  return base64UrlEncode(new Uint8Array(signature));
}

/** Serialise a payload into a `<body>.<signature>` cookie value. */
export async function encodeSession(payload: SessionPayload): Promise<string> {
  const body = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  return `${body}.${await sign(body)}`;
}

/**
 * Verify a cookie value and return its payload, or `null` if the signature is
 * invalid, the value is malformed, or the session has expired.
 */
export async function decodeSession(value: string | undefined): Promise<SessionPayload | null> {
  if (!value) return null;

  const [body, signature] = value.split(".");
  if (!body || !signature) return null;

  let valid: boolean;
  try {
    valid = await crypto.subtle.verify(
      "HMAC",
      await key(),
      base64UrlDecode(signature),
      encoder.encode(body),
    );
  } catch {
    return null;
  }
  if (!valid) return null;

  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(body))) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) return null;
    if (typeof payload.username !== "string") return null;
    return payload;
  } catch {
    return null;
  }
}

/** Timing-safe string comparison, for checking submitted credentials. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const adminCredentials = {
  get username() {
    return process.env.ADMIN_USERNAME || "shilpa";
  },
  get password() {
    return process.env.ADMIN_PASSWORD || "admin";
  },
};

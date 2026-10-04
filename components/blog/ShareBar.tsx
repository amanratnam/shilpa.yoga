"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Link2, Mail, Share2 } from "lucide-react";
import {
  FacebookIcon,
  LinkedInIcon,
  WhatsAppIcon,
  XIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/** Clipboard API first; the textarea fallback covers older in-app browsers. */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy path.
  }
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Copy-link plus one-tap shares for the places people actually pass articles
 * on. Phones that support the native share sheet get that too.
 */
export function ShareBar({
  title,
  canonicalUrl,
  tone = "light",
  label = "Share this note",
  compact = false,
  className,
}: {
  title: string;
  /** Used for the server render; swapped for the live address once mounted. */
  canonicalUrl: string;
  tone?: "light" | "dark";
  label?: string | null;
  /** One row on a phone: copy plus the native share sheet where there is one. */
  compact?: boolean;
  className?: string;
}) {
  const [url, setUrl] = useState(canonicalUrl);
  const [copied, setCopied] = useState<"idle" | "copied" | "failed">("idle");
  const [canNativeShare, setCanNativeShare] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    // The page's own address, minus any #heading or query noise. Matches the
    // canonical URL in production and still works on preview deployments.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(window.location.origin + window.location.pathname);
    setCanNativeShare(typeof navigator.share === "function");
    return () => clearTimeout(resetTimer.current);
  }, []);

  const onCopy = async () => {
    const ok = await copyText(url);
    setCopied(ok ? "copied" : "failed");
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied("idle"), 2200);
  };

  const onNativeShare = async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      // Dismissing the share sheet rejects; nothing to do.
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(title);
  const targets = [
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      Icon: WhatsAppIcon,
    },
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      Icon: XIcon,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      Icon: LinkedInIcon,
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      Icon: FacebookIcon,
      // Dropped from the compact row on phones so it fits on one line.
      secondary: true,
    },
  ];

  const dark = tone === "dark";
  const iconButton = cn(
    "inline-flex h-11 min-w-11 shrink-0 items-center justify-center rounded-brand border transition-colors duration-300 ease-brand active:scale-95",
    dark
      ? "border-brand-cream/25 text-brand-cream hover:border-brand-gold hover:text-brand-gold"
      : "border-brand-ink/15 bg-brand-white text-brand-ink hover:border-brand-green hover:text-brand-green",
  );

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {label ? (
        <p
          className={cn(
            "text-eyebrow uppercase tracking-[0.1em]",
            dark ? "text-brand-gold" : "text-brand-stone",
          )}
        >
          {label}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onCopy}
          className={cn(
            "relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-brand px-5 text-small font-medium transition-colors duration-300 ease-brand active:scale-[0.98]",
            dark
              ? "bg-brand-gold text-brand-ink hover:bg-brand-cream"
              : "bg-brand-green text-brand-cream hover:bg-brand-ink",
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-2"
            >
              {copied === "copied" ? (
                <>
                    <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                    Link copied
          </>
              ) : copied === "failed" ? (
                <>
                  <Link2 className="h-4 w-4" strokeWidth={2} aria-hidden />
                  Couldn&apos;t copy
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4" strokeWidth={2} aria-hidden />
                  Copy link
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </button>

        {canNativeShare ? (
          <button
            type="button"
            onClick={onNativeShare}
            aria-label={compact ? undefined : "Share via…"}
            className={cn(iconButton, compact && "gap-2 px-4 text-small font-medium")}
          >
            <Share2 className="h-[1.1rem] w-[1.1rem]" strokeWidth={2} aria-hidden />
            {compact ? "Share" : null}
          </button>
        ) : null}

        {compact && canNativeShare ? null : (
          <>
            {targets.map(({ name, href, Icon, secondary }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Share on ${name}`}
                className={cn(iconButton, compact && secondary && "hidden sm:inline-flex")}
              >
                <Icon className="h-[1.05rem] w-[1.05rem]" />
              </a>
            ))}
            <a
              href={`mailto:?subject=${encodedText}&body=${encodeURIComponent(`${title}\n\n${url}`)}`}
              aria-label="Share by email"
              className={cn(iconButton, compact && "hidden sm:inline-flex")}
            >
              <Mail className="h-[1.1rem] w-[1.1rem]" strokeWidth={2} aria-hidden />
            </a>
          </>
        )}
      </div>
      {/* Announced to screen readers; the button label is the visual cue. */}
      <span className="sr-only" aria-live="polite">
        {copied === "copied" ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}

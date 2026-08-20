import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Tone } from "@/components/ui/Section";

type Variant = "primary" | "secondary" | "quiet";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-brand font-medium transition-colors duration-300 ease-brand disabled:pointer-events-none disabled:opacity-50";

/**
 * "md" is the marketing CTA: generous, uppercase, meant to be noticed.
 * "sm" is the admin control: compact and sentence-cased, so a dense screen
 * full of them reads as furniture rather than as a row of calls to action.
 */
const sizes: Record<Size, string> = {
  md: "px-8 py-4 text-small uppercase tracking-[0.05em]",
  sm: "px-3.5 py-2 text-small",
};

const styles: Record<"light" | "dark", Record<Variant, string>> = {
  light: {
    primary: "bg-brand-green text-brand-cream hover:bg-brand-ink",
    secondary:
      "border border-brand-green text-brand-green hover:bg-brand-green hover:text-brand-cream",
    // Neutral outline for repeated admin actions that shouldn't compete
    // with the one primary action on the screen.
    quiet:
      "border border-brand-ink/15 bg-brand-white text-brand-ink hover:border-brand-ink/30 hover:bg-brand-cream",
  },
  dark: {
    primary: "bg-brand-gold text-brand-ink hover:bg-brand-cream",
    secondary:
      "border border-brand-cream text-brand-cream hover:bg-brand-cream hover:text-brand-green",
    quiet: "border border-brand-cream/30 text-brand-cream hover:bg-brand-cream/10",
  },
};

function variantClasses(tone: Tone, variant: Variant) {
  const key = tone === "dark" ? "dark" : "light";
  return styles[key][variant];
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
  onClick?: React.MouseEventHandler;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export function Button(props: ButtonAsLink | ButtonAsButton) {
  if ("href" in props && props.href !== undefined) {
    const {
      variant = "primary",
      size = "md",
      tone = "light",
      className,
      children,
      href,
      external,
      onClick,
    } = props;
    const classes = cn(base, sizes[size], variantClasses(tone, variant), className);
    const isExternal = external || /^https?:|^mailto:|^tel:/.test(href);

    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          onClick={onClick}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const {
    variant = "primary",
    size = "md",
    tone = "light",
    className,
    children,
    ...rest
  } = props as ButtonAsButton;
  return (
    <button className={cn(base, sizes[size], variantClasses(tone, variant), className)} {...rest}>
      {children}
    </button>
  );
}

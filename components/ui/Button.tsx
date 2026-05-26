import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Tone } from "@/components/ui/Section";

type Variant = "primary" | "secondary";

const base =
  "inline-flex items-center justify-center gap-2 rounded-brand px-8 py-4 text-small font-medium uppercase tracking-[0.05em] transition-colors duration-300 ease-brand disabled:pointer-events-none disabled:opacity-50";

const styles: Record<"light" | "dark", Record<Variant, string>> = {
  light: {
    primary: "bg-brand-green text-brand-cream hover:bg-brand-ink",
    secondary:
      "border border-brand-green text-brand-green hover:bg-brand-green hover:text-brand-cream",
  },
  dark: {
    primary: "bg-brand-gold text-brand-ink hover:bg-brand-cream",
    secondary:
      "border border-brand-cream text-brand-cream hover:bg-brand-cream hover:text-brand-green",
  },
};

function variantClasses(tone: Tone, variant: Variant) {
  const key = tone === "dark" ? "dark" : "light";
  return styles[key][variant];
}

type CommonProps = {
  variant?: Variant;
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
      tone = "light",
      className,
      children,
      href,
      external,
      onClick,
    } = props;
    const classes = cn(base, variantClasses(tone, variant), className);
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

  const { variant = "primary", tone = "light", className, children, ...rest } =
    props as ButtonAsButton;
  return (
    <button className={cn(base, variantClasses(tone, variant), className)} {...rest}>
      {children}
    </button>
  );
}

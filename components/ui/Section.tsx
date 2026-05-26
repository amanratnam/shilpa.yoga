import { cn } from "@/lib/utils";

export type Tone = "light" | "dark" | "white";

type SectionProps = {
  /** Alternating band tone (Section 5). */
  tone?: Tone;
  /** Render children edge-to-edge instead of inside the content container. */
  bleed?: boolean;
  /** Remove default vertical section padding. */
  flush?: boolean;
  as?: "section" | "div" | "header" | "footer";
  id?: string;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
};

const toneClasses: Record<Tone, string> = {
  light: "bg-brand-cream text-brand-ink",
  white: "bg-brand-white text-brand-ink",
  dark: "bg-brand-green text-brand-cream on-dark",
};

export function Section({
  tone = "light",
  bleed = false,
  flush = false,
  as: Tag = "section",
  id,
  className,
  containerClassName,
  children,
}: SectionProps) {
  return (
    <Tag id={id} className={cn(toneClasses[tone], className)}>
      {bleed ? (
        children
      ) : (
        <div className={cn("container-content", !flush && "section-y", containerClassName)}>
          {children}
        </div>
      )}
    </Tag>
  );
}

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("container-content", className)}>{children}</div>;
}

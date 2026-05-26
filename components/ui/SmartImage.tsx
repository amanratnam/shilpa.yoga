import Image from "next/image";
import { ImageIcon } from "lucide-react";
import type { SiteImage } from "@/content/images";
import { cn } from "@/lib/utils";

type SmartImageProps = {
  image: SiteImage;
  /** Use inside a sized, relatively-positioned parent. */
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** For full-bleed backgrounds behind text: corner label, not centered. */
  subtle?: boolean;
};

/**
 * Renders the real photo once `image.ready` is true; until then it shows an
 * intentional branded placeholder (brand-green block with a cream label) so the
 * layout never looks broken. See content/images.ts.
 */
export function SmartImage({
  image,
  fill = false,
  sizes,
  priority,
  className,
  subtle = false,
}: SmartImageProps) {
  if (image.ready) {
    if (fill) {
      return (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes ?? "100vw"}
          priority={priority}
          className={cn("object-cover", className)}
        />
      );
    }
    return (
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        priority={priority}
        className={cn("h-auto w-full", className)}
      />
    );
  }

  if (subtle) {
    return (
      <div
        role="img"
        aria-label={image.alt}
        style={fill ? undefined : { aspectRatio: `${image.width} / ${image.height}` }}
        className={cn(
          "bg-brand-green",
          fill ? "absolute inset-0 h-full w-full" : "w-full",
          className,
        )}
      >
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 text-eyebrow uppercase tracking-[0.1em] text-brand-cream/45">
          <ImageIcon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          {image.label}
        </span>
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={image.alt}
      style={fill ? undefined : { aspectRatio: `${image.width} / ${image.height}` }}
      className={cn(
        "flex flex-col items-center justify-center gap-3 bg-brand-green p-6 text-center text-brand-cream",
        fill ? "absolute inset-0 h-full w-full" : "w-full",
        className,
      )}
    >
      <ImageIcon className="h-6 w-6 text-brand-gold" strokeWidth={1.5} aria-hidden />
      <span className="text-eyebrow uppercase tracking-[0.1em] text-brand-gold">
        Image
      </span>
      <span className="max-w-xs text-small font-medium leading-snug text-brand-cream/90">
        {image.label}
      </span>
    </div>
  );
}

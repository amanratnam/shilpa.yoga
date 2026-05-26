import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
  titleClassName,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  as?: "h1" | "h2" | "h3";
}) {
  const sizeClass =
    Tag === "h1" ? "text-h1" : Tag === "h3" ? "text-h3" : "text-h2";
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Tag className={cn(sizeClass, "max-w-3xl", titleClassName)}>{title}</Tag>
      {intro ? (
        <p
          className={cn(
            "max-w-2xl text-body opacity-80",
            align === "center" && "mx-auto",
          )}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}

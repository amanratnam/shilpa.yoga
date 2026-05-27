import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-brand bg-brand-white text-brand-ink",
        "border border-brand-ink/10 shadow-[0_1px_2px_rgba(26,26,26,0.04)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("flex flex-1 flex-col gap-3 p-7", className)}>{children}</div>;
}

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "center" | "left";
}

export function SectionHeading({
  title,
  subtitle,
  className,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <h2 className="font-serif text-[42px] font-light leading-[50.4px] tracking-normal text-ink">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-base leading-6 text-sage">{subtitle}</p>
      )}
    </div>
  );
}

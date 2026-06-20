import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn("min-h-screen bg-cream", className)}>{children}</div>
  );
}

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[1280px] px-4 md:px-16", className)}>
      {children}
    </div>
  );
}

interface TextLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function TextLink({ href, children, className }: TextLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 border-b border-ink pb-1 text-[13px] font-medium uppercase tracking-[1.3px] text-ink transition-colors hover:text-forest",
        className,
      )}
    >
      {children}
    </Link>
  );
}

interface PillButtonProps {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
}

export function PillButton({
  href,
  children,
  variant = "outline",
  className,
}: PillButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-[11px] font-medium uppercase tracking-[1.1px] transition-colors sm:px-8 sm:py-4 sm:text-[13px] sm:tracking-[1.3px]",
    variant === "primary" && "bg-forest text-cream hover:bg-forest/90",
    variant === "outline" &&
      "border border-border bg-cream/90 text-ink backdrop-blur-sm hover:bg-cream",
    variant === "ghost" &&
      "border border-border px-6 py-2 text-[11px] tracking-[1.1px] hover:bg-cream-dark",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={styles}>
      {children}
    </button>
  );
}

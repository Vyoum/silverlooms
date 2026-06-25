import Image from "next/image";
import Link from "next/link";
import {
  BRAND_LOGO_HEIGHT,
  BRAND_LOGO_PATH,
  BRAND_LOGO_WIDTH,
  BRAND_NAME,
  BRAND_TAGLINE,
} from "@/lib/constants/brand";
import { cn } from "@/lib/utils";

const sizeWidths = {
  sm: 150,
  md: 210,
  lg: 280,
} as const;

interface BrandLogoProps {
  className?: string;
  nameClassName?: string;
  href?: string | null;
  size?: keyof typeof sizeWidths;
  priority?: boolean;
  showName?: boolean;
}

export function BrandLogo({
  className,
  nameClassName,
  href = "/",
  size = "md",
  priority = false,
  showName = false,
}: BrandLogoProps) {
  const width = sizeWidths[size];
  const height = Math.round((BRAND_LOGO_HEIGHT / BRAND_LOGO_WIDTH) * width);

  const content = (
    <>
      <Image
        src={BRAND_LOGO_PATH}
        alt={showName ? "" : `${BRAND_NAME} — ${BRAND_TAGLINE}`}
        width={width}
        height={height}
        priority={priority}
        aria-hidden={showName}
        className={cn("h-auto object-contain", !showName && className)}
        style={{ width, height: "auto" }}
      />
      {showName ? (
        <span
          className={cn(
            "font-serif text-[11px] font-medium uppercase tracking-[0.22em] text-ink",
            nameClassName,
          )}
        >
          {BRAND_NAME}
        </span>
      ) : null}
    </>
  );

  const wrapperClassName = cn(
    showName ? "inline-flex flex-col items-center gap-1" : "inline-flex shrink-0",
    showName && className,
  );

  if (href) {
    return (
      <Link href={href} className={wrapperClassName} aria-label={BRAND_NAME}>
        {content}
      </Link>
    );
  }

  return <div className={wrapperClassName}>{content}</div>;
}

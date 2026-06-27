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
  sm: 64,
  md: 84,
  lg: 118,
} as const;

interface BrandLogoProps {
  className?: string;
  nameClassName?: string;
  taglineClassName?: string;
  href?: string | null;
  size?: keyof typeof sizeWidths;
  priority?: boolean;
  showName?: boolean;
  showTagline?: boolean;
}

export function BrandLogo({
  className,
  nameClassName,
  taglineClassName,
  href = "/",
  size = "md",
  priority = false,
  showName = false,
  showTagline = false,
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
            "font-serif text-[10px] font-medium uppercase tracking-[0.2em] text-ink",
            nameClassName,
          )}
        >
          {BRAND_NAME}
        </span>
      ) : null}
      {showTagline ? (
        <span
          className={cn(
            "font-serif text-xs italic tracking-wide text-sage",
            taglineClassName,
          )}
        >
          {BRAND_TAGLINE}
        </span>
      ) : null}
    </>
  );

  const wrapperClassName = cn(
    showName || showTagline
      ? "inline-flex flex-col items-center gap-1"
      : "inline-flex shrink-0",
    (showName || showTagline) && className,
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

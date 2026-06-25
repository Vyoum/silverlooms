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

const sizeHeights = {
  sm: 44,
  md: 54,
  lg: 72,
} as const;

interface BrandLogoProps {
  className?: string;
  nameClassName?: string;
  href?: string | null;
  size?: keyof typeof sizeHeights;
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
  const height = sizeHeights[size];
  const width = Math.round((BRAND_LOGO_WIDTH / BRAND_LOGO_HEIGHT) * height);

  const content = (
    <>
      <Image
        src={BRAND_LOGO_PATH}
        alt={showName ? "" : `${BRAND_NAME} — ${BRAND_TAGLINE}`}
        width={width}
        height={height}
        priority={priority}
        aria-hidden={showName}
        className={cn("h-auto w-auto object-contain", !showName && className)}
        style={{ height, width: "auto", maxWidth: width }}
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

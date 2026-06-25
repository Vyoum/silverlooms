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
  sm: 36,
  md: 48,
  lg: 64,
} as const;

interface BrandLogoProps {
  className?: string;
  href?: string | null;
  size?: keyof typeof sizeHeights;
  priority?: boolean;
}

export function BrandLogo({
  className,
  href = "/",
  size = "md",
  priority = false,
}: BrandLogoProps) {
  const height = sizeHeights[size];
  const width = Math.round((BRAND_LOGO_WIDTH / BRAND_LOGO_HEIGHT) * height);

  const image = (
    <Image
      src={BRAND_LOGO_PATH}
      alt={`${BRAND_NAME} — ${BRAND_TAGLINE}`}
      width={width}
      height={height}
      priority={priority}
      className={cn("h-auto w-auto object-contain", className)}
      style={{ height, width: "auto", maxWidth: width }}
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0" aria-label={BRAND_NAME}>
        {image}
      </Link>
    );
  }

  return image;
}

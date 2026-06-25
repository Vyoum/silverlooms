import Link from "next/link";
import { Mail, Share2 } from "lucide-react";
import { Container } from "@/components/layout/page-shell";

const exploreLinks = [
  "Sustainability",
  "Shipping & Returns",
  "Privacy Policy",
  "Store Locator",
];

export function JewelleryFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#1a1816] pt-20 pb-10">
      <Container>
        <div className="flex flex-col justify-between gap-12 border-b border-white/5 pb-16 md:flex-row">
          <div className="max-w-md">
            <Link href="/" className="font-serif text-[42px] font-light text-gold">
              Silver Looms
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-cream-dark/70">
              Elevating Jaipur&apos;s artisanal heritage through contemporary,
              minimalist design. Join our newsletter for private collections.
            </p>
            <div className="mt-4 flex gap-4 text-cream-dark">
              <Share2 className="size-5" />
              <Mail className="size-5" />
            </div>
          </div>
          <div>
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[1.1px] text-cream">
              Explore
            </p>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-cream-dark/70 transition-colors hover:text-cream"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="pt-8 text-xs text-cream-dark/50">
          © 2026 Silver Looms. Crafted in Jaipur.
        </p>
      </Container>
    </footer>
  );
}

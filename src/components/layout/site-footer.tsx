import Link from "next/link";
import { ArrowRight, Share2 } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { footerLinks } from "@/lib/constants/navigation";
import { Container } from "./page-shell";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-ink text-cream-light">
      <Container className="py-16">
        <div className="grid gap-12 border-b border-border pb-16 md:grid-cols-2">
          <div>
            <BrandLogo
              size="lg"
              showName
              href="/"
              nameClassName="text-gold text-sm tracking-[0.28em]"
            />
            <p className="mt-3 font-serif text-xl italic tracking-wide text-muted-light">
              Woven in tradition, dressed in silver.
            </p>
          </div>
          <div>
            <p className="mb-6 text-[11px] uppercase tracking-[2.2px] text-muted-light">
              Join Our Inner Circle
            </p>
            <div className="flex items-center border-b border-muted-light pb-2">
              <Input
                type="email"
                placeholder="Email Address"
                className="border-0 bg-transparent px-0 text-cream-light placeholder:text-muted-light/50 focus-visible:ring-0"
              />
              <button type="button" aria-label="Subscribe">
                <ArrowRight className="size-4 text-muted-light" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["Shop", footerLinks.shop],
              ["Help", footerLinks.help],
              ["Company", footerLinks.company],
            ] as const
          ).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-8 text-[11px] uppercase tracking-[2.2px] text-gold">
                {title}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-cream-light transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4 className="mb-8 text-[11px] uppercase tracking-[2.2px] text-gold">
              Social
            </h4>
            <div className="flex gap-6">
              <Share2 className="size-5 text-cream-light" aria-label="Social links" />
            </div>
          </div>
        </div>

        <Separator className="bg-border" />

        <div className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <p className="text-[11px] uppercase tracking-[1.1px] text-muted-light">
            © 2026 Silver Looms. All Rights Reserved.
          </p>
          <div className="flex gap-4 text-[11px] uppercase tracking-wider text-muted-light">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>UPI</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

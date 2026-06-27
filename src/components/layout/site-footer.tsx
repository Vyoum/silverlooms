import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { INSTAGRAM_URL } from "@/lib/constants/brand";
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
              showTagline
              href="/"
              className="items-start"
              nameClassName="text-gold text-sm tracking-[0.28em]"
              taglineClassName="text-muted-light"
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
            <div className="flex items-center gap-4">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Silver Looms on Instagram"
                className="inline-flex items-center gap-2 text-cream-light transition-colors hover:text-gold"
              >
                <InstagramIcon />
                <span className="text-[13px]">@silverlooms_2026</span>
              </a>
            </div>
          </div>
        </div>

        <Separator className="bg-border" />

        <div className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <p className="text-[11px] uppercase tracking-[1.1px] text-muted-light">
            © 2026 Silver Looms. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] uppercase tracking-wider text-muted-light">
            <Link href="/privacy" className="transition-colors hover:text-gold">
              Privacy
            </Link>
            <Link href="/shipping-returns" className="transition-colors hover:text-gold">
              Shipping
            </Link>
            <span aria-hidden>·</span>
            <span>Visa</span>
            <span>Mastercard</span>
            <span>UPI</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

import Link from "next/link";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Container } from "@/components/layout/page-shell";

export function KurtisFooter() {
  return (
    <footer className="border-t border-border bg-ink py-16 text-cream-light">
      <Container>
        <div className="grid gap-12 md:grid-cols-2">
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
            <p className="mt-4 font-serif text-xl italic text-muted-light">
              Woven in tradition, dressed in silver.
            </p>
          </div>
          <div>
            <h4 className="mb-6 text-[11px] uppercase tracking-[2.2px] text-gold">
              Links
            </h4>
            <ul className="space-y-3 text-[13px]">
              <li>
                <Link href="#" className="hover:text-gold">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gold">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gold">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gold">
                  Store Locator
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-12 border-t border-border pt-8 text-[11px] uppercase tracking-wider text-muted-light">
          © 2026 Silver Looms. Crafted in Jaipur.
        </p>
      </Container>
    </footer>
  );
}

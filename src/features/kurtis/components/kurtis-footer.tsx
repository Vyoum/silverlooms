import Link from "next/link";
import { Container } from "@/components/layout/page-shell";

export function KurtisFooter() {
  return (
    <footer className="border-t border-border bg-ink py-16 text-cream-light">
      <Container>
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="font-serif text-4xl font-light leading-tight text-gold">
              SILVER
              <br />
              LOOMS
            </p>
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
          © 2024 Silver Looms. Crafted in Jaipur.
        </p>
      </Container>
    </footer>
  );
}

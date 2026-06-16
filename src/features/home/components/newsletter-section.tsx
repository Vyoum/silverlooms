import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/page-shell";

export function NewsletterSection() {
  return (
    <section className="bg-forest-light py-20">
      <Container className="flex flex-col items-center text-center">
        <h2 className="font-serif text-[38px] font-light tracking-wide text-cream-warm">
          First to know, first to style
        </h2>
        <p className="mt-3 text-sm text-cream-warm/80">
          Join 12,000+ women who discover new arrivals first
        </p>
        <form className="mt-8 flex w-full max-w-md flex-col gap-4 sm:flex-row">
          <Input
            type="email"
            placeholder="Your email address"
            className="h-12 flex-1 rounded-full border-0 bg-cream-warm px-6 text-ink placeholder:text-sage/60"
          />
          <Button
            type="submit"
            className="h-12 rounded-full bg-gold px-8 text-[13px] uppercase tracking-[1.3px] text-ink hover:bg-gold/90"
          >
            Subscribe
          </Button>
        </form>
      </Container>
    </section>
  );
}

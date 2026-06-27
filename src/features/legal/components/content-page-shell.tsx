import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container, PageShell } from "@/components/layout/page-shell";

interface ContentPageShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function ContentPageShell({
  title,
  description,
  children,
}: ContentPageShellProps) {
  return (
    <PageShell>
      <SiteHeader />
      <main>
        <Container className="max-w-3xl py-16 md:py-24">
          <p className="text-[11px] uppercase tracking-[2.2px] text-sage">Silver Looms</p>
          <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">{title}</h1>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-sage">{description}</p>
          ) : null}
          <div className="mt-10 space-y-8 text-sm leading-relaxed text-sage md:text-base">
            {children}
          </div>
        </Container>
      </main>
      <SiteFooter />
    </PageShell>
  );
}

function Section({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="font-serif text-2xl text-ink">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function ContentSection({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <Section title={title} id={id}>
      {children}
    </Section>
  );
}

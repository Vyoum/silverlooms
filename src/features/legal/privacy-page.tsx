import Link from "next/link";
import {
  ContentPageShell,
  ContentSection,
} from "@/features/legal/components/content-page-shell";
import { BRAND_NAME, INSTAGRAM_URL } from "@/lib/constants/brand";

export function PrivacyPage() {
  return (
    <ContentPageShell
      title="Privacy Policy"
      description="How Silver Looms collects, uses, and protects your information when you shop with us."
    >
      <p className="text-xs uppercase tracking-wider text-sage/80">
        Last updated: June 2026
      </p>

      <ContentSection title="Overview">
        <p>
          {BRAND_NAME} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates{" "}
          <Link href="/" className="text-ink underline-offset-2 hover:underline">
            silverlooms.in
          </Link>
          . This policy explains what personal data we collect, why we collect it, and
          how you can contact us about your information.
        </p>
      </ContentSection>

      <ContentSection title="Information we collect">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-ink">Account details</strong> — name, email address,
            and profile information when you sign in with Google or email.
          </li>
          <li>
            <strong className="text-ink">Order details</strong> — shipping address,
            phone number, items purchased, and payment confirmation references.
          </li>
          <li>
            <strong className="text-ink">Usage data</strong> — pages visited, device type,
            and general site interaction to improve our storefront.
          </li>
          <li>
            <strong className="text-ink">Communications</strong> — messages you send us
            via email or Instagram, and marketing preferences if you subscribe to our
            newsletter.
          </li>
        </ul>
      </ContentSection>

      <ContentSection title="How we use your information">
        <ul className="list-disc space-y-2 pl-5">
          <li>Process and deliver your orders, including shipment tracking updates.</li>
          <li>Provide customer support and respond to your enquiries.</li>
          <li>Maintain your account, wishlist, and order history.</li>
          <li>Send service emails related to your purchases or account security.</li>
          <li>Improve our website, products, and shopping experience.</li>
          <li>Comply with applicable laws and prevent fraud or misuse.</li>
        </ul>
      </ContentSection>

      <ContentSection title="Payment & shipping partners">
        <p>
          Payments are processed securely through Razorpay. We do not store your full
          card or UPI credentials on our servers. Shipping and delivery are handled
          through our logistics partners, including Delhivery. These providers receive
          only the information needed to complete your transaction or deliver your
          order.
        </p>
      </ContentSection>

      <ContentSection title="Authentication">
        <p>
          If you choose Google sign-in, authentication is handled by Supabase and Google
          according to their respective privacy policies. We receive your name and email
          address to create and manage your {BRAND_NAME} account.
        </p>
      </ContentSection>

      <ContentSection title="Cookies & local storage">
        <p>
          We use cookies and browser storage to keep you signed in, remember your cart
          and wishlist, and maintain essential site functionality. You can control
          cookies through your browser settings, though some features may not work
          correctly if cookies are disabled.
        </p>
      </ContentSection>

      <ContentSection title="Data retention">
        <p>
          We retain order and account information for as long as needed to fulfil
          orders, provide support, meet legal obligations, and resolve disputes. You may
          request deletion of your account by contacting us, subject to records we must
          keep for tax or legal compliance.
        </p>
      </ContentSection>

      <ContentSection title="Your rights">
        <p>
          You may request access to, correction of, or deletion of your personal data.
          You may also opt out of marketing communications at any time. To make a
          request, contact us using the details below.
        </p>
      </ContentSection>

      <ContentSection title="Contact us" id="contact">
        <p>
          For privacy-related questions, reach us on{" "}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline-offset-2 hover:underline"
          >
            Instagram @silverlooms_2026
          </a>{" "}
          or email us at{" "}
          <a
            href="mailto:hello@silverlooms.in"
            className="text-ink underline-offset-2 hover:underline"
          >
            hello@silverlooms.in
          </a>
          .
        </p>
      </ContentSection>

      <ContentSection title="Terms of use" id="terms">
        <p>
          By using our website, you agree to shop in good faith, provide accurate order
          information, and use our content and products only for lawful personal purposes.
          We reserve the right to refuse service, cancel orders, or update these policies
          when necessary. Continued use of the site after changes are posted constitutes
          acceptance of the updated policy.
        </p>
      </ContentSection>
    </ContentPageShell>
  );
}

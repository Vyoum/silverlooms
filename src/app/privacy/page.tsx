import { PrivacyPage } from "@/features/legal/privacy-page";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "Read how Silver Looms collects, uses, and protects your personal information when you shop with us.",
  path: "/privacy",
});

export default function Page() {
  return <PrivacyPage />;
}

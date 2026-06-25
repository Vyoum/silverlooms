import type { Metadata } from "next";
import { DM_Sans, EB_Garamond } from "next/font/google";
import { AuthSessionSync } from "@/features/auth/components/auth-session-sync";
import { AppProviders } from "@/components/providers/app-providers";
import { BRAND_LOGO_PATH } from "@/lib/constants/brand";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Silver Looms | The Art of Wearing India",
  description:
    "Discover artisanal apparel and exquisite silver jewellery. Woven in tradition, dressed in silver.",
  icons: {
    icon: BRAND_LOGO_PATH,
    apple: BRAND_LOGO_PATH,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${ebGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AuthSessionSync />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Onest, Unbounded } from "next/font/google";
import SampleBanner from "@/components/SampleBanner";
import "./globals.css";

const unbounded = Unbounded({ variable: "--font-unbounded", subsets: ["latin"], weight: "800" });
const onest = Onest({ variable: "--font-onest", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "Express Wash · 24/7 laundry in Novaliches, Quezon City",
  description:
    "Open 24 hours in Novaliches, Quezon City. Wash, dry and fold by the load, self-service machines, and free pickup and delivery.",
};

export const viewport: Viewport = { themeColor: "#eef0ec" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: only covers attributes on <html> itself (e.g. classes added by extensions).
    <html lang="en" className={`${unbounded.variable} ${onest.variable}`} suppressHydrationWarning>
      <body>
        <SampleBanner />
        {children}
      </body>
    </html>
  );
}

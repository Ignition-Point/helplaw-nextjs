import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});


export const metadata: Metadata = {
  title: {
    default: "Help Law Group | Mass Tort & Class Action Attorneys",
    template: "%s | Help Law Group",
  },
  description:
    "Connecting individuals affected by mass torts, class actions, and data breaches with experienced legal representation. Free case review available.",
  metadataBase: new URL("https://helplaw.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Help Law Group",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyMobileCTA />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}

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
    images: [
      {
        url: "/assets/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Help Law Group — Mass Tort & Class Action Attorneys",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/assets/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Help Law Group",
              url: "https://helplaw.com",
              logo: "https://helplaw.com/assets/og-default.jpg",
              description:
                "Help Law Group connects survivors of abuse, unsafe products, and institutional harm with experienced mass tort and class action attorneys.",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "1-800-HELP-LAW",
                contactType: "customer service",
                areaServed: "US",
                availableLanguage: "English",
              },
              sameAs: [],
            }),
          }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyMobileCTA />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}

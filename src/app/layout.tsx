import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DummAir - Verifiable Dummy Flight Tickets",
  description: "Get verifiable dummy flight tickets for visa applications, proof of travel, or documentation purposes. Fast, reliable, and professional service.",
  keywords: "dummy flight tickets, fake flight tickets, visa application, travel documentation, flight booking",
  authors: [{ name: "DummAir" }],
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/DummAir Logo Design.png', type: 'image/png' },
    ],
    shortcut: '/DummAir Logo Design.png',
    apple: '/DummAir Logo Design.png',
  },
  openGraph: {
    title: "DummAir - Verifiable Dummy Flight Tickets",
    description: "Get verifiable dummy flight tickets for visa applications, proof of travel, or documentation purposes.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: '/DummAir Logo Design.png',
        width: 1200,
        height: 630,
        alt: 'DummAir Logo',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DummAir - Verifiable Dummy Flight Tickets",
    description: "Get verifiable dummy flight tickets for visa applications, proof of travel, or documentation purposes.",
    images: ['/DummAir Logo Design.png'],
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/DummAir Logo Design.png" type="image/png" />
        <link rel="shortcut icon" href="/DummAir Logo Design.png" type="image/png" />
        <link rel="apple-touch-icon" href="/DummAir Logo Design.png" />
      </head>
      <body className={inter.className}>
        <Suspense fallback={<div></div>}>
          <AnalyticsTracker>
            {children}
          </AnalyticsTracker>
        </Suspense>
      </body>
    </html>
  );
}
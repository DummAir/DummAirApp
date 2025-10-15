import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DummAir - Verifiable Dummy Flight Tickets",
  description: "Get verifiable dummy flight tickets for visa applications, proof of travel, or documentation purposes. Fast, reliable, and professional service.",
  keywords: "dummy flight tickets, fake flight tickets, visa application, travel documentation, flight booking",
  authors: [{ name: "DummAir" }],
  openGraph: {
    title: "DummAir - Verifiable Dummy Flight Tickets",
    description: "Get verifiable dummy flight tickets for visa applications, proof of travel, or documentation purposes.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: '/icon.png',
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
    images: ['/icon.png'],
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
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
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
  },
  twitter: {
    card: "summary_large_image",
    title: "DummAir - Verifiable Dummy Flight Tickets",
    description: "Get verifiable dummy flight tickets for visa applications, proof of travel, or documentation purposes.",
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
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
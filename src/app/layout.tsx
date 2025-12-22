import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// 1. THIS IS THE SEO BLOCK
export const metadata: Metadata = {
  title: "Cacao. Tea. Coffee. | Ottawa Scout Guide",
  description: "A curated guide to the capital's best roasters, quietest tea rooms, and richest chocolate.",
  openGraph: {
    title: "Cacao. Tea. Coffee. | Ottawa Scout Guide",
    description: "Don't just get coffee. Find the perfect spot for deep work, date nights, or quiet reading in Ottawa.",
    url: "https://cacao-tea-coffee-xlij.vercel.app/",
    siteName: "Cacao Tea Coffee",
    images: [
      {
        url: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1200&auto=format&fit=crop", // A beautiful coffee shop banner
        width: 1200,
        height: 630,
        alt: "Coffee Shop Vibes",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cacao. Tea. Coffee. | Ottawa Scout Guide",
    description: "A curated guide to Ottawa's best spots.",
    images: ["https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1200&auto=format&fit=crop"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
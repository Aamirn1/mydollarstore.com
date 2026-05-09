import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "My Dollar Store — Premium Drones at Unbeatable Prices",
  description:
    "🚁 Shop professional camera drones, racing quads & beginner flyers from just PKR 199. Free shipping on orders over PKR 15,000. 30-day easy returns. Expert 24/7 support. Elevate your perspective today!",
  keywords: [
    "drones", "camera drones", "racing drones", "FPV drones", "mini drones",
    "affordable drones", "drone store", "buy drones online", "cheap drones",
    "professional drones", "beginner drones", "drone deals", "quadcopter",
  ],
  authors: [{ name: "My Dollar Store" }],
  creator: "My Dollar Store",
  publisher: "My Dollar Store",
  metadataBase: new URL("https://mydollarstore.com"),
  icons: {
    icon: "/logo.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "My Dollar Store — Elevate Your Perspective 🚁",
    description:
      "Professional drones starting from just PKR 199. Camera drones, racing quads & mini flyers with free shipping over PKR 15,000. 30-day returns. Shop now!",
    type: "website",
    url: "https://mydollarstore.com",
    siteName: "My Dollar Store",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "My Dollar Store — Premium Drones at Unbeatable Prices",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Dollar Store — Premium Drones from PKR 199 🚁",
    description:
      "Camera drones, racing quads & mini flyers. Free shipping over PKR 15,000. 30-day returns. Elevate your perspective!",
    images: ["/og-image.png"],
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${orbitron.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

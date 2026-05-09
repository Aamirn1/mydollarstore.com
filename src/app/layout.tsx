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
  title: "My Dollar Store - Premium Drones at Unbeatable Prices",
  description: "Your one-stop shop for camera drones, racing drones, beginner drones, and mini drones. Quality tech at dollar store prices.",
  keywords: ["drones", "camera drones", "racing drones", "FPV", "mini drones", "affordable drones", "drone store"],
  authors: [{ name: "My Dollar Store" }],
  icons: {
    icon: "/logo.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "My Dollar Store - Premium Drones",
    description: "Quality tech at unbeatable prices. Shop camera, racing, and mini drones.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Dollar Store - Premium Drones",
    description: "Quality tech at unbeatable prices.",
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

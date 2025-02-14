import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "Bedtime Stories Generator",
  description: "Generate unique, personalized bedtime stories for children. AI-powered storytelling that creates magical moments for your family.",
  keywords: ["bedtime stories", "children stories", "AI storytelling", "personalized stories", "kids stories"],
  authors: [{ name: "Bedtime Stories Team" }],
  creator: "Bedtime Stories Team",
  publisher: "Bedtime Stories",
  openGraph: {
    title: "Bedtime Stories Generator",
    description: "Create magical bedtime stories for your children with AI",
    url: "https://bedtime-stories.vercel.app",
    siteName: "Bedtime Stories Generator",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bedtime Stories Generator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bedtime Stories Generator",
    description: "Create magical bedtime stories for your children with AI",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
    },
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
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body 
        className="antialiased"
        suppressHydrationWarning
      >
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

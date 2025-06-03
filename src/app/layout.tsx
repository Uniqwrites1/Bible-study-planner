import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bible Study Plan - Read the Bible in Your Chosen Duration | Uniqwrites",
  description: "Create a personalized Bible study plan to read through the entire Bible in your chosen timeframe with balanced daily readings across all sections: History, Psalms, Wisdom, Prophets, New Testament, and Revelation. Built by Uniqwrites.",
  keywords: ["Bible study", "Bible reading plan", "Christian devotion", "Scripture", "Daily Bible reading", "Uniqwrites"],
  authors: [{ name: "Uniqwrites", url: "https://uniqwrites.com" }],
  creator: "Uniqwrites",
  publisher: "Uniqwrites",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

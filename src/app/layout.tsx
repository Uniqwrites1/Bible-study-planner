import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/contexts/ThemeContext';

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
  publisher: "Uniqwrites",  icons: {
    icon: [
      { url: '/icons/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/icons/icon-512x512.svg', sizes: '512x512', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.svg',
    apple: [
      { url: '/icons/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' }
    ]
  },
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Bible Study Plan'
  },
  formatDetection: {
    telephone: false
  },  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Bible Study Plan',
    'msapplication-TileColor': '#3b82f6',
    'msapplication-TileImage': '/icons/icon-192x192.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-300`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
        
        {/* Service Worker Registration Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('SW registered: ', registration);
                  }, function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

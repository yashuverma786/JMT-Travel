import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PopupManager from "@/components/popup-manager"
import type { Metadata } from "next"
import SessionProviderWrapper from "@/components/session-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://jmttravel.com"),
  title: {
    default: "JMT Travel - Holiday Packages & Travel Booking",
    template: "%s | JMT Travel",
  },
  description:
    "Book holiday packages, hotels, flights and more with JMT Travel. Best deals on domestic and international travel with 50,000+ happy travelers.",
  keywords: [
    "travel packages",
    "holiday booking",
    "domestic travel",
    "international travel",
    "tour packages",
    "vacation deals",
  ],
  authors: [{ name: "JMT Travel" }],
  creator: "JMT Travel",
  publisher: "JMT Travel",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jmttravel.com",
    title: "JMT Travel - Holiday Packages & Travel Booking",
    description:
      "Book holiday packages, hotels, flights and more with JMT Travel. Best deals on domestic and international travel.",
    siteName: "JMT Travel",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "JMT Travel - Holiday Packages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JMT Travel - Holiday Packages & Travel Booking",
    description:
      "Book holiday packages, hotels, flights and more with JMT Travel. Best deals on domestic and international travel.",
    images: ["/og-image.jpg"],
    creator: "@jmttravel",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="canonical" href="https://jmttravel.com" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <SessionProviderWrapper>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <PopupManager />
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}

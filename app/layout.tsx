import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import PopupManager from "@/components/popup-manager"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "JMT Travel - Holiday Packages & Travel Booking",
  description:
    "Book holiday packages, hotels, flights and more with JMT Travel. Best deals on domestic and international travel.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <PopupManager />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

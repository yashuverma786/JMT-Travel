"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, Mail, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Destinations", href: "/destinations" },
  { name: "Trips", href: "/trips" },
  { name: "Trip Types", href: "/trip-types" },
  { name: "Activities", href: "/activities" },
  { name: "Hotels", href: "/hotels" },
  { name: "Transfers", href: "/transfers" },
  { name: "Blog", href: "/blog" },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-40">
      {/* Top bar */}
      <div className="bg-blue-600 text-white py-2 text-sm">
        <div className="container flex justify-between items-center px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span className="text-xs sm:text-sm">+91-9312540202</span>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span className="text-xs sm:text-sm">support@jmttravel.com</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="flex items-center gap-1 hover:underline text-xs sm:text-sm">
              <User className="h-3 w-3" />
              <span>Login/Register</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center">
          <span className="text-xl sm:text-2xl font-bold text-blue-600">JMT Travel</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-blue-600 relative group py-2",
                pathname === item.href ? "text-blue-600" : "text-gray-700",
              )}
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden min-h-[44px] min-w-[44px]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden border-t bg-white transition-all duration-300 ease-in-out overflow-hidden",
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="container py-4 space-y-2 px-4 sm:px-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "block px-3 py-3 text-base font-medium transition-colors hover:text-blue-600 rounded-md min-h-[44px] flex items-center",
                pathname === item.href ? "text-blue-600 bg-blue-50" : "text-gray-700",
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 border-t">
            <Link
              href="/login"
              className="flex items-center gap-2 px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 rounded-md min-h-[44px]"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="h-4 w-4" />
              Login/Register
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, Search, X, Phone, Mail } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-blue-600 text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              <span>+91 9876543210</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              <span>info@jmttravel.com</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>Best Travel Experience Since 2010</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">JMT</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">JMT Travel</h1>
              <p className="text-xs text-gray-600">Your Journey Matters</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/destinations" className="text-gray-700 hover:text-blue-600 transition-colors">
              Destinations
            </Link>
            <Link href="/holidays" className="text-gray-700 hover:text-blue-600 transition-colors">
              Holidays
            </Link>
            <Link href="/trip-types" className="text-gray-700 hover:text-blue-600 transition-colors">
              Trip Types
            </Link>
            <Link href="/hotels" className="text-gray-700 hover:text-blue-600 transition-colors">
              Hotels
            </Link>
            <Link href="/transfers" className="text-gray-700 hover:text-blue-600 transition-colors">
              Transfers
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 transition-colors">
              Blog
            </Link>
          </nav>

          {/* Search and Menu buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={toggleSearch} className="text-gray-700 hover:text-blue-600">
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="lg:hidden text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <Link href="/customize-tour">
              <Button className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700">Customize Tour</Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Input type="text" placeholder="Search destinations, packages, hotels..." className="flex-1" />
              <Button className="bg-blue-600 hover:bg-blue-700">Search</Button>
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 p-4 bg-gray-50 rounded-lg">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link href="/destinations" className="text-gray-700 hover:text-blue-600 transition-colors">
                Destinations
              </Link>
              <Link href="/holidays" className="text-gray-700 hover:text-blue-600 transition-colors">
                Holidays
              </Link>
              <Link href="/trip-types" className="text-gray-700 hover:text-blue-600 transition-colors">
                Trip Types
              </Link>
              <Link href="/hotels" className="text-gray-700 hover:text-blue-600 transition-colors">
                Hotels
              </Link>
              <Link href="/transfers" className="text-gray-700 hover:text-blue-600 transition-colors">
                Transfers
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-blue-600 transition-colors">
                Blog
              </Link>
              <Link href="/customize-tour">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Customize Tour</Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

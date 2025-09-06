import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">JMT</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">JMT Travel</h3>
                <p className="text-sm text-gray-400">Your Journey Matters</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Creating unforgettable travel experiences since 2010. We specialize in customized tours, luxury
              accommodations, and seamless travel arrangements.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-500 cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-pink-500 cursor-pointer" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="text-gray-400 hover:text-white transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/holidays" className="text-gray-400 hover:text-white transition-colors">
                  Holiday Packages
                </Link>
              </li>
              <li>
                <Link href="/trip-types" className="text-gray-400 hover:text-white transition-colors">
                  Trip Types
                </Link>
              </li>
              <li>
                <Link href="/hotels" className="text-gray-400 hover:text-white transition-colors">
                  Hotels
                </Link>
              </li>
              <li>
                <Link href="/transfers" className="text-gray-400 hover:text-white transition-colors">
                  Transfers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Travel Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/customize-tour" className="text-gray-400 hover:text-white transition-colors">
                  Custom Tours
                </Link>
              </li>
              <li>
                <Link href="/trip-types/honeymoon" className="text-gray-400 hover:text-white transition-colors">
                  Honeymoon Packages
                </Link>
              </li>
              <li>
                <Link href="/trip-types/family" className="text-gray-400 hover:text-white transition-colors">
                  Family Vacations
                </Link>
              </li>
              <li>
                <Link href="/trip-types/adventure" className="text-gray-400 hover:text-white transition-colors">
                  Adventure Tours
                </Link>
              </li>
              <li>
                <Link href="/trip-types/luxury" className="text-gray-400 hover:text-white transition-colors">
                  Luxury Travel
                </Link>
              </li>
              <li>
                <Link href="/trip-types/spiritual" className="text-gray-400 hover:text-white transition-colors">
                  Spiritual Tours
                </Link>
              </li>
              <li>
                <Link href="/rentals" className="text-gray-400 hover:text-white transition-colors">
                  Car Rentals
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-gray-400">123 Travel Street</p>
                  <p className="text-gray-400">New Delhi, India 110001</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-gray-400">+91 9876543210</p>
                  <p className="text-gray-400">+91 9876543211</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-gray-400">info@jmttravel.com</p>
                  <p className="text-gray-400">support@jmttravel.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 JMT Travel. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">JMT Travel</h3>
            <p className="text-gray-300 mb-4">
              Your trusted travel partner for amazing holiday experiences across India and beyond.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/holidays" className="hover:text-white">
                  Holiday Packages
                </Link>
              </li>
              <li>
                <Link href="/hotels" className="hover:text-white">
                  Hotels
                </Link>
              </li>
              <li>
                <Link href="/flights" className="hover:text-white">
                  Flights
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Destinations</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/destinations/goa" className="hover:text-white">
                  Goa
                </Link>
              </li>
              <li>
                <Link href="/destinations/kerala" className="hover:text-white">
                  Kerala
                </Link>
              </li>
              <li>
                <Link href="/destinations/rajasthan" className="hover:text-white">
                  Rajasthan
                </Link>
              </li>
              <li>
                <Link href="/destinations/himachal" className="hover:text-white">
                  Himachal
                </Link>
              </li>
              <li>
                <Link href="/destinations/kashmir" className="hover:text-white">
                  Kashmir
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91-9312540202</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@jmttravel.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1" />
                <span>D-22 Ground Floor, Sector 3, Noida 201301, UP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 JMT Travel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

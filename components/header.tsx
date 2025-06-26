import Link from "next/link"

const Header = () => {
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Destinations", href: "/destinations" },
    { name: "Holidays", href: "/holidays" },
    { name: "Hotels", href: "/hotels" },
    { name: "Transfers", href: "/transfers" },
    { name: "Activities", href: "/activities" },
    { name: "Blog", href: "/blog" },
  ]

  return (
    <header className="bg-gray-100 py-4">
      <div className="container mx-auto">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Travel App
          </Link>
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="hover:text-gray-500">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header

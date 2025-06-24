"use client"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"

export function AdminNavbar() {
  const router = useRouter()

  const handleLogout = () => {
    // Clear auth cookie
    document.cookie = "jmt_admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    // Clear localStorage
    localStorage.removeItem("jmt_admin_user")

    // Redirect to login
    router.replace("/admin")
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">JMT Travel Admin</h2>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>Trip.jmt</span>
          </div>

          <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

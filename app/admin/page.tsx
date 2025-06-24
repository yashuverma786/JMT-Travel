"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { PERMISSIONS, ROLES_PERMISSIONS, type PermissionValue } from "@/lib/permissions" // Ensure this path is correct

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const authCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jmt_admin_auth="))
      ?.split("=")[1]

    if (authCookie === "true") {
      router.replace("/admin/dashboard")
    } else {
      setCheckingAuth(false)
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (username === "Trip.jmt" && password === "QAZqaz#JMT0202") {
      document.cookie = "jmt_admin_auth=true; path=/; max-age=86400" // 24 hours

      const userRole = "admin" // Or "super_admin" based on your actual logic

      // Get permissions based on role, default to all if role not in ROLES_PERMISSIONS or for super_admin
      let userPermissions: PermissionValue[] = []
      if (userRole === "super_admin") {
        userPermissions = Object.values(PERMISSIONS) as PermissionValue[]
      } else {
        userPermissions = (ROLES_PERMISSIONS[userRole] || Object.values(PERMISSIONS)) as PermissionValue[]
      }

      localStorage.setItem(
        "jmt_admin_user", // Correct key
        JSON.stringify({
          username: "Trip.jmt",
          role: userRole,
          permissions: userPermissions,
        }),
      )
      router.replace("/admin/dashboard")
    } else {
      setError("Invalid credentials")
    }
    setLoading(false)
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">JMT Travel Admin</CardTitle>
          <CardDescription className="text-center">Sign in to access admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">{error}</div>}
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Trip.jmt"
                disabled={loading}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="QAZqaz#JMT0202"
                  disabled={loading}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
            <p className="font-medium text-blue-900">Test Credentials:</p>
            <p className="text-blue-800">Username: Trip.jmt</p>
            <p className="text-blue-800">Password: QAZqaz#JMT0202</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

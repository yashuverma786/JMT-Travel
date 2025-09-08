"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield, User, Lock } from "lucide-react"
import { useAdmin } from "@/components/admin/admin-context"

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@jmttravel.com")
  const [password, setPassword] = useState("QAZqaz#JMT0202")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [adminCreated, setAdminCreated] = useState(false)

  const { login, user } = useAdmin()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/admin/dashboard")
    }
  }, [user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const success = await login(email, password)
      if (!success) {
        setError("Invalid credentials. Please check your email and password.")
      }
    } catch (error) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const createAdminUser = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/seed-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok) {
        setAdminCreated(true)
        setEmail("admin@jmttravel.com")
        setPassword("QAZqaz#JMT0202")
        setError("")
      } else {
        setError(data.message || "Failed to create admin user")
      }
    } catch (error) {
      setError("Failed to create admin user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">JMT Travel Admin</CardTitle>
          <CardDescription>Sign in to access the JMT Travel admin dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {adminCreated && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                Admin user created successfully! You can now login with the credentials below.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center">
            <Button
              type="button"
              variant="outline"
              onClick={createAdminUser}
              disabled={loading}
              className="w-full bg-transparent"
            >
              {loading ? "Creating..." : "Create Admin User"}
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>Default Credentials:</p>
            <p>Email: admin@jmttravel.com</p>
            <p>Password: QAZqaz#JMT0202</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

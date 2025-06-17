"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Facebook, Mail } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Redirect to home page after login
    router.push("/")
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Redirect to home page after registration
    router.push("/")
  }

  return (
    <div className="container py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Login to your JMT Travel account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="Enter your email" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="password">
                      Password
                    </label>
                    <Input id="password" type="password" placeholder="Enter your password" required />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </label>
                    </div>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" type="button">
                    <Facebook className="mr-2 h-4 w-4" />
                    Facebook
                  </Button>
                  <Button variant="outline" type="button">
                    <Mail className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="register">
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>Sign up for a JMT Travel account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="first-name">
                        First Name
                      </label>
                      <Input id="first-name" placeholder="First name" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="last-name">
                        Last Name
                      </label>
                      <Input id="last-name" placeholder="Last name" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="Enter your email" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="password">
                      Password
                    </label>
                    <Input id="password" type="password" placeholder="Create a password" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="confirm-password">
                      Confirm Password
                    </label>
                    <Input id="confirm-password" type="password" placeholder="Confirm your password" required />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        terms and conditions
                      </Link>
                    </label>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
          <CardFooter className="flex justify-center border-t p-6">
            <p className="text-sm text-center text-muted-foreground">
              By continuing, you agree to JMT Travel's{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

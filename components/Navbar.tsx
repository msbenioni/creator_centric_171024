"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useAuth } from "@/hooks/useAuth"

export function Navbar() {
  const { setTheme, theme } = useTheme()
  const { user, logout } = useAuth()

  return (
    <nav className="border-b">
      <div className="container mx-auto flex justify-between items-center py-4">
        <Link href="/" className="text-2xl font-bold gradient-text">
          CreatorHub
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/creators">
            <Button variant="ghost">Discover Creators</Button>
          </Link>
          {user && (
            <>
              <Link href="/wishlist">
                <Button variant="ghost">My Wishlist</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            </>
          )}
          {user ? (
            <Button variant="outline" onClick={logout}>Logout</Button>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="default">Sign Up</Button>
              </Link>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}
"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, X, LogOut } from "lucide-react"
import { supabase } from '@/lib/supabaseClient'
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Get initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">
          DanceFestHub
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-white hover:text-primary">
            Festivals
          </Link>
          <Link href="/add-event" className="text-white hover:text-primary">
            Add Event
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata.avatar_url || "/placeholder.svg?height=32&width=32"} alt={user.user_metadata.full_name || "User"} />
                  <AvatarFallback>{(user.user_metadata.full_name || "User").charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-white">{user.user_metadata.full_name || user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-white">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/auth">
              <Button className="bg-primary hover:bg-primary/90">Login</Button>
            </Link>
          )}
        </nav>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background z-50 border-b border-border shadow-lg">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link href="/" className="py-2 text-white hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                Festivals
              </Link>
              <Link
                href="/add-event"
                className="py-2 text-white hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Add Event
              </Link>
              {user ? (
                <div className="flex flex-col gap-4 py-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata.avatar_url || "/placeholder.svg?height=32&width=32"} alt={user.user_metadata.full_name || "User"} />
                      <AvatarFallback>{(user.user_metadata.full_name || "User").charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-white">{user.user_metadata.full_name || user.email}</span>
                  </div>
                  <Button variant="outline" onClick={handleLogout} className="text-white">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/auth" className="py-2" onClick={() => setIsMenuOpen(false)}>
                  <Button className="bg-primary hover:bg-primary/90">Login</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}


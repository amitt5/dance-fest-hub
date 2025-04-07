"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Facebook, Instagram } from "lucide-react"
import { supabase } from '../../lib/supabaseClient'

export default function AuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (provider: "facebook" | "google") => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: provider === 'facebook' ? 'email,public_profile' : undefined
        }
      })

      if (error) throw error

      // The redirect will happen automatically
    } catch (error) {
      console.error('Error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login to DanceFestHub</CardTitle>
          <CardDescription>Connect with your social media account to continue</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            className="w-full h-12 bg-[#3b5998] hover:bg-[#324b81]"
            onClick={() => handleLogin("facebook")}
            disabled={isLoading}
          >
            <Facebook className="mr-2 h-5 w-5" />
            Continue with Facebook
          </Button>

          <Button
            className="w-full h-12 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90"
            onClick={() => handleLogin("google")}
            disabled={isLoading}
          >
            <Instagram className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>

          {isLoading && (
            <div className="text-center py-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Connecting...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


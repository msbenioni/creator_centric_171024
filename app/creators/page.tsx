"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

interface Creator {
  id: number;
  name: string;
  email: string;
}

export default function Creators() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCreators()
  }, [])

  const fetchCreators = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/creators')
      if (!response.ok) {
        throw new Error('Failed to fetch creators')
      }
      const data = await response.json()
      setCreators(data)
      setError(null)
    } catch (error) {
      console.error('Error fetching creators:', error)
      setError('Failed to load creators. Please try again later.')
      toast({
        title: "Error",
        description: "Failed to load creators. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Discover Creators</h1>
        {isLoading ? (
          <p>Loading creators...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creators.map((creator) => (
              <Link href={`/creators/${creator.id}`} key={creator.id}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${creator.email}`} alt={creator.name} />
                        <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div>{creator.name}</div>
                        <div className="text-sm text-muted-foreground">{creator.email}</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Check out {creator.name.split(' ')[0]}'s content!</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
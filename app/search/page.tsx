"use client"

import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

// Placeholder data for creators
const mockCreators = [
  { id: 1, name: "Alice Johnson", handle: "@alice_creates", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Bob Smith", handle: "@bob_vlogs", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Carol Davis", handle: "@carol_music", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "David Brown", handle: "@david_tech", avatar: "https://i.pravatar.cc/150?img=4" },
  { id: 5, name: "Eva White", handle: "@eva_fashion", avatar: "https://i.pravatar.cc/150?img=5" },
]

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState(mockCreators)

  const handleSearch = () => {
    // Placeholder: Implement actual search logic
    const filteredResults = mockCreators.filter(creator =>
      creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.handle.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setSearchResults(filteredResults)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Discover Creators</h1>
        <div className="flex space-x-2 mb-8">
          <Input
            type="text"
            placeholder="Search creators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((creator) => (
            <Link href={`/creators/${creator.id}`} key={creator.id}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={creator.avatar} alt={creator.name} />
                      <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div>{creator.name}</div>
                      <div className="text-sm text-muted-foreground">{creator.handle}</div>
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
      </main>
      <Footer />
    </div>
  )
}
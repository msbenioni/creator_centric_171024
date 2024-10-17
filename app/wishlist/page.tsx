"use client"

import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrashIcon } from "lucide-react"

// Mock data (replace with actual data fetching in a real application)
const initialWishlist = [
  { id: 1, product: "Camera Lens", link: "https://example.com/product1", creator: "Alice Johnson" },
  { id: 2, product: "Tripod", link: "https://example.com/product2", creator: "Bob Smith" },
  { id: 3, product: "Travel Backpack", link: "https://example.com/product4", creator: "Carol Davis" },
]

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(initialWishlist)

  const handleRemoveFromWishlist = (id: number) => {
    setWishlist(wishlist.filter(item => item.id !== id))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
        {wishlist.length === 0 ? (
          <p>Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlist.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.product}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">Recommended by: {item.creator}</p>
                  <div className="flex justify-between items-center">
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      View Product
                    </a>
                    <Button variant="destructive" size="sm" onClick={() => handleRemoveFromWishlist(item.id)}>
                      <TrashIcon className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
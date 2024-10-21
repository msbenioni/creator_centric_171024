"use client"

import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InstagramIcon, FacebookIcon, YoutubeIcon, LinkIcon, HeartIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Mock data (replace with actual data fetching in a real application)
const creator = {
  id: 1,
  name: "Alice Johnson",
  handle: "@alice_creates",
  avatar: "https://i.pravatar.cc/150?img=1",
  bio: "Digital content creator passionate about lifestyle, travel, and photography.",
}

const socialMediaContent = [
  { platform: "Instagram", icon: InstagramIcon, posts: [
    { id: 1, image: "https://source.unsplash.com/random/400x400?sig=1", likes: 1200, comments: 45, affiliateLink: "https://example.com/product1", affiliateProduct: "Camera Lens" },
    { id: 2, image: "https://source.unsplash.com/random/400x400?sig=2", likes: 980, comments: 32, affiliateLink: "https://example.com/product2", affiliateProduct: "Tripod" },
    { id: 3, image: "https://source.unsplash.com/random/400x400?sig=3", likes: 1500, comments: 60, affiliateLink: "https://example.com/product3", affiliateProduct: "Camera Bag" },
  ]},
  { platform: "Facebook", icon: FacebookIcon, posts: [
    { id: 1, image: "https://source.unsplash.com/random/400x400?sig=4", likes: 500, comments: 20, affiliateLink: "https://example.com/product4", affiliateProduct: "Travel Backpack" },
    { id: 2, image: "https://source.unsplash.com/random/400x400?sig=5", likes: 750, comments: 25, affiliateLink: "https://example.com/product5", affiliateProduct: "Portable Charger" },
  ]},
  { platform: "YouTube", icon: YoutubeIcon, posts: [
    { id: 1, thumbnail: "https://source.unsplash.com/random/400x225?sig=6", views: 10000, likes: 800, affiliateLink: "https://example.com/product6", affiliateProduct: "Microphone" },
    { id: 2, thumbnail: "https://source.unsplash.com/random/400x225?sig=7", views: 15000, likes: 1200, affiliateLink: "https://example.com/product7", affiliateProduct: "Ring Light" },
  ]},
]

export default function CreatorProfile({ params }: { params: { id: string } }) {
  const [following, setFollowing] = useState(false)

  const handleFollow = () => {
    setFollowing(!following)
    toast({
      title: following ? "Unfollowed" : "Followed",
      description: following ? `You have unfollowed ${creator.name}` : `You are now following ${creator.name}`,
    })
  }

  const handleAddToWishlist = (product: string, link: string) => {
    // TODO: Implement actual wishlist functionality
    console.log(`Added ${product} to wishlist: ${link}`)
    toast({
      title: "Added to Wishlist",
      description: `${product} has been added to your wishlist`,
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={creator.avatar} alt={creator.name} />
                <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl">{creator.name}</CardTitle>
                <p className="text-muted-foreground">{creator.handle}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{creator.bio}</p>
            <Button onClick={handleFollow}>
              {following ? "Unfollow" : "Follow"}
            </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="Instagram">
          <TabsList className="mb-4">
            {socialMediaContent.map((platform) => (
              <TabsTrigger key={platform.platform} value={platform.platform}>
                <platform.icon className="w-5 h-5 mr-2" />
                {platform.platform}
              </TabsTrigger>
            ))}
          </TabsList>
          {socialMediaContent.map((platform) => (
            <TabsContent key={platform.platform} value={platform.platform}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {platform.posts.map((post) => (
                  <Card key={post.id}>
                    <img
                      src={post.image || post.thumbnail}
                      alt={`${platform.platform} post`}
                      className="w-full h-64 object-cover"
                    />
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        {post.likes && `${post.likes} likes`}
                        {post.views && `${post.views} views`}
                        {post.comments && ` • ${post.comments} comments`}
                      </p>
                      <div className="flex justify-between items-center">
                        <a href={post.affiliateLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
                          <LinkIcon className="w-4 h-4 mr-1" />
                          {post.affiliateProduct}
                        </a>
                        <Button variant="outline" size="sm" onClick={() => handleAddToWishlist(post.affiliateProduct, post.affiliateLink)}>
                          <HeartIcon className="w-4 h-4 mr-1" />
                          Add to Wishlist
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
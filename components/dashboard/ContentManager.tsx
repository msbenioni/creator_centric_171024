import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InstagramIcon, FacebookIcon, YoutubeIcon, LinkIcon } from "lucide-react"
import { TikTokIcon } from "@/components/icons/TikTokIcon"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

const platforms = [
  { name: "Instagram", icon: InstagramIcon, connected: false },
  { name: "Facebook", icon: FacebookIcon, connected: false },
  { name: "YouTube", icon: YoutubeIcon, connected: false },
  { name: "TikTok", icon: TikTokIcon, connected: false },
]

interface ContentManagerProps {
  subscriptionStatus: string | null;
}

export function ContentManager({ subscriptionStatus }: ContentManagerProps) {
  const [productName, setProductName] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [connectedPlatforms, setConnectedPlatforms] = useState(platforms)
  const router = useRouter()

  useEffect(() => {
    // Placeholder: Fetch connected platforms
    // This would typically involve an API call to get the user's connected platforms
    setConnectedPlatforms(platforms.map(p => ({ ...p, connected: Math.random() > 0.5 })))
  }, [])

  const handleConnectPlatform = async (platform: string) => {
    try {
      const response = await fetch(`/api/oauth/${platform.toLowerCase()}`)
      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error)
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${platform}. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleAddAffiliateLink = async () => {
    if (subscriptionStatus !== 'active' && subscriptionStatus !== 'trialing') {
      toast({
        title: "Subscription Required",
        description: "An active subscription is required to add affiliate links.",
        variant: "destructive",
      })
      router.push('/dashboard?tab=subscription')
      return
    }

    try {
      const response = await fetch('/api/affiliate-links', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productName, linkUrl }),
      })

      if (!response.ok) {
        throw new Error('Failed to add affiliate link')
      }

      toast({
        title: "Success",
        description: "Affiliate link added successfully.",
      })
      setProductName("")
      setLinkUrl("")
    } catch (error) {
      console.error('Error adding affiliate link:', error)
      toast({
        title: "Error",
        description: "Failed to add affiliate link. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Connect Platforms</h3>
          {connectedPlatforms.map((platform) => (
            <div key={platform.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <platform.icon className="w-6 h-6" />
                <span>{platform.name}</span>
              </div>
              <Button
                variant={platform.connected ? "outline" : "default"}
                onClick={() => handleConnectPlatform(platform.name)}
              >
                {platform.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Add Affiliate Link</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
              />
            </div>
            <div>
              <Label htmlFor="linkUrl">Affiliate Link URL</Label>
              <Input
                id="linkUrl"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Enter affiliate link URL"
              />
            </div>
            <Button onClick={handleAddAffiliateLink} disabled={!productName || !linkUrl}>
              <LinkIcon className="w-4 h-4 mr-2" />
              Add Affiliate Link
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
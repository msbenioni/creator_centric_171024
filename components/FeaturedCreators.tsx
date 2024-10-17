import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

const creators = [
  { id: 1, name: "Alice Johnson", handle: "@alice_creates", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Bob Smith", handle: "@bob_vlogs", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Carol Davis", handle: "@carol_music", avatar: "https://i.pravatar.cc/150?img=3" },
]

export function FeaturedCreators() {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold mb-8 text-center neon-text neon-blue">Featured Creators</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {creators.map((creator) => (
          <Link href={`/creators/${creator.id}`} key={creator.id}>
            <Card className="hover:neon-border hover:neon-purple transition-all duration-300">
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
                <p>Check out {creator.name.split(' ')[0]}'s latest content!</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
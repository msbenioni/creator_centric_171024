import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ProfileOverview() {
  const [name, setName] = useState("Alice Johnson")
  const [bio, setBio] = useState("Digital content creator passionate about lifestyle, travel, and photography.")
  const [avatar, setAvatar] = useState("https://i.pravatar.cc/150?img=1")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement profile update logic
    console.log("Profile updated:", { name, bio })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button variant="outline">Change Avatar</Button>
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
            />
          </div>
          <Button type="submit">Update Profile</Button>
        </form>
      </CardContent>
    </Card>
  )
}
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export function Hero() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-5xl font-bold mb-4 gradient-text">
        Connect. Create. Inspire.
      </h1>
      <p className="text-xl mb-8 max-w-2xl mx-auto">
        Showcase your content from TikTok, Facebook, Instagram, and YouTube all in one place.
      </p>
      <Link href="/auth/signup">
        <Button size="lg" className="neon-border neon-green">
          Get Started
        </Button>
      </Link>
    </div>
  )
}
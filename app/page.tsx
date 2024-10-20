import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { FeaturedCreators } from "@/components/FeaturedCreators"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4">
        <Hero />
        <FeaturedCreators />
      </main>
      <Footer />
    </div>
  )
}
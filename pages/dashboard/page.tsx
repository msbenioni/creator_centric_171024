"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { ProfileOverview } from "@/components/dashboard/ProfileOverview"
import { ContentManager } from "@/components/dashboard/ContentManager"
import { Analytics } from "@/components/dashboard/Analytics"
import { SubscriptionManager } from "@/components/dashboard/SubscriptionManager"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "@/components/ui/use-toast"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("profile")
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchSubscriptionStatus()
    }
  }, [user])

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/subscription-status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data = await response.json()
      setSubscriptionStatus(data.status)
    } catch (error) {
      console.error('Error fetching subscription status:', error)
      toast({
        title: "Error",
        description: "Failed to fetch subscription status",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8 flex">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-grow ml-8">
          {activeTab === "profile" && <ProfileOverview />}
          {activeTab === "content" && <ContentManager subscriptionStatus={subscriptionStatus} />}
          {activeTab === "analytics" && <Analytics subscriptionStatus={subscriptionStatus} />}
          {activeTab === "subscription" && <SubscriptionManager subscriptionStatus={subscriptionStatus} />}
        </main>
      </div>
      <Footer />
    </div>
  )
}
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "@/components/ui/use-toast"

interface SubscriptionManagerProps {
  subscriptionStatus: string | null;
}

export function SubscriptionManager({ subscriptionStatus }: SubscriptionManagerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const handleManageSubscription = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error creating portal session:', error)
      toast({
        title: "Error",
        description: "Failed to open subscription management portal",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartSubscription = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const { sessionId } = await response.json()
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      await stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error('Error creating checkout session:', error)
      toast({
        title: "Error",
        description: "Failed to start subscription process",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Current Status: {subscriptionStatus || 'Free'}</p>
        {subscriptionStatus === 'active' || subscriptionStatus === 'trialing' ? (
          <Button onClick={handleManageSubscription} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Manage Subscription'}
          </Button>
        ) : (
          <Button onClick={handleStartSubscription} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Start Subscription'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
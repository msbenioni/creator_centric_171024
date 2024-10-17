import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

// Placeholder data for analytics
const mockData = [
  { name: 'Jan', followers: 400, likes: 2400, clicks: 240 },
  { name: 'Feb', followers: 300, likes: 1398, clicks: 139 },
  { name: 'Mar', followers: 200, likes: 9800, clicks: 980 },
  { name: 'Apr', followers: 278, likes: 3908, clicks: 390 },
  { name: 'May', followers: 189, likes: 4800, clicks: 480 },
  { name: 'Jun', followers: 239, likes: 3800, clicks: 380 },
]

interface AnalyticsProps {
  subscriptionStatus: string | null;
}

export function Analytics({ subscriptionStatus }: AnalyticsProps) {
  const router = useRouter()
  const [analyticsData, setAnalyticsData] = useState(mockData)

  useEffect(() => {
    // Placeholder: Fetch real analytics data
    // This would typically involve an API call to get the user's analytics
    setAnalyticsData(mockData)
  }, [])

  if (subscriptionStatus !== 'active' && subscriptionStatus !== 'trialing') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Upgrade to a paid subscription to access detailed analytics.</p>
          <Button onClick={() => router.push('/dashboard?tab=subscription')}>
            Upgrade Subscription
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={analyticsData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="followers" fill="#8884d8" />
            <Bar dataKey="likes" fill="#82ca9d" />
            <Bar dataKey="clicks" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
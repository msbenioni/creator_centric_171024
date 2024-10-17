import { Button } from "@/components/ui/button"
import { UserIcon, FileTextIcon, BarChartIcon, CreditCardIcon } from "lucide-react"

interface DashboardSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function DashboardSidebar({ activeTab, setActiveTab }: DashboardSidebarProps) {
  const tabs = [
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "content", label: "Content", icon: FileTextIcon },
    { id: "analytics", label: "Analytics", icon: BarChartIcon },
    { id: "subscription", label: "Subscription", icon: CreditCardIcon },
  ]

  return (
    <aside className="w-64">
      <nav className="space-y-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="mr-2 h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </nav>
    </aside>
  )
}
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, TrendingUp, Clock, CheckCircle } from "lucide-react"

interface DashboardStats {
  totalBookings: number
  pendingBookings: number
  completedBookings: number
  todayBookings: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    todayBookings: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("[v0] Error fetching dashboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Today's Bookings",
      value: stats.todayBookings,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending",
      value: stats.pendingBookings,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Completed",
      value: stats.completedBookings,
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your courier service management dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{isLoading ? "..." : stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts for managing your courier service</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Package className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">Create New Booking</div>
              <div className="text-sm text-muted-foreground">Add a new shipment</div>
            </div>
          </a>
          <a
            href="/dashboard/bookings"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">View All Bookings</div>
              <div className="text-sm text-muted-foreground">Manage existing bookings</div>
            </div>
          </a>
          <a
            href="/dashboard/analytics"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <CheckCircle className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">View Analytics</div>
              <div className="text-sm text-muted-foreground">Track performance</div>
            </div>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}

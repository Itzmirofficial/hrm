import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Users, Calendar, BarChart4 } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your HR Management System</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leaves</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Pending approvals: 5</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">Present: 90.1%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overtime Hours</CardTitle>
            <BarChart4 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">246h</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/company">
                <Button className="w-full justify-start" variant="outline">
                  Company
                </Button>
              </Link>
              <Link href="/department">
                <Button className="w-full justify-start" variant="outline">
                  Department
                </Button>
              </Link>
              <Link href="/employee">
                <Button className="w-full justify-start" variant="outline">
                  Employee
                </Button>
              </Link>
              <Link href="/leave-application">
                <Button className="w-full justify-start" variant="outline">
                  Leave Application
                </Button>
              </Link>
              <Link href="/shifts">
                <Button className="w-full justify-start" variant="outline">
                  Shifts
                </Button>
              </Link>
              <Link href="/reports">
                <Button className="w-full justify-start" variant="outline">
                  Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: "John Smith", action: "applied for leave", time: "2 hours ago" },
                { user: "Sarah Johnson", action: "updated profile", time: "4 hours ago" },
                { user: "Mike Thompson", action: "clocked in", time: "8 hours ago" },
                { user: "Emily Davis", action: "clocked out", time: "yesterday" },
                { user: "Robert Wilson", action: "submitted timesheet", time: "yesterday" },
              ].map((activity, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-muted-foreground"> {activity.action}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

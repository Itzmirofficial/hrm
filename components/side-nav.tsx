"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Building2,
  Users,
  Calendar,
  Clock,
  FileText,
  Home,
  UserCircle,
  Menu,
  X,
  LayoutGrid,
  UserCog,
  AlignJustify,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

export default function SideNav() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(!isMobile)

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Company", href: "/company", icon: Building2 },
    { name: "Department", href: "/department", icon: LayoutGrid },
    { name: "Designation", href: "/designation", icon: UserCog },
    { name: "Employee", href: "/employee", icon: Users },
    { name: "Shifts", href: "/shifts", icon: Clock },
    { name: "Holidays", href: "/holidays", icon: Calendar },
    { name: "Leave Setup", href: "/leave-setup", icon: FileText },
    { name: "Leave Application", href: "/leave-application", icon: Calendar },
    { name: "Manual Entry", href: "/manual-entry", icon: UserCircle },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Categories", href: "/category", icon: AlignJustify },
    { name: "Attendance", href: "/attendance", icon: Activity },
  ]

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {isMobile && (
        <Button variant="ghost" size="icon" className="fixed top-3 left-3 z-50" onClick={toggleSidebar}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}
      <div
        className={`${isOpen ? "translate-x-0" : "-translate-x-full"} 
        fixed inset-y-0 z-40 flex w-64 flex-col bg-background transition-transform 
        duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <div className="border-b p-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Clock className="h-6 w-6" />
            <span className="text-xl font-bold">HRMS System</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
      {isOpen && isMobile && <div className="fixed inset-0 bg-black/50 z-30" onClick={toggleSidebar} />}
    </>
  )
}

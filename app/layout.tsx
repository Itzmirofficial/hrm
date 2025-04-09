import type React from "react"
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import SideNav from "@/components/side-nav"
import Header from "@/components/header"
import { HRMSProvider } from "@/context/hrms-context"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "HRMS - HR Time & Attendance Management",
  description: "Modern HR Time & Attendance Management System",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <HRMSProvider>
            <div className="flex h-screen overflow-hidden">
              <SideNav />
              <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
              </div>
            </div>
            <Toaster />
          </HRMSProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'
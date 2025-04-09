"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Printer, FileSpreadsheet, Search, Trash2 } from "lucide-react"
import LeaveApplicationForm from "./leave-application-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useHRMS } from "@/context/hrms-context"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns"

export default function LeaveApplicationPage() {
  const {
    leaveApplications,
    deleteLeaveApplication,
    approveLeaveApplication,
    rejectLeaveApplication,
    getEmployeeById,
    getLeaveTypeById,
  } = useHRMS()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredLeaveApplications = leaveApplications.filter((leave) => {
    const employee = getEmployeeById(leave.employeeId)
    return employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) || ""
  })

  const handleDelete = (id: number) => {
    deleteLeaveApplication(id)
  }

  const handleApprove = (id: number) => {
    approveLeaveApplication(id)
  }

  const handleReject = (id: number) => {
    rejectLeaveApplication(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leave Applications</h1>
          <Breadcrumb className="text-sm text-muted-foreground">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/leave-application">Leave Applications</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <LeaveApplicationForm />
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Leave Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search leave applications..."
                className="w-full pl-8 md:w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeaveApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No leave applications found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeaveApplications.map((leave) => {
                    const employee = getEmployeeById(leave.employeeId)
                    const leaveType = getLeaveTypeById(leave.leaveTypeId)
                    const days =
                      Math.ceil((leave.endDate.getTime() - leave.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
                    return (
                      <TableRow key={leave.id}>
                        <TableCell>{leave.id}</TableCell>
                        <TableCell>{employee?.name || "Unknown"}</TableCell>
                        <TableCell>{leaveType?.name || "Unknown"}</TableCell>
                        <TableCell>{format(leave.startDate, "yyyy-MM-dd")}</TableCell>
                        <TableCell>{format(leave.endDate, "yyyy-MM-dd")}</TableCell>
                        <TableCell>{days}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              leave.status === "Approved"
                                ? "success"
                                : leave.status === "Rejected"
                                  ? "destructive"
                                  : "outline"
                            }
                          >
                            {leave.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                            {leave.status === "Pending" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 border-green-200"
                                  onClick={() => handleApprove(leave.id)}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200"
                                  onClick={() => handleReject(leave.id)}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete this leave application. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(leave.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredLeaveApplications.length}</span> of{" "}
              <span className="font-medium">{leaveApplications.length}</span> results
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

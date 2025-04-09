"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { CalendarIcon, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { format, differenceInDays, addDays } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useHRMS } from "@/context/hrms-context"

const formSchema = z
  .object({
    employee: z.string({
      required_error: "Please select an employee.",
    }),
    leaveType: z.string({
      required_error: "Please select a leave type.",
    }),
    startDate: z.date({
      required_error: "Please select a start date.",
    }),
    endDate: z.date({
      required_error: "Please select an end date.",
    }),
    dayDuration: z.enum(["full", "half"], {
      required_error: "Please select day duration.",
    }),
    remarks: z.string().optional(),
  })
  .refine(
    (data) => {
      return data.endDate >= data.startDate
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  )

export default function LeaveApplicationForm() {
  const { employees, leaveTypes, addLeaveApplication } = useHRMS()
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employee: "",
      leaveType: "",
      dayDuration: "full",
      remarks: "",
    },
  })

  const [leaveBalance, setLeaveBalance] = useState({
    casual: 10,
    sick: 12,
    annual: 20,
  })

  // Watch for leave type changes to show relevant balance
  const watchLeaveType = form.watch("leaveType")
  const watchStartDate = form.watch("startDate")
  const watchEndDate = form.watch("endDate")

  // Calculate days between start and end date (inclusive)
  const dayCount = watchStartDate && watchEndDate ? differenceInDays(addDays(watchEndDate, 1), watchStartDate) : 0

  function onSubmit(values: z.infer<typeof formSchema>) {
    const leaveApplicationData = {
      employeeId: Number.parseInt(values.employee),
      leaveTypeId: Number.parseInt(values.leaveType),
      startDate: values.startDate,
      endDate: values.endDate,
      dayDuration: values.dayDuration,
      remarks: values.remarks,
    }

    addLeaveApplication(leaveApplicationData)
    setOpen(false)
    form.reset()
  }

  const getCurrentBalance = () => {
    switch (watchLeaveType) {
      case "1":
        return leaveBalance.casual
      case "2":
        return leaveBalance.sick
      case "3":
        return leaveBalance.annual
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Apply Leave
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Apply for Leave</DialogTitle>
          <DialogDescription>Fill in the details to submit a leave application.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="employee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Employee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id.toString()}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="leaveType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Leave Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {leaveTypes.map((leaveType) => (
                        <SelectItem key={leaveType.id} value={leaveType.id.toString()}>
                          {leaveType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getCurrentBalance() !== null && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Available Balance: <span className="font-medium">{getCurrentBalance()}</span> days
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => (watchStartDate ? date < watchStartDate : false)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {watchStartDate && watchEndDate && (
              <div className="text-sm text-muted-foreground">
                Leave Duration: <span className="font-medium">{dayCount}</span> day{dayCount !== 1 ? "s" : ""}
              </div>
            )}

            <FormField
              control={form.control}
              name="dayDuration"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Day Duration</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-6">
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="full" />
                        </FormControl>
                        <FormLabel className="font-normal">Full Day</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="half" />
                        </FormControl>
                        <FormLabel className="font-normal">Half Day</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter reason for leave or any additional notes"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false)
                  form.reset()
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

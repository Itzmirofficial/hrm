"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useHRMS } from "@/context/hrms-context"

const formSchema = z.object({
  // Company Details
  machineCode: z.string().min(1, { message: "Machine code is required." }),
  employeeCode: z.string().min(1, { message: "Employee code is required." }),
  employeeName: z.string().min(2, { message: "Employee name is required." }),
  hireDate: z.date({ required_error: "Hire date is required." }),
  gender: z.enum(["male", "female"], { required_error: "Gender is required." }),
  department: z.string({ required_error: "Department is required." }),
  category: z.string({ required_error: "Category is required." }),
  designation: z.string({ required_error: "Designation is required." }),
  shift: z.string({ required_error: "Shift is required." }),
  otEligible: z.boolean().default(false),
  autoShift: z.boolean().default(false),
  resigned: z.boolean().default(false),

  // Personal Details
  qualification: z.string().optional(),
  experience: z.string().optional(),
  previousCompany: z.string().optional(),
  email: z.string().email({ message: "Invalid email address." }).optional(),
  permanentAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  mobile: z.string().min(10, { message: "Mobile number must be at least 10 digits." }).optional(),
  bloodGroup: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  abhaNumber: z.string().optional(),
  aadharCardNo: z.string().optional(),
  dob: z.date().optional(),
  bankAccountNo: z.string().optional(),
  bankName: z.string().optional(),
  remarks: z.string().optional(),
})

interface EmployeeFormProps {
  editId?: number | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function EmployeeForm({ editId = null, open = false, onOpenChange }: EmployeeFormProps) {
  const { departments, categories, designations, shifts, addEmployee, updateEmployee, getEmployeeById } = useHRMS()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("company-details")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      machineCode: "",
      employeeCode: "",
      employeeName: "",
      gender: "male",
      department: "",
      category: "",
      designation: "",
      shift: "",
      otEligible: false,
      autoShift: false,
      resigned: false,
      qualification: "",
      experience: "",
      previousCompany: "",
      email: "",
      permanentAddress: "",
      city: "",
      state: "",
      country: "",
      phone: "",
      mobile: "",
      bloodGroup: "",
      height: "",
      weight: "",
      abhaNumber: "",
      aadharCardNo: "",
      bankAccountNo: "",
      bankName: "",
      remarks: "",
    },
  })

  // Handle controlled dialog state
  useEffect(() => {
    if (onOpenChange) {
      setIsOpen(open)
    }
  }, [open, onOpenChange])

  // Load employee data when editing
  useEffect(() => {
    if (editId) {
      const employee = getEmployeeById(editId)
      if (employee) {
        form.reset({
          machineCode: employee.machineCode,
          employeeCode: employee.employeeCode,
          employeeName: employee.name,
          hireDate: employee.hireDate,
          gender: employee.gender,
          department: employee.departmentId.toString(),
          category: employee.categoryId.toString(),
          designation: employee.designationId.toString(),
          shift: employee.shiftId.toString(),
          otEligible: employee.otEligible,
          autoShift: employee.autoShift,
          resigned: employee.resigned,
          qualification: employee.qualification || "",
          experience: employee.experience || "",
          previousCompany: employee.previousCompany || "",
          email: employee.email || "",
          permanentAddress: employee.permanentAddress || "",
          city: employee.city || "",
          state: employee.state || "",
          country: employee.country || "",
          phone: employee.phone || "",
          mobile: employee.mobile || "",
          bloodGroup: employee.bloodGroup || "",
          height: employee.height || "",
          weight: employee.weight || "",
          abhaNumber: employee.abhaNumber || "",
          aadharCardNo: employee.aadharCardNo || "",
          dob: employee.dob,
          bankAccountNo: employee.bankAccountNo || "",
          bankName: employee.bankName || "",
          remarks: employee.remarks || "",
        })
      }
    }
  }, [editId, getEmployeeById, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    const employeeData = {
      machineCode: values.machineCode,
      employeeCode: values.employeeCode,
      name: values.employeeName,
      hireDate: values.hireDate,
      gender: values.gender,
      departmentId: Number.parseInt(values.department),
      categoryId: Number.parseInt(values.category),
      designationId: Number.parseInt(values.designation),
      shiftId: Number.parseInt(values.shift),
      otEligible: values.otEligible,
      autoShift: values.autoShift,
      resigned: values.resigned,
      qualification: values.qualification,
      experience: values.experience,
      previousCompany: values.previousCompany,
      email: values.email,
      permanentAddress: values.permanentAddress,
      city: values.city,
      state: values.state,
      country: values.country,
      phone: values.phone,
      mobile: values.mobile,
      bloodGroup: values.bloodGroup,
      height: values.height,
      weight: values.weight,
      abhaNumber: values.abhaNumber,
      aadharCardNo: values.aadharCardNo,
      dob: values.dob,
      bankAccountNo: values.bankAccountNo,
      bankName: values.bankName,
      remarks: values.remarks,
    }

    if (editId) {
      updateEmployee(editId, employeeData)
    } else {
      addEmployee(employeeData)
    }

    handleClose()
  }

  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false)
    } else {
      setIsOpen(false)
    }
    form.reset()
    setActiveTab("company-details")
  }

  return (
    <Dialog open={onOpenChange ? isOpen : undefined} onOpenChange={onOpenChange || setIsOpen}>
      {!onOpenChange && (
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editId ? "Edit Employee" : "Add New Employee"}</DialogTitle>
          <DialogDescription>Enter the employee details below.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <Tabs defaultValue="company-details" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="company-details">Company Details</TabsTrigger>
                <TabsTrigger value="personal-details">Personal Details</TabsTrigger>
              </TabsList>
              <TabsContent value="company-details" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="machineCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Machine Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="employeeCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="employeeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="hireDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Hire Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
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
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-6">
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="male" />
                              </FormControl>
                              <FormLabel className="font-normal">Male</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="female" />
                              </FormControl>
                              <FormLabel className="font-normal">Female</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map((department) => (
                              <SelectItem key={department.id} value={department.id.toString()}>
                                {department.name}
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="designation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designation</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Designation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {designations.map((designation) => (
                              <SelectItem key={designation.id} value={designation.id.toString()}>
                                {designation.name}
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
                    name="shift"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shift</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Shift" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {shifts.map((shift) => (
                              <SelectItem key={shift.id} value={shift.id.toString()}>
                                {shift.name} ({shift.startTime}-{shift.endTime})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="otEligible"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} aria-label="OT Eligible" />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>OT Eligible</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="autoShift"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} aria-label="Auto Shift" />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Auto Shift</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="resigned"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} aria-label="Resigned" />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Resigned</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="button" onClick={() => setActiveTab("personal-details")}>
                    Next: Personal Details
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="personal-details" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="qualification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qualification</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="previousCompany"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Previous Company</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="permanentAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Permanent Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="bloodGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Group</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Blood Group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="abhaNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ABHA Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="aadharCardNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aadhar Card No</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
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
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="bankAccountNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Account No</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("company-details")}>
                    Back: Company Details
                  </Button>
                  <Button type="submit">{editId ? "Update" : "Submit"}</Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useHRMS } from "@/context/hrms-context"

const formSchema = z.object({
  departmentCode: z.string().min(2, {
    message: "Department code must be at least 2 characters.",
  }),
  departmentName: z.string().min(2, {
    message: "Department name must be at least 2 characters.",
  }),
  companyId: z.string({
    required_error: "Please select a company.",
  }),
  description: z.string().optional(),
})

interface DepartmentFormProps {
  editId?: number | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function DepartmentForm({ editId = null, open = false, onOpenChange }: DepartmentFormProps) {
  const { companies, addDepartment, updateDepartment, getDepartmentById } = useHRMS()
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departmentCode: "",
      departmentName: "",
      companyId: "",
      description: "",
    },
  })

  // Handle controlled dialog state
  useEffect(() => {
    if (onOpenChange) {
      setIsOpen(open)
    }
  }, [open, onOpenChange])

  // Load department data when editing
  useEffect(() => {
    if (editId) {
      const department = getDepartmentById(editId)
      if (department) {
        form.reset({
          departmentCode: department.code,
          departmentName: department.name,
          companyId: department.companyId.toString(),
          description: department.description || "",
        })
      }
    }
  }, [editId, getDepartmentById, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    const departmentData = {
      code: values.departmentCode,
      name: values.departmentName,
      companyId: Number.parseInt(values.companyId),
      description: values.description,
    }

    if (editId) {
      updateDepartment(editId, departmentData)
    } else {
      addDepartment(departmentData)
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
  }

  return (
    <Dialog open={onOpenChange ? isOpen : undefined} onOpenChange={onOpenChange || setIsOpen}>
      {!onOpenChange && (
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{editId ? "Edit Department" : "Add New Department"}</DialogTitle>
          <DialogDescription>
            {editId
              ? "Update the department details below."
              : "Enter the department details below to add a new department."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Company" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id.toString()}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="departmentCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Code</FormLabel>
                    <FormControl>
                      <Input placeholder="IT" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departmentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Information Technology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Department description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">{editId ? "Update" : "Submit"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

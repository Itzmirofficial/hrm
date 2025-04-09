"use client"

import type React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useState } from "react"
import { PlusCircle, Upload } from "lucide-react"
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
import { useHRMS } from "@/context/hrms-context"

const formSchema = z.object({
  companyCode: z.string().min(3, {
    message: "Company code must be at least 3 characters.",
  }),
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  gstNo: z.string().optional(),
  pan: z.string().optional(),
  phone: z.string().min(5, {
    message: "Phone number must be at least 5 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional(),
  logo: z.any().optional(),
})

interface CompanyFormProps {
  editId?: number | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function CompanyForm({ editId = null, open = false, onOpenChange }: CompanyFormProps) {
  const { addCompany, updateCompany, getCompanyById } = useHRMS()
  const [isOpen, setIsOpen] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyCode: "",
      companyName: "",
      address: "",
      gstNo: "",
      pan: "",
      phone: "",
      email: "",
      website: "",
      logo: null,
    },
  })

  // Handle controlled dialog state
  useEffect(() => {
    if (onOpenChange) {
      setIsOpen(open)
    }
  }, [open, onOpenChange])

  // Load company data when editing
  useEffect(() => {
    if (editId) {
      const company = getCompanyById(editId)
      if (company) {
        form.reset({
          companyCode: company.code,
          companyName: company.name,
          address: company.address || "",
          gstNo: company.gstNo || "",
          pan: company.pan || "",
          phone: company.phone,
          email: company.email,
          website: company.website || "",
          logo: company.logo || null,
        })
        if (company.logo) {
          setLogoPreview(company.logo)
        }
      }
    }
  }, [editId, getCompanyById, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    const companyData = {
      code: values.companyCode,
      name: values.companyName,
      address: values.address,
      gstNo: values.gstNo,
      pan: values.pan,
      phone: values.phone,
      email: values.email,
      website: values.website,
      logo: logoPreview,
    }

    if (editId) {
      updateCompany(editId, companyData)
    } else {
      addCompany(companyData)
    }

    handleClose()
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false)
    } else {
      setIsOpen(false)
    }
    form.reset()
    setLogoPreview(null)
  }

  return (
    <Dialog open={onOpenChange ? isOpen : undefined} onOpenChange={onOpenChange || setIsOpen}>
      {!onOpenChange && (
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editId ? "Edit Company" : "Add New Company"}</DialogTitle>
          <DialogDescription>
            {editId ? "Update the company details below." : "Enter the company details below to add a new company."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="companyCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Code</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC Corporation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="123 Main St, City, Country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="gstNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST No</FormLabel>
                    <FormControl>
                      <Input placeholder="22AAAAA0000A1Z5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PAN</FormLabel>
                    <FormControl>
                      <Input placeholder="AAAAA0000A" {...field} />
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
                      <Input placeholder="+1 123-456-7890" {...field} />
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
                      <Input placeholder="contact@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Logo</FormLabel>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("logo-upload")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </Button>
                    <FormControl>
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          handleLogoChange(e)
                          field.onChange(e)
                        }}
                      />
                    </FormControl>
                    {logoPreview && (
                      <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                        <img
                          src={logoPreview || "/placeholder.svg"}
                          alt="Logo preview"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                  </div>
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

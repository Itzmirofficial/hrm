"use client"

import { DialogFooter } from "@/components/ui/dialog"

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
import { useHRMS } from "@/context/hrms-context"

const formSchema = z.object({
  categoryCode: z.string().min(2, {
    message: "Category code must be at least 2 characters.",
  }),
  categoryName: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
  description: z.string().optional(),
})

interface CategoryFormProps {
  editId?: number | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function CategoryForm({ editId = null, open = false, onOpenChange }: CategoryFormProps) {
  const { addCategory, updateCategory, getCategoryById } = useHRMS()
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryCode: "",
      categoryName: "",
      description: "",
    },
  })

  // Handle controlled dialog state
  useEffect(() => {
    if (onOpenChange) {
      setIsOpen(open)
    }
  }, [open, onOpenChange])

  // Load category data when editing
  useEffect(() => {
    if (editId) {
      const category = getCategoryById(editId)
      if (category) {
        form.reset({
          categoryCode: category.code,
          categoryName: category.name,
          description: category.description || "",
        })
      }
    }
  }, [editId, getCategoryById, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    const categoryData = {
      code: values.categoryCode,
      name: values.categoryName,
      description: values.description,
    }

    if (editId) {
      updateCategory(editId, categoryData)
    } else {
      addCategory(categoryData)
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
            Add Category
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{editId ? "Edit Category" : "Add New Category"}</DialogTitle>
          <DialogDescription>
            {editId ? "Update the category details below." : "Enter the category details below to add a new category."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="categoryCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Code</FormLabel>
                    <FormControl>
                      <Input placeholder="PERM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Permanent" {...field} />
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
                    <Textarea placeholder="Category description" {...field} />
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

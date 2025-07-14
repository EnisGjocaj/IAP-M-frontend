"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { toast } from "react-toastify"

import { createJobListing } from "../../../api/jobListing"
import { Button } from "../../../components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb"
import { Separator } from "../../../components/ui/separator"
import { SidebarTrigger } from "../../../components/ui/sidebar"
import { useState } from "react"

const JobTypes = {
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
  CONTRACT: "CONTRACT",
  INTERNSHIP: "INTERNSHIP",
} as const;

const JobStatus = {
  DRAFT: "draft",
  ACTIVE: "active",
  CLOSED: "closed",
} as const;

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Job title must be at least 5 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  type: z.nativeEnum(JobTypes),
  department: z.string().min(1, {
    message: "Please select a department.",
  }),
  salary: z.string().min(1, {
    message: "Salary range is required.",
  }),
  description: z.string().min(50, {
    message: "Description must be at least 50 characters.",
  }),
  requirements: z.string().min(20, {
    message: "Requirements must be at least 20 characters.",
  }),
  status: z.nativeEnum(JobStatus),
})

type FormValues = z.infer<typeof formSchema>

export default function NewJobPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      location: "",
      type: JobTypes.FULL_TIME,
      department: "",
      salary: "",
      description: "",
      requirements: "",
      status: JobStatus.DRAFT,
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true)

      const requirementsArray = values.requirements
        .split('\n')
        .map(req => req.trim())
        .filter(req => req.length > 0)

      const jobData = {
        title: values.title.trim(),
        company: "IAPM", 
        location: values.location.trim(),
        type: values.type,
        salary: values.salary.trim(),
        description: values.description.trim(),
        requirements: requirementsArray,
        isActive: values.status === "active"
      }

      const response = await createJobListing(jobData)
      
      if ('data' in response && 'success' in response.data) {
        if (response.data.success) {
          toast.success('Job listing created successfully')
          navigate('/dashboard/jobs')
        } else {
          throw new Error('Failed to create job listing')
        }
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save job listing'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/jobs">Job Listings</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Post New Job</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main className="flex-1 overflow-auto p-6 bg-gray-50/50">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/dashboard/jobs">
              <Button variant="outline" size="icon" className="shadow-sm bg-transparent">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">Post New Job</h1>
              <p className="text-lg text-gray-600 mt-2">Create a new job listing</p>
            </div>
          </div>

          <div className="mx-auto max-w-4xl space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-lg">
                <CardTitle className="text-2xl text-gray-900">Job Information</CardTitle>
                <CardDescription className="text-gray-600">Fill in the job details and requirements</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Job Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Senior Software Developer" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Location</FormLabel>
                            <FormControl>
                              <Input placeholder="New York, NY" className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="salary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Salary Range</FormLabel>
                            <FormControl>
                              <Input placeholder="$80,000 - $120,000" className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Job Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={JobTypes.FULL_TIME}>Full-time</SelectItem>
                                <SelectItem value={JobTypes.PART_TIME}>Part-time</SelectItem>
                                <SelectItem value={JobTypes.CONTRACT}>Contract</SelectItem>
                                <SelectItem value={JobTypes.INTERNSHIP}>Internship</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Department</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="programming">Programming</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="agrobusiness">Agrobusiness</SelectItem>
                                <SelectItem value="accounting">Accounting</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={JobStatus.DRAFT}>Draft</SelectItem>
                                <SelectItem value={JobStatus.ACTIVE}>Active</SelectItem>
                                <SelectItem value={JobStatus.CLOSED}>Closed</SelectItem>
                              </SelectContent>
                            </Select>
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
                          <FormLabel className="text-gray-700 font-medium">Job Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                              className="min-h-[150px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Provide a detailed description of the job role</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="requirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Requirements</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List each requirement on a new line..."
                              className="min-h-[150px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Enter each requirement on a new line</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4 pt-6">
                      <Button
                        type="submit"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Creating...' : 'Post Job'}
                      </Button>
                      <Link to="/dashboard/jobs">
                        <Button variant="outline" className="px-8 bg-transparent shadow-sm">
                          Cancel
                        </Button>
                      </Link>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

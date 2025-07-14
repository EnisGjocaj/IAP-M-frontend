"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Link, useNavigate } from "react-router-dom" 
import { ArrowLeft } from "lucide-react"
import { createApplication } from "../../../api/application" 
import { toast } from "react-toastify" 

import { Button } from "../../../components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form"
import { Input } from "../../../components/ui/input"
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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  surname: z.string().min(2, {
    message: "Surname must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phoneNumber: z.string().min(10, { 
    message: "Phone number must be at least 10 characters.",
  }),
  type: z.string({
    message: "Please select a program type.",
  }),
})

export default function NewApplicationPage() {
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      phoneNumber: "", 
      type: "", 
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createApplication(values)
      toast.success('Application submitted successfully! Expect to hear from us soon.', {
        position: "top-center",
        autoClose: 5000,
        closeButton: true,
      })
      navigate('/dashboard/applications')
    } catch (error) {
      toast.error('Failed to submit application. Please try again.', {
        position: "top-center",
        autoClose: 5000,
        closeButton: true,
      })
      console.error('Error submitting application:', error)
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
              <BreadcrumbLink href="/dashboard/applications">Applications</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>New Application</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main className="flex-1 overflow-auto p-6 bg-gray-50/50">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/dashboard/applications">
              <Button variant="outline" size="icon" className="shadow-sm bg-transparent">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">New Application</h1>
              <p className="text-lg text-gray-600 mt-2">Create a new student application</p>
            </div>
          </div>

          <div className="mx-auto max-w-4xl space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-lg">
                <CardTitle className="text-2xl text-gray-900">Application Information</CardTitle>
                <CardDescription className="text-gray-600">Fill in the student details for the application</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your name" className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="surname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Surname</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your surname" className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your phone number" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Program Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select a program" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="INFORMATION_SCIENCE">Information Science</SelectItem>
                              <SelectItem value="AGROBUSINESS">Agrobusiness</SelectItem>
                              <SelectItem value="ACCOUNTING">Accounting</SelectItem>
                              <SelectItem value="MARKETING">Marketing</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4 pt-6">
                      <Button 
                        type="submit" 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8"
                      >
                        Submit Application
                      </Button>
                      <Link to="/dashboard/applications">
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

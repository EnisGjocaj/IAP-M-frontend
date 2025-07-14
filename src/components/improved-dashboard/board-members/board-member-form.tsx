"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider } from "react-hook-form"
import * as z from "zod"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Upload } from "lucide-react"
import { useState, useEffect } from "react"
import { createTeamMember, getTeamMemberById, updateTeamMember } from "../../../api/teamMembers"
import { toast } from "react-toastify"

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

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  role: z.string({
    message: "Please select a role.",
  }),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  email: z.string().optional().refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Invalid email format",
  }),
  phoneNumber: z.string().optional(),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  linkedinUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  facebookUrl: z.string().optional(),
})

export default function BoardMemberForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(id ? true : false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      role: "",
      title: "",
      email: "",
      phoneNumber: "",
      description: "",
      linkedinUrl: "",
      twitterUrl: "",
      facebookUrl: "",
    },
  })

  useEffect(() => {
    if (id) {
      const fetchMember = async () => {
        try {
          const response = await getTeamMemberById(id)
          const member = response.data
          form.reset({
            fullName: member.fullName || '',
            role: member.role || '',
            title: member.title || '',
            email: member.email || '',
            phoneNumber: member.phoneNumber || '',
            description: member.description || '',
            linkedinUrl: member.linkedinUrl || '',
            twitterUrl: member.twitterUrl || '',
            facebookUrl: member.facebookUrl || '',
          })
          if (member.imagePath) {
            setImagePreview(member.imagePath)
          }
        } catch (error) {
          toast.error('Failed to fetch member details')
          console.error('Error fetching member:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchMember()
    }
  }, [id, form])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setCvFile(file)
    } else {
      toast.error('Please upload a PDF file for CV')
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview("")
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData()
      formData.append('fullName', values.fullName)
      formData.append('role', values.role)
      formData.append('title', values.title)
      formData.append('description', values.description)
      formData.append('email', values.email || '')
      formData.append('phoneNumber', values.phoneNumber || '')
      formData.append('linkedinUrl', values.linkedinUrl || '')
      formData.append('twitterUrl', values.twitterUrl || '')
      formData.append('facebookUrl', values.facebookUrl || '')

      if (imageFile) {
        formData.append('image', imageFile)
      }
      if (cvFile) {
        formData.append('cv', cvFile)
      }

      if (id) {
        await updateTeamMember(id, formData)
        toast.success('Team member updated successfully')
      } else {
        await createTeamMember(formData)
        toast.success('Team member created successfully')
      }
      navigate('/dashboard/board-members')
    } catch (error) {
      toast.error('Failed to save team member')
      console.error('Error submitting form:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
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
              <BreadcrumbLink href="/dashboard/board-members">Board Members</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>New Member</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main className="flex-1 overflow-auto p-6 bg-gray-50/50">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/dashboard/board-members">
              <Button variant="outline" size="icon" className="shadow-sm bg-transparent">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">Add New Board Member</h1>
              <p className="text-lg text-gray-600 mt-2">Add a new member to the institute board</p>
            </div>
          </div>

          <div className="mx-auto max-w-4xl space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-lg">
                <CardTitle className="text-2xl text-gray-900">Personal Information</CardTitle>
                <CardDescription className="text-gray-600">Basic information about the team member</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter full name" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="EXECUTIVE_DIRECTOR">Director</SelectItem>
                                <SelectItem value="MEETING_COORDINATOR">Coordinator</SelectItem>
                                <SelectItem value="BOARD_MEMBER">Board Member</SelectItem>
                                <SelectItem value="PRESIDENT">President</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Title</FormLabel>
                            <FormControl>
                              <Input placeholder="PhD in Education" className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="john.doe@iapm.edu" className="h-11" {...field} />
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
                            <FormLabel className="text-gray-700 font-medium">Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" className="h-11" {...field} />
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
                          <FormLabel className="text-gray-700 font-medium">Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief description about the board member..."
                              className="min-h-[120px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    
                    <div>
                      <FormLabel className="text-gray-700 font-medium">Profile Image</FormLabel>
                      <div className="mt-2">
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
                          <label className="relative cursor-pointer w-full">
                            <div className="flex flex-col items-center justify-center gap-2">
                              {imagePreview ? (
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="w-32 h-32 object-cover rounded-full shadow-md"
                                />
                              ) : (
                                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                                  <Upload className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                              <span className="text-sm font-medium text-gray-700">
                                {imagePreview ? 'Change Image' : 'Upload Image'}
                              </span>
                              <span className="text-xs text-gray-500">
                                PNG, JPG up to 10MB
                              </span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="sr-only"
                            />
                          </label>
                        </div>
                        {imagePreview && (
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="mt-2 text-sm text-red-600 hover:text-red-700"
                          >
                            Remove Image
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <FormLabel className="text-gray-700 font-medium">CV Upload</FormLabel>
                      <div className="mt-2">
                        <Input
                          type="file"
                          accept="application/pdf"
                          onChange={handleCvUpload}
                          className="h-11"
                        />
                        <FormDescription>Upload CV document (PDF only)</FormDescription>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <Button
                        type="submit"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8"
                      >
                        {id ? 'Update Member' : 'Create Member'}
                      </Button>
                      <Link to="/dashboard/board-members">
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

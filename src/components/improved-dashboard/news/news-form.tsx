"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Upload } from "lucide-react"
import { createNews, getNewsById, updateNews } from "../../../api/news"
import { toast } from "react-toastify"
import { useState, useEffect } from "react"

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
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  content: z.string().min(20, {
    message: "Content must be at least 20 characters.",
  }),
  status: z.string({
    message: "Please select a status.",
  }),
  image: z.any().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function NewsFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const isEditMode = !!id

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      status: "draft",
    },
  })

  useEffect(() => {
    if (isEditMode) {
      const fetchNewsData = async () => {
        try {
          const response = await getNewsById(id)
          const newsData = response.data.message
          
          form.reset({
            title: newsData.title,
            content: newsData.content,
            status: newsData.status || 'draft'
          })

          if (newsData.imageUrl) {
            setImagePreview(newsData.imageUrl)
          }
        } catch (error) {
          toast.error('Failed to fetch news data')
          console.error('Error fetching news:', error)
        }
      }
      fetchNewsData()
    }
  }, [id, isEditMode, form])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  async function onSubmit(values: FormValues) {
    try {
      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('content', values.content)
      formData.append('status', values.status)
      
      if (imageFile) {
        formData.append('image', imageFile)
      }

      if (isEditMode) {
        await updateNews(id, formData)
        toast.success('News article updated successfully')
      } else {
        await createNews(formData)
        toast.success('News article created successfully')
      }
      
      navigate('/dashboard/news')
    } catch (error) {
      toast.error('Failed to submit. Please try again.')
      console.error('Error submitting news:', error)
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
              <BreadcrumbLink href="/dashboard/news">News & Articles</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Create Article</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main className="flex-1 overflow-auto p-6 bg-gray-50/50">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/dashboard/news">
              <Button variant="outline" size="icon" className="shadow-sm bg-transparent">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                {isEditMode ? 'Edit Article' : 'Create New Article'}
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                {isEditMode ? 'Update existing article' : 'Write and publish a new news article'}
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-4xl space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-lg">
                <CardTitle className="text-2xl text-gray-900">Article Information</CardTitle>
                <CardDescription className="text-gray-600">Fill in the article details</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Article Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter the main title of your article" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Content</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Write your article content here..."
                              className="min-h-[300px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>The main content of your article</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-6">
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
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="image"
                        render={({ field: { value, ...field } }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Featured Image</FormLabel>
                            <FormControl>
                              <div className="space-y-4">
                                {imagePreview && (
                                  <div className="w-32 h-32 rounded-lg overflow-hidden">
                                    <img
                                      src={imagePreview}
                                      alt="Preview"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex items-center gap-4">
                                  <Input 
                                    type="file" 
                                    accept="image/*" 
                                    className="h-11" 
                                    onChange={handleImageChange}
                                    {...field}
                                  />
                                </div>
                              </div>
                            </FormControl>
                            <FormDescription>Upload a featured image for the article</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-4 pt-6">
                      <Button
                        type="submit"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8"
                      >
                        {isEditMode ? 'Update Article' : 'Create Article'}
                      </Button>
                      <Link to="/dashboard/news">
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

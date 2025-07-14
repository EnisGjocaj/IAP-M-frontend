"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Resolver, useForm, type FieldValues } from "react-hook-form"
import * as z from "zod"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { toast } from "react-toastify"
import { useState, useEffect } from "react"

import { createFeaturedStudent, getFeaturedStudentById, updateFeaturedStudent } from "../../../api/featuredStudents"
import { Button } from "../../../components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../../../components/ui/form"
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
import { Upload } from "lucide-react"
import { useAuth } from '../../../contexts/authContext';

// Define the course types
const COURSE_TYPES = {
  INFORMATION_SCIENCE: "INFORMATION_SCIENCE",
  AGROBUSINESS: "AGROBUSINESS",
  ACCOUNTING: "ACCOUNTING",
  MARKETING: "MARKETING",
} as const

type CourseType = keyof typeof COURSE_TYPES

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
  phoneNumber: z.string()
    .regex(/^[0-9+]+$/, {
      message: "Phone number can only contain numbers and +"
    })
    .optional(),
  courseType: z.nativeEnum(COURSE_TYPES),
  score: z.number().min(0).max(100).or(
    z.string().transform((val, ctx) => {
      const parsed = parseInt(val);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Score must be a number"
        });
        return z.NEVER;
      }
      return parsed;
    })
  ),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  achievements: z.array(z.string()).or(
    z.string().transform(str => {
      try {
        return JSON.parse(str);
      } catch {
        return str.split(',').map(s => s.trim()).filter(Boolean);
      }
    })
  ),
  graduationDate: z.string().min(1, {
    message: "Graduation date is required.",
  }),
  linkedinUrl: z.string().url({ message: "Please enter a valid LinkedIn URL" }).or(z.string().length(0)).optional(),
  testimonial: z.string().min(20, {
    message: "Testimonial must be at least 20 characters.",
  }).optional(),
  isActive: z.boolean().default(true),
  image: z.any().optional(),
})

type FormData = z.infer<typeof formSchema>

export default function NewFeaturedStudentPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(id ? true : false)
  const [imagePreview, setImagePreview] = useState<string>("")

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormData>,
    defaultValues: {
      name: "",
      surname: "", 
      email: "",
      phoneNumber: "",
      courseType: COURSE_TYPES.INFORMATION_SCIENCE,
      score: 0,
      description: "",
      achievements: [],
      graduationDate: "",
      linkedinUrl: "",
      testimonial: "",
      isActive: true,
    },
  })

  useEffect(() => {
    if (id) {
      const fetchStudent = async () => {
        try {
          const response = await getFeaturedStudentById(parseInt(id));
          console.log('Full response:', response); 

          const student = response.data?.message;
          console.log('Student data:', student);

          if (!student) {
            toast.error('Student not found');
            navigate('/dashboard/featured-students');
            return;
          }

          const achievementsString = Array.isArray(student.achievements) 
            ? student.achievements.join(', ')
            : typeof student.achievements === 'string'
              ? student.achievements
              : '';

          form.reset({
            name: student.name || '',
            surname: student.surname || '',
            email: student.email || '',
            phoneNumber: student.phoneNumber || '',
            courseType: student.courseType || COURSE_TYPES.INFORMATION_SCIENCE,
            score: student.score || 0,
            description: student.description || '',
            achievements: achievementsString,
            graduationDate: student.graduationDate 
              ? new Date(student.graduationDate).toISOString().split('T')[0]
              : '',
            linkedinUrl: student.linkedinUrl || '',
            testimonial: student.testimonial || '',
            isActive: student.isActive ?? true
          });

          if (student.imagePath) {
            setImagePreview(student.imagePath);
          }
        } catch (error: any) {
          console.error('Error fetching student:', error);
          toast.error('Failed to fetch student details');
          navigate('/dashboard/featured-students');
        } finally {
          setLoading(false);
        }
      };

      fetchStudent();
    }
  }, [id, form, navigate]);

  const onSubmit = async (data: FormData) => {
    try {
      console.log('Initial form data:', data);

      if (!user?.token) {
        toast.error('Please log in to continue');
        navigate('/login');
        return;
      }

      const formData = new FormData();
      
      const achievementsArray = Array.isArray(data.achievements) 
        ? data.achievements 
        : data.achievements.toString()
            .split(',')
            .map(item => item.trim())
            .filter(Boolean);

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'image' && value instanceof FileList) {
            formData.append('image', value[0]);
          } else if (key === 'achievements') {
            formData.append('achievements', JSON.stringify(achievementsArray));
          } else if (key === 'score') {
            formData.append(key, parseInt(value.toString()).toString());
          } else if (key === 'graduationDate') {
            const date = new Date(value);
            formData.append(key, date.toISOString());
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      console.log('Achievements being sent:', achievementsArray);
      console.log('Stringified achievements:', formData.get('achievements'));

      if (id) {
        await updateFeaturedStudent(parseInt(id), formData);
        toast.success('Featured student updated successfully!');
      } else {
        await createFeaturedStudent(formData);
        toast.success('Featured student added successfully!');
      }
      
      navigate('/dashboard/featured-students');
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message === 'Authentication required' 
        ? 'Please log in to continue'
        : 'Failed to save featured student');
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex h-16 shrink-0 items-center border-b bg-background px-6">
        <div className="flex items-center gap-2 flex-1">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-6" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/featured-students">Featured Students</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {id ? 'Edit Featured Student' : 'Add Featured Student'}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {id ? 'Edit Featured Student' : 'Add Featured Student'}
            </h1>
            <p className="text-muted-foreground">
              {id ? 'Edit the student\'s details and achievements' : 'Create a new featured student profile'}
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>
                {id ? 'Edit Featured Student' : 'Add Featured Student'}
              </CardTitle>
              <CardDescription>
                {id ? 'Enter the student\'s details and achievements' : 'Enter the student\'s details and achievements'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
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
                            <Input placeholder="Enter name" {...field} />
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
                            <Input placeholder="Enter surname" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter email" type="email" {...field} />
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
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="courseType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select course type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(COURSE_TYPES).map(([key, value]) => (
                                <SelectItem key={value} value={value}>
                                  {key.replace(/_/g, " ")}
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
                      name="score"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Score</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              max="100" 
                              placeholder="Enter score" 
                              {...field} 
                            />
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
                          <Textarea 
                            placeholder="Enter student description" 
                            className="min-h-[100px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="achievements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Achievements</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter achievements separated by commas" 
                            className="min-h-[100px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Separate multiple achievements with commas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="graduationDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Graduation Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="linkedinUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn URL (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter LinkedIn profile URL" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="testimonial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Testimonial (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter student testimonial" 
                            className="min-h-[100px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormLabel>Profile Image</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const files = e.target.files
                                if (files?.length) {
                                  onChange(files)
                                }
                              }}
                              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20"
                            />
                            {imagePreview && (
                              <img src={imagePreview} alt="Profile Preview" className="w-16 h-16 object-cover rounded-full" />
                            )}
                            <Upload className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <Button type="submit" className="bg-primary">
                      {id ? 'Update Featured Student' : 'Add Featured Student'}
                    </Button>
                    <Link to="/dashboard/featured-students">
                      <Button variant="outline">Cancel</Button>
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

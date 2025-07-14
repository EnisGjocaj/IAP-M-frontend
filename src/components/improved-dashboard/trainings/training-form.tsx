"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { createTraining, updateTraining, getTraining } from "../../../api/training"
import { toast } from "react-toastify"

import { Button } from "../../../components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Textarea } from "../../../components/ui/textarea"
import { Resolver } from "react-hook-form"
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
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string({
    message: "Please select a category.",
  }),
  level: z.string({
    message: "Please select a level.",
  }),
  instructor: z.string().min(2, {
    message: "Instructor name must be at least 2 characters.",
  }),
  // Change these to handle numbers properly
  totalHours: z.coerce.number().min(1, {
    message: "Total hours must be at least 1",
  }),
  startDate: z.string(),
  endDate: z.string(),
  maxParticipants: z.coerce.number().min(1).optional(),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export default function TrainingFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      title: "",
      description: "", 
      category: "",
      level: "",
      instructor: "",
      totalHours: 0, 
      startDate: "",
      endDate: "",
      maxParticipants: undefined, 
      isActive: true,
    },
  });

  useEffect(() => {
    if (isEditMode) {
      fetchTrainingData();
    }
  }, [id]);

  const fetchTrainingData = async () => {
    try {
      const response = await getTraining(id!);
      if (response?.data?.message) {
        const training = response.data.message;
        form.reset({
          title: training.title,
          description: training.description,
          category: training.category,
          level: training.level,
          instructor: training.instructor,
          totalHours: training.totalHours,
          startDate: new Date(training.startDate).toISOString().split('T')[0],
          endDate: new Date(training.endDate).toISOString().split('T')[0],
          maxParticipants: training.maxParticipants,
          isActive: training.isActive,
        });
      } else {
        toast.error('Training not found');
        navigate('/dashboard/trainings');
      }
    } catch (error) {
      toast.error('Failed to fetch training data');
      console.error('Error fetching training:', error);
      navigate('/dashboard/trainings');
    }
  };

  async function onSubmit(values: FormValues) {
    try {
      if (isEditMode) {
        await updateTraining(id!, values);
        toast.success('Training updated successfully');
      } else {
        await createTraining(values);
        toast.success('Training created successfully');
      }
      navigate('/dashboard/trainings');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
        (isEditMode ? 'Failed to update training' : 'Failed to create training');
      toast.error(errorMessage);
      console.error('Error:', error);
    }
  }

  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex h-16 shrink-0 items-center border-b bg-background px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-4 h-6" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="text-muted-foreground hover:text-foreground">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/trainings" className="text-muted-foreground hover:text-foreground">
                Trainings
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{isEditMode ? 'Edit Training' : 'New Training'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 overflow-auto p-6 bg-muted/10">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/dashboard/trainings">
              <Button variant="outline" size="icon" className="shadow-sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {isEditMode ? 'Edit Training' : 'Add New Training'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isEditMode ? 'Update training information' : 'Create a new training program'}
              </p>
            </div>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/10 space-y-1">
              <CardTitle>Training Information</CardTitle>
              <CardDescription>
                Enter the training details below
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Training title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Training description" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
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

                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="BEGINNER">Beginner</SelectItem>
                              <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                              <SelectItem value="ADVANCED">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="instructor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructor</FormLabel>
                        <FormControl>
                          <Input placeholder="Instructor name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="totalHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Hours</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="40" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              value={field.value || ''} // Handle empty state
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="maxParticipants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Participants</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="15" 
                            {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            value={field.value || ''} // Handle empty state
                          />
                        </FormControl>
                        <FormDescription>
                          Leave empty for unlimited participants
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4 pt-4">
                    <Button 
                      type="submit" 
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isEditMode ? 'Update Training' : 'Create Training'}
                    </Button>
                    <Link to="/dashboard/trainings">
                      <Button variant="outline">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 
"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { createUser, updateUser, getUserById } from "../../../api/manageUsers"
import { toast } from "react-toastify"

import { Button } from "../../../components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form"
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

const formSchema = z
  .object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    phone: z.string().min(10, {
      message: "Phone number must be at least 10 characters.",
    }),
    role: z.string({
      message: "Please select a role.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }).optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => {
    if (data.password || data.confirmPassword) {
      return data.password === data.confirmPassword;
    }
    return true;
  }, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function UserFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (isEditMode) {
      fetchUserData();
    }
  }, [id]);

  const fetchUserData = async () => {
    try {
      const response = await getUserById(id!);
      const user = response.data;
      
      const [firstName, ...lastNameParts] = user.name.split(' ');
      const lastName = lastNameParts.join(' ');

      form.reset({
        firstName,
        lastName,
        email: user.email,
        phone: user.phone || '',
        role: user.role?.toLowerCase() || 'student',
      });
    } catch (error) {
      toast.error('Failed to fetch user data');
      console.error('Error fetching user:', error);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const userData = {
        name: `${values.firstName} ${values.lastName}`.trim(),
        surname: values.lastName,
        email: values.email,
        phone: values.phone,
        role: values.role,
        ...(values.password && { password: values.password })
      };

      if (isEditMode) {
        await updateUser(id!, userData);
        toast.success('User updated successfully');
      } else {
        if (!values.password) {
          toast.error('Password is required for new users');
          return;
        }
        await createUser(userData);
        toast.success('User created successfully');
      }
      
      navigate('/dashboard/users');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
        (isEditMode ? 'Failed to update user' : 'Failed to create user');
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
              <BreadcrumbLink 
                href="/dashboard/users" 
                className="text-muted-foreground hover:text-foreground"
              >
                Users
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{isEditMode ? 'Edit User' : 'New User'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 overflow-auto p-6 bg-muted/10">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/dashboard/users">
              <Button variant="outline" size="icon" className="shadow-sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {isEditMode ? 'Edit User' : 'Add New User'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isEditMode ? 'Update user information' : 'Create a new user account'}
              </p>
            </div>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/10 space-y-1">
              <CardTitle>User Information</CardTitle>
              <CardDescription>
                Enter the user details below
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
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
                          <Input 
                            type="email" 
                            placeholder="john.doe@example.com" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="instructor">Instructor</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {(!isEditMode || form.watch('password')) && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              {isEditMode ? 'Leave blank to keep current password' : 'Minimum 8 characters'}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <Button 
                      type="submit" 
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isEditMode ? 'Update User' : 'Create User'}
                    </Button>
                    <Link to="/dashboard/users">
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

"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { 
  ArrowUpDown, 
  MoreHorizontal, 
  Search, 
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  UserPlus,
} from "lucide-react"
import { Link } from "react-router-dom"
import { getAllStudents } from "../../../api/manageUsers"
import { toast } from "react-toastify"

import { Button } from "../../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Badge } from "../../../components/ui/badge"
import { DataTable } from "../../../components/ui/data-table"
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
import { Input } from "../../../components/ui/input"
import { PaginationControls } from "../../../components/PaginationControls"

type Student = {
  id: string | number
  name: string
  surname: string
  email: string
  university: string
  faculty: string
  year: string
  gpa: number
  status: "active" | "inactive"
  createdAt: string
  studentProfile?: {
    university?: string
    faculty?: string
    year?: string
    gpa?: number
  }
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 10

  useEffect(() => {
    fetchStudents()
  }, [])

  const getInitialsColor = (name: string) => {
    const colors = [
      'bg-blue-100 text-blue-700',
      'bg-purple-100 text-purple-700',
      'bg-green-100 text-green-700',
      'bg-yellow-100 text-yellow-700',
      'bg-red-100 text-red-700',
      'bg-pink-100 text-pink-700'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getAllStudents();
      
      if (response?.data?.data && Array.isArray(response.data.data)) {
        const transformedStudents = response.data.data.map((student: any) => ({
          id: student?.id || 'N/A',
          name: student?.name || '',
          surname: student?.surname || '',
          email: student?.email || 'No email',
          university: student?.studentProfile?.university || 'Not specified',
          faculty: student?.studentProfile?.faculty || 'Not specified',
          year: student?.studentProfile?.year || 'Not specified',
          gpa: student?.studentProfile?.gpa || 0,
          status: 'active',
          createdAt: student?.createdAt ? new Date(student.createdAt).toISOString() : new Date().toISOString()
        }));
        setStudents(transformedStudents);
      } else {
        console.error('Invalid response format:', response);
        toast.error('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.university.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pageCount = Math.ceil(filteredStudents.length / pageSize)
  const paginatedStudents = filteredStudents.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  )

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button 
          variant="ghost" 
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted/50 font-semibold text-muted-foreground -ml-4"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
        </Button>
      ),
      cell: ({ row }) => {
        const fullName = `${row.original.name} ${row.original.surname}`.trim();
        const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase();
        return (
          <div className="flex items-center gap-3 py-2">
            <div className={`h-10 w-10 rounded-full ${getInitialsColor(fullName)} flex items-center justify-center ring-2 ring-white shadow-sm`}>
              <span className="text-sm font-semibold">{initials}</span>
            </div>
            <div>
              <div className="font-medium text-foreground">{fullName}</div>
              <div className="text-sm text-muted-foreground">{row.original.email}</div>
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: "university",
      header: ({ column }) => (
        <Button 
          variant="ghost" 
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted/50 font-semibold text-muted-foreground"
        >
          University
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.getValue("university")}</span>
        </div>
      )
    },
    {
      accessorKey: "faculty",
      header: ({ column }) => (
        <Button 
          variant="ghost" 
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted/50 font-semibold text-muted-foreground"
        >
          Faculty
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
        </Button>
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {row.getValue("faculty")}
        </Badge>
      )
    },
    {
      accessorKey: "year",
      header: ({ column }) => (
        <Button 
          variant="ghost" 
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted/50 font-semibold text-muted-foreground"
        >
          Year
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
        </Button>
      )
    },
    {
      accessorKey: "gpa",
      header: ({ column }) => (
        <Button 
          variant="ghost" 
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted/50 font-semibold text-muted-foreground"
        >
          GPA
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
        </Button>
      ),
      cell: ({ row }) => {
        const gpa = row.getValue<number>("gpa")
        return (
          <Badge variant="outline" className={`
            ${gpa >= 8.5 ? 'bg-green-50 text-green-700 border-green-200' : 
              gpa >= 7.5 ? 'bg-blue-50 text-blue-700 border-blue-200' : 
              gpa >= 6.5 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
              'bg-gray-50 text-gray-700 border-gray-200'}
            px-3 py-1 rounded-full font-medium
          `}>
            {gpa.toFixed(1)}
          </Badge>
        )
      }
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button 
          variant="ghost" 
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted/50 font-semibold text-muted-foreground"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = (row.getValue("status") as string) || 'inactive';
        return (
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${
              status?.toLowerCase() === "active" 
                ? "bg-green-500 shadow-sm shadow-green-200" 
                : "bg-gray-300"
            }`} />
            <span className={`text-sm font-medium ${
              status?.toLowerCase() === "active" 
                ? "text-green-700" 
                : "text-gray-600"
            }`}>
              {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
            </span>
          </div>
        )
      }
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button 
          variant="ghost" 
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted/50 font-semibold text-muted-foreground"
        >
          Joined
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
        </Button>
      ),
      cell: ({ row }) => {
        const dateValue = row.getValue("createdAt") as string | number | Date;
        const date = dateValue ? new Date(dateValue) : new Date();
        
        return (
          <div className="flex flex-col">
            <div className="text-sm font-medium text-foreground">
              {date.toLocaleDateString('en-US', { 
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            <div className="text-xs text-muted-foreground">
              {date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </div>
          </div>
        )
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const student = row.original;
        const studentId = student?.id?.toString() || '';
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(studentId)}>
                Copy student ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={`/dashboard/students/${studentId}`}>View Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={`/dashboard/students/${studentId}/edit`}>Edit Profile</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]

  return (
    <div className="flex h-full w-full flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-background px-6">
        <div className="flex items-center gap-2 flex-1">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-6" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard" className="text-muted-foreground hover:text-foreground">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">Students</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Students Management</h1>
            <p className="text-muted-foreground mt-1">Manage and monitor student profiles</p>
          </div>
          <Link to="/dashboard/students/new">
            <Button className="bg-primary hover:bg-primary/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Student
            </Button>
          </Link>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 pb-6">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-muted/50 w-full"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Active</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-gray-300" />
                  <span>Inactive</span>
                </div>
              </div>
            </div>

            <DataTable 
              columns={columns} 
              data={paginatedStudents}
              isLoading={loading}
            />

            <div className="py-4 border-t">
              <PaginationControls
                currentPage={currentPage}
                pageCount={pageCount}
                pageSize={pageSize}
                totalItems={filteredStudents.length}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
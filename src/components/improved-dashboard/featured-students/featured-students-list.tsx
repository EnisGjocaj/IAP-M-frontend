"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Plus, Award, Search, Upload } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

import { 
  getAllFeaturedStudents, 
  deleteFeaturedStudent,
  getFeaturedStudentsByCourse 
} from "../../../api/featuredStudents"

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

type FeaturedStudent = {
  id: number
  name: string
  surname: string
  email: string
  courseType: 'INFORMATION_SCIENCE' | 'AGROBUSINESS' | 'ACCOUNTING' | 'MARKETING'
  score: number
  imagePath?: string
  description: string
  achievements: string[]
  graduationDate: string
  linkedinUrl?: string
  testimonial?: string
  isActive: boolean
  createdAt: string
}

export default function FeaturedStudentsPage() {
  const [students, setStudents] = useState<FeaturedStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 10

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await getAllFeaturedStudents()
      
      const transformedStudents = response.data.map((student: any) => ({
        ...student,
        name: `${student.name} ${student.surname}`.trim(),
        graduationDate: new Date(student.graduationDate).toISOString().split('T')[0],
        createdAt: new Date(student.createdAt).toISOString()
      }))
      setStudents(transformedStudents)
    } catch (error) {
      toast.error('Failed to fetch featured students')
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteStudent = async (id: number) => {
    if (window.confirm('Are you sure you want to remove this student from featured list?')) {
      try {
        await deleteFeaturedStudent(id)
        toast.success('Student removed from featured list')
        fetchStudents()
      } catch (error) {
        toast.error('Failed to remove student')
        console.error('Error removing student:', error)
      }
    }
  }

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.courseType.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pageCount = Math.ceil(filteredStudents.length / pageSize)
  const paginatedStudents = filteredStudents.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  )

  useEffect(() => {
    setCurrentPage(0)
  }, [searchQuery])

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

  const columns: ColumnDef<FeaturedStudent>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button 
            variant="ghost" 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-muted/50 font-semibold text-muted-foreground -ml-4"
          >
            Student
            <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const name = row.getValue<string>("name")
        const email = row.original.email
        const imagePath = row.original.imagePath
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()
        
        return (
          <div className="flex items-center gap-3 py-2">
            {imagePath ? (
              <img
                src={imagePath}
                alt={name}
                className="h-10 w-10 rounded-full ring-2 ring-white shadow-sm object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.parentElement?.classList.add(getInitialsColor(name))
                  target.parentElement!.innerHTML = `<span class="text-sm font-semibold">${initials}</span>`
                }}
              />
            ) : (
              <div className={`h-10 w-10 rounded-full ${getInitialsColor(name)} flex items-center justify-center ring-2 ring-white shadow-sm`}>
                <span className="text-sm font-semibold">{initials}</span>
              </div>
            )}
            <div>
              <div className="font-medium text-foreground">{name}</div>
              <div className="text-sm text-muted-foreground">{email}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "courseType",
      header: ({ column }) => (
        <Button 
          variant="ghost" 
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted/50 font-semibold text-muted-foreground"
        >
          Program
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
        </Button>
      ),
      cell: ({ row }) => {
        const courseType = row.getValue("courseType") as string
        const courseColors = {
          INFORMATION_SCIENCE: 'bg-blue-50 text-blue-700 border-blue-200',
          MARKETING: 'bg-purple-50 text-purple-700 border-purple-200',
          AGROBUSINESS: 'bg-green-50 text-green-700 border-green-200',
          ACCOUNTING: 'bg-yellow-50 text-yellow-700 border-yellow-200'
        }
        const displayName = courseType.replace('_', ' ').toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        
        return (
          <Badge 
            variant="outline" 
            className={`${courseColors[courseType]} px-3 py-1 rounded-full font-medium`}
          >
            {displayName}
          </Badge>
        )
      },
    },
    {
      accessorKey: "score",
      header: ({ column }) => (
        <Button 
          variant="ghost" 
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted/50 font-semibold text-muted-foreground"
        >
          Score
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
        </Button>
      ),
      cell: ({ row }) => {
        const score = row.getValue("score") as number
        return (
          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">{score}%</span>
          </div>
        )
      },
    },
    {
      accessorKey: "graduationDate",
      header: ({ column }) => (
        <Button 
          variant="ghost" 
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted/50 font-semibold text-muted-foreground"
        >
          Graduated
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("graduationDate"))
        return (
          <div className="flex flex-col">
            <div className="text-sm font-medium text-foreground">
              {date.toLocaleDateString('en-US', { 
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean
        return (
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${
              isActive 
                ? "bg-green-500 shadow-sm shadow-green-200" 
                : "bg-gray-300"
            }`} />
            <span className={`text-sm font-medium ${
              isActive 
                ? "text-green-700" 
                : "text-gray-600"
            }`}>
              {isActive ? 'Featured' : 'Archived'}
            </span>
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const student = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(student.id.toString())}>
                Copy student ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={`/dashboard/featured-students/${student.id}`}>View details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={`/dashboard/featured-students/${student.id}/edit`}>Edit student</Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => handleDeleteStudent(student.id)}
              >
                Remove from featured
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
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
                <BreadcrumbPage className="font-semibold">Featured Students</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Featured Students</h1>
            <p className="text-muted-foreground mt-1">Showcase outstanding student achievements and success stories</p>
          </div>
          <Link to="/dashboard/featured-students/new">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Featured Student
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
                  <span>Featured</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-gray-300" />
                  <span>Archived</span>
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

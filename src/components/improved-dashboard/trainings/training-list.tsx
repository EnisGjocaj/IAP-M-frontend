"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { 
  ArrowUpDown, 
  MoreHorizontal, 
  Search, 
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Link } from "react-router-dom"
import { getAllTrainings, deleteTraining } from "../../../api/training"
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
import { TrainingDetailsModal } from './training-details-modal'

type Training = {
  id: string
  title: string
  category: string
  level: string
  instructor: string
  startDate: string
  endDate: string
  totalHours: number
  enrolledStudents?: number
  isActive: boolean
}

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]) 
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 10
  const [selectedTrainingId, setSelectedTrainingId] = useState<string | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  useEffect(() => {
    fetchTrainings()
  }, [])

  const fetchTrainings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAllTrainings()
      
      if (response?.data?.message) {
        setTrainings(response.data.message)
      } else {
        setTrainings([])
        setError('No training data available')
      }
    } catch (error) {
      console.error('Error fetching trainings:', error)
      setError('Failed to fetch trainings')
      toast.error('Failed to fetch trainings')
      setTrainings([]) 
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTraining = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this training?')) {
      try {
        await deleteTraining(id)
        toast.success('Training deleted successfully')
        fetchTrainings()
      } catch (error) {
        toast.error('Failed to delete training')
        console.error('Error deleting training:', error)
      }
    }
  }

  const filteredTrainings = trainings?.filter(training => 
    training?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    training?.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    training?.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const pageCount = Math.ceil(filteredTrainings.length / pageSize)
  const paginatedTrainings = filteredTrainings.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  )

  useEffect(() => {
    setCurrentPage(0)
  }, [searchQuery])

  const getTrainingStatus = (training: any) => {
    const now = new Date();
    const startDate = new Date(training.startDate);
    const endDate = new Date(training.endDate);

    if (!training.isActive) return "INACTIVE";
    if (now < startDate) return "UPCOMING";
    if (now > endDate) return "COMPLETED";
    return "IN_PROGRESS";
  };

  const columns: ColumnDef<Training>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button 
            variant="ghost" 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-muted/50 font-semibold text-muted-foreground -ml-4"
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
          </Button>
        )
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category") as string
        return (
          <Badge variant="outline" className="font-medium">
            {category.replace('_', ' ')}
          </Badge>
        )
      },
    },
    {
      accessorKey: "level",
      header: "Level",
    },
    {
      accessorKey: "instructor",
      header: "Instructor",
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("startDate"))
        return date.toLocaleDateString()
      },
    },
    {
      accessorKey: "totalHours",
      header: "Hours",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const training = row.original;
        const status = getTrainingStatus(training);
        
        return (
          <Badge 
            variant="outline" 
            className={`${
              status === "UPCOMING" ? "bg-blue-50 text-blue-700 border-blue-200" :
              status === "IN_PROGRESS" ? "bg-green-50 text-green-700 border-green-200" :
              status === "COMPLETED" ? "bg-purple-50 text-purple-700 border-purple-200" :
              "bg-gray-50 text-gray-700 border-gray-200"
            }`}
          >
            {status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const training = row.original

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
              <DropdownMenuItem onClick={() => {
                setSelectedTrainingId(training.id)
                setIsDetailsModalOpen(true)
              }}>
                View details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={`/dashboard/trainings/${training.id}/edit`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => handleDeleteTraining(training.id)}
              >
                Delete
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
                <BreadcrumbPage className="font-semibold">Trainings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Training Programs</h1>
            <p className="text-muted-foreground mt-1">Manage training programs and courses</p>
          </div>
          <Link to="/dashboard/trainings/new">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add New Training
            </Button>
          </Link>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-2 sm:p-4">
            <div className="flex items-center gap-4 p-4 pb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search trainings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-muted/50"
                />
              </div>
            </div>

            {error && (
              <div className="text-center p-4 text-red-600">
                {error}
              </div>
            )}

            {!error && (
              <>
                <DataTable 
                  columns={columns} 
                  data={paginatedTrainings}
                  isLoading={loading}
                />

                {!loading && trainings.length === 0 && (
                  <div className="text-center p-4 text-muted-foreground">
                    No trainings found
                  </div>
                )}

                {trainings.length > 0 && (
                  <div className="py-4 border-t">
                    <PaginationControls
                      currentPage={currentPage}
                      pageCount={pageCount}
                      pageSize={pageSize}
                      totalItems={filteredTrainings.length}
                      setCurrentPage={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <TrainingDetailsModal
        trainingId={selectedTrainingId}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedTrainingId(null)
        }}
      />
    </div>
  )
} 
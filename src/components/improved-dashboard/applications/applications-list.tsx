"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Plus, Search } from "lucide-react"
import { Link } from "react-router-dom"
import { getAllApplications, deleteApplication } from "../../../api/application"
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

type Application = {
  id: string
  name: string
  surname: string
  email: string
  phoneNumber: string
  type: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 10

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const response = await getAllApplications()
      const transformedApplications = (response.data.message || []).map((app: any) => ({
        id: app.id,
        name: app.name,
        surname: app.surname,
        email: app.email.toLowerCase(),
        phoneNumber: app.phoneNumber || 'N/A',
        type: app.type,
        status: app.status || 'pending',
        createdAt: new Date(app.createdAt).toLocaleDateString()
      }))
      setApplications(transformedApplications)
    } catch (error) {
      toast.error('Failed to fetch applications')
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteApplication = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteApplication(id)
        toast.success('Application deleted successfully')
        fetchApplications()
      } catch (error) {
        toast.error('Failed to delete application')
        console.error('Error deleting application:', error)
      }
    }
  }

  const filteredApplications = applications.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pageCount = Math.ceil(filteredApplications.length / pageSize)
  const paginatedApplications = filteredApplications.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  )

  const columns: ColumnDef<Application>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button 
            variant="ghost" 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-muted/50 font-semibold text-muted-foreground"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const application = row.original
        return (
          <div className="font-medium">
            {application.name} {application.surname}
          </div>
        )
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("phoneNumber")}</div>,
    },
    {
      accessorKey: "type",
      header: "Section",
      cell: ({ row }) => {
        const type = row.getValue("type") as string
        const typeColors: Record<string, string> = {
          PROGRAMMING: "bg-blue-100 text-blue-800",
          MARKETING: "bg-orange-100 text-orange-800",
          AGROBUSINESS: "bg-green-100 text-green-800",
          ACCOUNTING: "bg-purple-100 text-purple-800",
          DESIGN: "bg-pink-100 text-pink-800"
        }
        return (
          <Badge variant="outline" className={typeColors[type] || "bg-gray-100 text-gray-800"}>
            {type}
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const statusColors: Record<string, string> = {
          pending: "bg-yellow-100 text-yellow-800",
          approved: "bg-green-100 text-green-800",
          rejected: "bg-red-100 text-red-800",
        }
        return (
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${
              status === "approved" ? "bg-green-500" :
              status === "rejected" ? "bg-red-500" :
              "bg-yellow-500"
            }`} />
            <span className={statusColors[status]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button 
            variant="ghost" 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-muted/50 font-semibold text-muted-foreground"
          >
            Submitted
            <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
          </Button>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const application = row.original
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(application.id)}>
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={`/dashboard/applications/${application.id}`}>View details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={`/dashboard/applications/edit/${application.id}`}>Edit application</Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => handleDeleteApplication(application.id)}
              >
                Delete application
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
                <BreadcrumbPage className="font-semibold">Applications</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
            <p className="text-muted-foreground">Manage student applications for different programs</p>
          </div>
          <Link to="/dashboard/applications/new">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              New Application
            </Button>
          </Link>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-2 sm:p-4">
            <div className="flex items-center gap-4 p-4 pb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-muted/50"
                />
              </div>
            </div>

            <DataTable 
              columns={columns} 
              data={paginatedApplications}
              isLoading={loading}
            />

            <div className="py-4 border-t">
              <PaginationControls
                currentPage={currentPage}
                pageCount={pageCount}
                pageSize={pageSize}
                totalItems={filteredApplications.length}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

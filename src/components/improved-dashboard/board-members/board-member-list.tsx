"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Plus, Search, Users } from "lucide-react"
import { Link } from "react-router-dom"
import { getAllTeamMembers, deleteTeamMember } from "../../../api/teamMembers"
import { toast } from "react-toastify"
import { getImageUrl } from "../../../utils/imageUtils"

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

type BoardMember = {
  id: string
  fullName: string
  role: string
  title: string
  email: string
  phone: string
  imagePath: string
  status: "active" | "inactive"
  description?: string
}

export default function BoardMembersPage() {
  const [members, setMembers] = useState<BoardMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 10

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const response = await getAllTeamMembers()
      console.log("Members resposne", response)
      
      const transformedMembers = (response.data || []).map((member: any) => ({
        id: member.id,
        fullName: member.fullName,
        role: member.role,
        title: member.title,
        email: member.email || '',
        phone: member.phoneNumber || '',
        imagePath: member.imagePath || '',
        status: member.status || 'active',
        description: member.description
      }))
      setMembers(transformedMembers)
    } catch (error) {
      toast.error('Failed to fetch board members')
      console.error('Error fetching board members:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMember = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this board member?')) {
      try {
        await deleteTeamMember(id)
        toast.success('Board member deleted successfully')
        fetchMembers() // Refresh the list
      } catch (error) {
        toast.error('Failed to delete board member')
        console.error('Error deleting board member:', error)
      }
    }
  }

  // Filter and paginate members
  const filteredMembers = members.filter(member => 
    member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pageCount = Math.ceil(filteredMembers.length / pageSize)
  const paginatedMembers = filteredMembers.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  )

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(0)
  }, [searchQuery])

  const columns: ColumnDef<BoardMember>[] = [
    {
      accessorKey: "fullName",
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
        const member = row.original
        return (
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-secondary/10">
              {member.imagePath ? (
                <img
                  src={getImageUrl(member.imagePath)}
                  alt={member.fullName}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).src = '/placeholder.svg'
                  }}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-secondary/50" />
                </div>
              )}
            </div>
            <div>
              <div className="font-medium text-foreground">{member.fullName}</div>
              <div className="text-sm text-muted-foreground">{member.title}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <Button 
          variant="ghost" 
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted/50 font-semibold text-muted-foreground"
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
        </Button>
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-primary/5 text-primary">
          {row.getValue("role")}
        </Badge>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button 
          variant="ghost" 
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted/50 font-semibold text-muted-foreground"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <Button 
          variant="ghost" 
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted/50 font-semibold text-muted-foreground"
        >
          Phone
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("phone")}</div>,
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
        const status = row.getValue("status") as string
        return (
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${
              status === "active" 
                ? "bg-green-500 shadow-sm shadow-green-200" 
                : "bg-gray-300"
            }`} />
            <span className={`text-sm font-medium ${
              status === "active" 
                ? "text-green-700" 
                : "text-gray-600"
            }`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const member = row.original

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(member.id)}>
                Copy member ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={`/dashboard/board-members/${member.id}`}>View profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={`/dashboard/board-members/${member.id}/edit`}>Edit member</Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => handleDeleteMember(member.id)}
              >
                Remove member
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
                <BreadcrumbPage className="font-semibold">Board Members</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Board Members</h1>
            <p className="text-muted-foreground mt-1">Manage institute board members and leadership team</p>
          </div>
          <Link to="/dashboard/board-members/new">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add New Member
            </Button>
          </Link>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 pb-6">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
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
              data={paginatedMembers} 
              isLoading={loading}
            />

            <div className="py-4 border-t">
              <PaginationControls
                currentPage={currentPage}
                pageCount={pageCount}
                pageSize={pageSize}
                totalItems={filteredMembers.length}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

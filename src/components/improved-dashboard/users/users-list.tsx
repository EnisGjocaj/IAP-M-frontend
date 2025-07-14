"use client"

import { useEffect, useState } from "react"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"
import { 
  ArrowUpDown, 
  MoreHorizontal, 
  Search, 
  UserPlus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react"
import { Link } from "react-router-dom"
import { getAllUsers, deleteUser } from "../../../api/manageUsers"
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


type User = {
  id: string    
  name: string
  email: string
  role?: string
  status?: "active" | "inactive"
  createdAt?: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 10

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await getAllUsers()
      
      const transformedUsers = response.data.map((user: any) => ({
        id: user.id,
        name: `${user.name} ${user.surname || ''}`.trim(),
        email: user.email,
        role: user.role || 'Student', 
        status: 'active', 
        createdAt: new Date(user.createdAt).toISOString().split('T')[0]
      }))
      setUsers(transformedUsers)
    } catch (error) {
      toast.error('Failed to fetch users')
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id)
        toast.success('User deleted successfully')
        fetchUsers() // Refresh the list
      } catch (error) {
        toast.error('Failed to delete user')
        console.error('Error deleting user:', error)
      }
    }
  }

  // Filter and paginate users
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pageCount = Math.ceil(filteredUsers.length / pageSize)
  const paginatedUsers = filteredUsers.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  )

  // Reset to first page when search changes
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

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button 
            variant="ghost" 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-muted/50 font-semibold text-muted-foreground -ml-4"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const name = row.getValue<string>("name");
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
        return (
          <div className="flex items-center gap-3 py-2">
            <div className={`h-10 w-10 rounded-full ${getInitialsColor(name)} flex items-center justify-center ring-2 ring-white shadow-sm`}>
              <span className="text-sm font-semibold">{initials}</span>
            </div>
            <div>
              <div className="font-medium text-foreground">{name}</div>
              <div className="text-sm text-muted-foreground">{row.getValue("email")}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button 
            variant="ghost" 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-muted/50 font-semibold text-muted-foreground"
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
          </Button>
        )
      },
      cell: ({ row }) => null,
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
      cell: ({ row }) => {
        const role = row.getValue("role") as string
        const roleStyles = {
          admin: 'bg-red-50 text-red-700 border-red-200 ring-red-100',
          instructor: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-100',
          student: 'bg-green-50 text-green-700 border-green-200 ring-green-100',
          staff: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-100'
        }
        return (
          <Badge 
            variant="outline" 
            className={`
              ${roleStyles[role.toLowerCase()] || 'bg-gray-50 text-gray-700 border-gray-200'}
              px-3 py-1 rounded-full font-medium ring-1 ring-inset
            `}
          >
            {role}
          </Badge>
        )
      },
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
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button 
            variant="ghost" 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-muted/50 font-semibold text-muted-foreground"
          >
            Joined
            <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"))
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
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={`/dashboard/users/${user.id}`}>View user</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={`/dashboard/users/${user.id}/edit`}>Edit user</Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => handleDeleteUser(user.id)}
              >
                Delete user
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
                <BreadcrumbPage className="font-semibold">Users</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Users Management</h1>
            <p className="text-muted-foreground mt-1">Manage and monitor user accounts</p>
          </div>
          <Link to="/dashboard/users/new">
            <Button className="bg-primary hover:bg-primary/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </Link>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 pb-6">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
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
              data={paginatedUsers} 
              isLoading={loading}
            />

            <div className="py-4 border-t">
              <PaginationControls
                currentPage={currentPage}
                pageCount={pageCount}
                pageSize={pageSize}
                totalItems={filteredUsers.length}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

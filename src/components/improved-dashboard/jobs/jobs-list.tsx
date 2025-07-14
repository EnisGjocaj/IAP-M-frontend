    "use client"

    import { useEffect, useState } from "react"
    import type { ColumnDef } from "@tanstack/react-table"
    import { ArrowUpDown, MoreHorizontal, Plus, MapPin, DollarSign, Filter, Search } from "lucide-react"
    import { Link } from "react-router-dom"
    import { getAllJobListings, deleteJobListing } from "../../../api/jobListing" 
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
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
    import { Input } from "../../../components/ui/input"
    import { PaginationControls } from "../../../components/PaginationControls"

    type JobListing = {
    id: string
    title: string
    location: string
    type: string
    salary: string
    department: string
    postedAt: string
    status: "active" | "closed" | "draft"
    description?: string
    requirements?: string
    }

    export default function JobsPage() {
    const [jobs, setJobs] = useState<JobListing[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(0)
    const [filters, setFilters] = useState({
        department: "all",
        type: "all",
        status: "all"
    })
    const pageSize = 10

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        try {
            setLoading(true)
            const response = await getAllJobListings()
            const transformedJobs = (response.data || []).map((job: any) => ({
                id: job.id,
                title: job.title,
                location: job.location || 'Remote',
                type: job.type || 'Full-time',
                salary: job.salary || 'Competitive',
                department: job.department,
                postedAt: new Date(job.createdAt).toLocaleDateString(),
                status: job.status || 'active',
                description: job.description,
                requirements: job.requirements
            }))
            setJobs(transformedJobs)
        } catch (error) {
            toast.error('Failed to fetch job listings')
            console.error('Error fetching jobs:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteJob = async (id) => {
        if (window.confirm('Are you sure you want to delete this job listing?')) {
            try {
                await deleteJobListing(id)
                toast.success('Job listing deleted successfully')
                fetchJobs()
            } catch (error) {
                toast.error('Failed to delete job listing')
                console.error('Error deleting job:', error)
            }
        }
    }

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = 
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.location.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesDepartment = filters.department === 'all' || job.department === filters.department
        const matchesType = filters.type === 'all' || job.type === filters.type
        const matchesStatus = filters.status === 'all' || job.status === filters.status

        return matchesSearch && matchesDepartment && matchesType && matchesStatus
    })

    const pageCount = Math.ceil(filteredJobs.length / pageSize)
    const paginatedJobs = filteredJobs.slice(
        currentPage * pageSize,
        (currentPage + 1) * pageSize
    )

    const columns: ColumnDef<JobListing>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => {
        return (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Job Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
        },
        cell: ({ row }) => {
        const job = row.original
        return (
            <div>
            <div className="font-medium text-gray-900">{job.title}</div>
            <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                {job.location}
            </div>
            </div>
        )
        },
    },
    {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => {
        const department = row.getValue("department") as string
        const departmentColors: Record<string, string> = {
            Programming: "bg-blue-100 text-blue-800",
            Marketing: "bg-orange-100 text-orange-800",
            Agrobusiness: "bg-green-100 text-green-800",
            Accounting: "bg-purple-100 text-purple-800",
        }
        return <Badge className={departmentColors[department] || ""}>{department}</Badge>
        },
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => <Badge variant="outline">{row.getValue("type")}</Badge>,
    },
    {
        accessorKey: "salary",
        header: "Salary",
        cell: ({ row }) => {
        const salary = row.getValue("salary") as string
        return (
            <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-green-600 mr-1" />
            <span className="font-medium">{salary}</span>
            </div>
        )
        },
    },
    {
        accessorKey: "applicants",
        header: ({ column }) => {
        return (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Applicants
            <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
        },
        cell: ({ row }) => {
        const applicants = row.getValue("applicants") as number
        return <div className="text-center font-medium">{applicants}</div>
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
        const status = row.getValue("status") as string
        const statusColors: Record<string, string> = {
            active: "bg-green-100 text-green-800",
            closed: "bg-red-100 text-red-800",
            draft: "bg-yellow-100 text-yellow-800",
        }
        return <Badge className={statusColors[status] || ""}>{status}</Badge>
        },
    },
    {
        accessorKey: "postedAt",
        header: ({ column }) => {
        return (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Posted
            <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
        },
        cell: ({ row }) => {
        return <div>{row.getValue("postedAt")}</div>
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
        const job = row.original

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
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(job.id)}>
                    Copy job ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link to={`/dashboard/jobs/${job.id}`}>View details</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link to={`/dashboard/jobs/edit/${job.id}`}>Edit listing</Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => handleDeleteJob(job.id)}
                >
                    Delete listing
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
                                <BreadcrumbPage className="font-semibold">Job Listings</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>

            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Job Listings</h1>
                        <p className="text-muted-foreground">Manage job postings and career opportunities</p>
                    </div>
                    <Link to="/dashboard/jobs/new">
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" />
                            Post New Job
                        </Button>
                    </Link>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-2 sm:p-4">
                        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 pb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search jobs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 bg-muted/50"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Select 
                                    value={filters.department} 
                                    onValueChange={(value) => setFilters(prev => ({ ...prev, department: value }))}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Departments</SelectItem>
                                        <SelectItem value="PROGRAMMING">Programming</SelectItem>
                                        <SelectItem value="MARKETING">Marketing</SelectItem>
                                        <SelectItem value="AGROBUSINESS">Agrobusiness</SelectItem>
                                        <SelectItem value="ACCOUNTING">Accounting</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select 
                                    value={filters.type} 
                                    onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
                                >
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="FULL_TIME">Full-time</SelectItem>
                                        <SelectItem value="PART_TIME">Part-time</SelectItem>
                                        <SelectItem value="CONTRACT">Contract</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select 
                                    value={filters.status} 
                                    onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                                >
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DataTable 
                            columns={columns} 
                            data={paginatedJobs}
                            isLoading={loading}
                        />

                        <div className="py-4 border-t">
                            <PaginationControls
                                currentPage={currentPage}
                                pageCount={pageCount}
                                pageSize={pageSize}
                                totalItems={filteredJobs.length}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
    }

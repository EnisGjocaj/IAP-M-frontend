"use client"

import { useEffect, useMemo, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, RefreshCw, Search, Trash2, ThumbsDown, ThumbsUp, Pencil } from "lucide-react"
import { toast } from "react-toastify"

import {
  approveMaterial,
  deleteMaterial,
  getAllMaterialsAdmin,
  getAiSettings,
  indexMaterial,
  rejectMaterial,
  updateAiSettings,
  updateMaterial,
} from "../../../api/ai"

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
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Card, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog"
import { Label } from "../../../components/ui/label"
import { Switch } from "../../../components/ui/switch"

type OwnerUser = {
  id: number
  name: string
  surname: string
  email: string
  role: string
  isStudent: boolean
}

type AiMaterial = {
  id: number
  title: string
  status: "UPLOADED" | "SUBMITTED" | "APPROVED" | "REJECTED" | "ARCHIVED"
  isApproved: boolean
  indexStatus: "PENDING" | "INDEXING" | "INDEXED" | "FAILED"
  indexError?: string | null
  visibility: "PRIVATE" | "PUBLIC"
  createdAt: string
  ownerUser?: OwnerUser
}

const statusBadgeClass = (status: AiMaterial["status"]) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-800 border-green-200"
    case "SUBMITTED":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "UPLOADED":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "REJECTED":
      return "bg-red-100 text-red-800 border-red-200"
    case "ARCHIVED":
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const indexBadgeClass = (status: AiMaterial["indexStatus"]) => {
  switch (status) {
    case "INDEXED":
      return "bg-green-100 text-green-800 border-green-200"
    case "INDEXING":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "FAILED":
      return "bg-red-100 text-red-800 border-red-200"
    case "PENDING":
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function AdminAiMaterialsPage() {
  const [materials, setMaterials] = useState<AiMaterial[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"pending" | "approved" | "all">("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 10

  const [requireApproval, setRequireApproval] = useState(true)
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [settingsSaving, setSettingsSaving] = useState(false)

  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [activeRejectId, setActiveRejectId] = useState<number | null>(null)

  const [editOpen, setEditOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editVisibility, setEditVisibility] = useState<"PRIVATE" | "PUBLIC">("PRIVATE")

  const fetchMaterials = async (nextFilter = filter) => {
    try {
      setLoading(true)
      const response = await getAllMaterialsAdmin(nextFilter)
      const data = Array.isArray(response) ? response : response?.message || []

      const transformed = (data || []).map((m: any) => ({
        id: m.id,
        title: m.title,
        status: m.status,
        isApproved: m.isApproved,
        indexStatus: m.indexStatus,
        indexError: m.indexError,
        visibility: m.visibility,
        createdAt: m.createdAt,
        ownerUser: m.ownerUser,
      }))

      setMaterials(transformed)
    } catch (error) {
      toast.error("Failed to fetch AI materials")
      console.error("Error fetching admin materials:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMaterials()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setSettingsLoading(true)
        const data = await getAiSettings()
        setRequireApproval(Boolean((data as any)?.requireApproval))
      } catch (error) {
        toast.error("Failed to load AI settings")
        console.error("Error loading AI settings:", error)
      } finally {
        setSettingsLoading(false)
      }
    }

    loadSettings()
  }, [])

  useEffect(() => {
    setCurrentPage(0)
  }, [searchQuery, filter])

  const filteredMaterials = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return materials

    return materials.filter((m) => {
      const owner = m.ownerUser
      const ownerText = owner ? `${owner.name} ${owner.surname} ${owner.email}`.toLowerCase() : ""
      return m.title.toLowerCase().includes(q) || ownerText.includes(q) || String(m.id).includes(q)
    })
  }, [materials, searchQuery])

  const pageCount = Math.ceil(filteredMaterials.length / pageSize)
  const paginated = filteredMaterials.slice(currentPage * pageSize, (currentPage + 1) * pageSize)

  const handleToggleRequireApproval = async (nextValue: boolean) => {
    if (settingsLoading || settingsSaving) return
    const prev = requireApproval
    try {
      setSettingsSaving(true)
      setRequireApproval(nextValue)
      await updateAiSettings({ requireApproval: nextValue })
      toast.success("AI settings updated")
    } catch (error) {
      toast.error("Failed to update AI settings")
      console.error("Settings update error:", error)
      setRequireApproval(prev)
    } finally {
      setSettingsSaving(false)
    }
  }

  const handleApprove = async (id: number) => {
    try {
      await approveMaterial(id)
      toast.success("Material approved")
      await fetchMaterials()
    } catch (error) {
      toast.error("Failed to approve material")
      console.error("Approve error:", error)
    }
  }

  const openReject = (id: number) => {
    setActiveRejectId(id)
    setRejectReason("")
    setRejectOpen(true)
  }

  const confirmReject = async () => {
    if (!activeRejectId) return
    try {
      await rejectMaterial(activeRejectId, rejectReason || undefined)
      toast.success("Material rejected")
      setRejectOpen(false)
      setActiveRejectId(null)
      await fetchMaterials()
    } catch (error) {
      toast.error("Failed to reject material")
      console.error("Reject error:", error)
    }
  }

  const handleReindex = async (id: number) => {
    try {
      await indexMaterial(id)
      toast.success("Re-index started")
      await fetchMaterials()
    } catch (error) {
      toast.error("Failed to re-index")
      console.error("Index error:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this material? This cannot be undone.")) return
    try {
      await deleteMaterial(id)
      toast.success("Material deleted")
      await fetchMaterials()
    } catch (error) {
      toast.error("Failed to delete material")
      console.error("Delete error:", error)
    }
  }

  const openEdit = (m: AiMaterial) => {
    setEditId(m.id)
    setEditTitle(m.title)
    setEditVisibility(m.visibility)
    setEditOpen(true)
  }

  const confirmEdit = async () => {
    if (!editId) return
    try {
      await updateMaterial(editId, { title: editTitle, visibility: editVisibility })
      toast.success("Material updated")
      setEditOpen(false)
      setEditId(null)
      await fetchMaterials()
    } catch (error) {
      toast.error("Failed to update material")
      console.error("Update error:", error)
    }
  }

  const columns: ColumnDef<AiMaterial>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted/50 font-semibold text-muted-foreground"
        >
          Material
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
        </Button>
      ),
      cell: ({ row }) => {
        const m = row.original
        const owner = m.ownerUser
        return (
          <div className="min-w-0">
            <div className="font-medium text-foreground truncate">{m.title}</div>
            <div className="text-xs text-muted-foreground truncate">
              ID: {m.id}
              {owner ? ` · ${owner.name} ${owner.surname} (${owner.email})` : ""}
            </div>
          </div>
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
        const status = row.getValue("status") as AiMaterial["status"]
        return (
          <Badge variant="outline" className={`${statusBadgeClass(status)} px-2 py-0.5`}>
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "indexStatus",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted/50 font-semibold text-muted-foreground"
        >
          Index
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.getValue("indexStatus") as AiMaterial["indexStatus"]
        const m = row.original
        return (
          <div className="min-w-0">
            <Badge variant="outline" className={`${indexBadgeClass(status)} px-2 py-0.5`}>
              {status}
            </Badge>
            {status === "FAILED" && m.indexError && (
              <div className="mt-1 text-xs text-muted-foreground truncate" title={m.indexError}>
                {m.indexError}
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted/50 font-semibold text-muted-foreground"
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt") as string)
        return (
          <div className="flex flex-col">
            <div className="text-sm font-medium text-foreground">{date.toLocaleDateString()}</div>
            <div className="text-xs text-muted-foreground">{date.toLocaleTimeString()}</div>
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const m = row.original
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(m.id))}>
                Copy material ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openEdit(m)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit metadata
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleApprove(m.id)}>
                <ThumbsUp className="mr-2 h-4 w-4" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openReject(m.id)}>
                <ThumbsDown className="mr-2 h-4 w-4" />
                Reject
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleReindex(m.id)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Re-index
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(m.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
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
                <BreadcrumbPage className="font-semibold">AI Materials</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Materials Management</h1>
            <p className="text-muted-foreground mt-1">Approve, re-index, edit metadata, or delete AI materials</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <Card className="w-full sm:w-[420px]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="min-w-0 pr-4">
                  <CardTitle className="text-base">AI Material Approval</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Require admin approval before materials become usable by AI
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  {(settingsLoading || settingsSaving) && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {settingsLoading ? "Loading…" : "Saving…"}
                    </span>
                  )}
                  <Switch
                    checked={requireApproval}
                    disabled={settingsLoading || settingsSaving}
                    onCheckedChange={(v) => handleToggleRequireApproval(Boolean(v))}
                  />
                </div>
              </CardHeader>
            </Card>

            <Button variant="outline" className="shadow-sm bg-transparent" onClick={() => fetchMaterials()}>
              Refresh
            </Button>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-2 sm:p-4">
            <div className="flex flex-col gap-4 p-4 pb-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 min-w-[200px] w-full">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, owner, or id..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-muted/50 w-full"
                  />
                </div>
                <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full sm:w-auto">
                  <TabsList className="w-full sm:w-auto">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <DataTable columns={columns} data={paginated} isLoading={loading} />

            <div className="py-4 border-t">
              <PaginationControls
                currentPage={currentPage}
                pageCount={pageCount}
                pageSize={pageSize}
                totalItems={filteredMaterials.length}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Material</DialogTitle>
            <DialogDescription>Optionally provide a reason for rejection.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Reason (optional)</Label>
            <Input value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Reason..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmReject} className="bg-destructive hover:bg-destructive/90">
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Material Metadata</DialogTitle>
            <DialogDescription>Update title and visibility.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Visibility</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={editVisibility === "PRIVATE" ? "default" : "outline"}
                  onClick={() => setEditVisibility("PRIVATE")}
                >
                  Private
                </Button>
                <Button
                  type="button"
                  variant={editVisibility === "PUBLIC" ? "default" : "outline"}
                  onClick={() => setEditVisibility("PUBLIC")}
                >
                  Public
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

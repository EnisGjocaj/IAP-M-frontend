"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Plus, Eye, Search } from "lucide-react"
import { Link } from "react-router-dom"
import { getAllNews, deleteNews } from "../../../api/news"
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

type NewsArticle = {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
  status: "published" | "draft" | "archived"
  imageUrl?: string
  views?: number
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 10

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const response = await getAllNews()
      
      const newsData = response.data.message || []
      
      const transformedNews = newsData.map((article: any) => ({
        id: article.id,
        title: article.title,
        content: article.content || '',
        author: article.author || 'Unknown',
        createdAt: new Date(article.createdAt).toISOString(),
        status: article.status || 'draft',
        imageUrl: article.imageUrl || '/placeholder.svg',
        views: article.views || 0
      }))
      setNews(transformedNews)
    } catch (error) {
      toast.error('Failed to fetch news articles')
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNews = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteNews(id)
        toast.success('Article deleted successfully')
        fetchNews()
      } catch (error) {
        toast.error('Failed to delete article')
        console.error('Error deleting article:', error)
      }
    }
  }

  const filteredNews = news.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pageCount = Math.ceil(filteredNews.length / pageSize)
  const paginatedNews = filteredNews.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  )

  useEffect(() => {
    setCurrentPage(0)
  }, [searchQuery])

  const columns: ColumnDef<NewsArticle>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button 
            variant="ghost" 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-muted/50 font-semibold text-muted-foreground"
          >
            Article
            <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const article = row.original
        return (
          <div className="flex items-center space-x-3">
            <img
              src={article.imageUrl || "/placeholder.svg"}
              alt={article.title}
              width={80}
              height={60}
              className="rounded-lg object-cover bg-muted"
            />
            <div className="min-w-0 flex-1">
              <div className="font-medium text-foreground truncate">{article.title}</div>
              <div className="text-sm text-muted-foreground truncate">
                {article.content.substring(0, 100)}...
              </div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "author",
      header: ({ column }) => (
        <Button 
          variant="ghost" 
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted/50 font-semibold text-muted-foreground"
        >
          Author
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("author")}</div>,
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
            Published
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
        const statusColors = {
          published: "bg-green-100 text-green-800 border-green-200",
          draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
          archived: "bg-gray-100 text-gray-800 border-gray-200"
        }
        return (
          <Badge 
            variant="outline" 
            className={`${statusColors[status] || ''} px-2 py-0.5`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "views",
      header: ({ column }) => {
        return (
          <Button 
            variant="ghost" 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-muted/50 font-semibold text-muted-foreground"
          >
            Views
            <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const views = row.getValue("views") as number
        return (
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{views.toLocaleString()}</span>
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const article = row.original

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(article.id)}>
                Copy article ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={`/dashboard/news/${article.id}`}>View article</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={`/dashboard/news/${article.id}/edit`}>Edit article</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={`/dashboard/news/${article.id}/publish`}>Publish</Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => handleDeleteNews(article.id)}
              >
                Delete article
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
                <BreadcrumbPage className="font-semibold">News & Articles</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">News & Articles</h1>
            <p className="text-muted-foreground mt-1">Manage news articles and institute announcements</p>
          </div>
          <Link to="/dashboard/news/new">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Create Article
            </Button>
          </Link>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 pb-6">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-muted/50 w-full"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Published</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <span>Draft</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-gray-300" />
                  <span>Archived</span>
                </div>
              </div>
            </div>

            <DataTable 
              columns={columns} 
              data={paginatedNews} 
              isLoading={loading}
            />

            <div className="py-4 border-t">
              <PaginationControls
                currentPage={currentPage}
                pageCount={pageCount}
                pageSize={pageSize}
                totalItems={filteredNews.length}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

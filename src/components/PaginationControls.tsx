
import { 
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react"

import { Button } from "../components/ui/button"

export const PaginationControls = ({ 
    currentPage, 
    pageCount, 
    pageSize, 
    totalItems,
    setCurrentPage 
  }: { 
    currentPage: number
    pageCount: number
    pageSize: number
    totalItems: number
    setCurrentPage: (page: number) => void 
  }) => {
    const startItem = currentPage * pageSize + 1
    const endItem = Math.min((currentPage + 1) * pageSize, totalItems)
  
    return (
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Showing {startItem} to {endItem} of {totalItems} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage(0)}
            disabled={currentPage === 0}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            {[...Array(pageCount)].map((_, index) => (
              <Button
                key={index}
                variant={currentPage === index ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(index)}
              >
                {index + 1}
              </Button>
            )).slice(
              Math.max(0, currentPage - 2),
              Math.min(pageCount, currentPage + 3)
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === pageCount - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage(pageCount - 1)}
            disabled={currentPage === pageCount - 1}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }
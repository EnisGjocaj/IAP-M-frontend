import React from "react";
import { FileText, Eye, Lock, Globe, MoreVertical, Download, Trash2, Share2 } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

interface MaterialCardProps {
  id: string;
  title: string;
  type: "pdf" | "ppt" | "docx" | "xlsx";
  course: string;
  uploadedAt: string;
  visibility: "private" | "public";
  status: "approved" | "pending" | "rejected";
  size: string;
  onView?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
}

const typeColors = {
  pdf: "bg-destructive/10 text-destructive",
  ppt: "bg-warning/10 text-warning",
  docx: "bg-info/10 text-info",
  xlsx: "bg-success/10 text-success",
};

const statusColors = {
  approved: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

export const MaterialCard: React.FC<MaterialCardProps> = ({
  title,
  type,
  course,
  uploadedAt,
  visibility,
  status,
  size,
  onView,
  onDownload,
  onDelete,
}) => {
  return (
    <div className="ai-card border border-border p-4 hover:shadow-card-hover transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
          typeColors[type]
        )}>
          <FileText className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-medium text-foreground truncate">
                {title}
              </h4>
              <p className="text-sm text-muted-foreground mt-0.5">
                {course}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onView}>
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <Badge variant="outline" className={cn("text-xs", statusColors[status])}>
              {status}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {visibility === "private" ? (
                <><Lock className="w-3 h-3 mr-1" /> Private</>
              ) : (
                <><Globe className="w-3 h-3 mr-1" /> Public</>
              )}
            </Badge>
            <span className="text-xs text-muted-foreground ml-auto">
              {size} • {uploadedAt}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialCard;

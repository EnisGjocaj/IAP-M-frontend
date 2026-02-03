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
import { Card, CardContent } from "../../../components/ui/card";

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

const typeLabels = {
  pdf: "PDF",
  ppt: "PPT",
  docx: "DOC",
  xlsx: "XLS",
};

const statusStyles = {
  approved: "bg-green-50 text-green-600 border-green-200",
  pending: "bg-amber-50 text-amber-600 border-amber-200",
  rejected: "bg-red-50 text-red-600 border-red-200",
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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="font-medium text-sm text-foreground truncate">
                  {title}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {course}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0 h-7 w-7">
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
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {typeLabels[type]}
              </Badge>
              <Badge variant="outline" className={cn("text-xs", statusStyles[status])}>
                {status}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {visibility === "private" ? (
                  <><Lock className="w-3 h-3 mr-1" /> Private</>
                ) : (
                  <><Globe className="w-3 h-3 mr-1" /> Public</>
                )}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {size} • {uploadedAt}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialCard;

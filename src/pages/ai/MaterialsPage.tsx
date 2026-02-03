import React, { useState } from "react";
import { 
  Upload, 
  FolderOpen, 
  Search, 
  Filter, 
  Grid, 
  List,
  Plus,
  FileText,
  FileIcon,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { MaterialCard } from "../../components/ai/cards/MaterialCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Label } from "../../components/ui/label";
import { cn } from "../../lib/utils";

const sampleMaterials = [
  { id: "1", title: "Marketing Strategy Lecture 5", type: "pdf" as const, course: "Marketing Management", uploadedAt: "2 days ago", visibility: "private" as const, status: "approved" as const, size: "2.4 MB" },
  { id: "2", title: "Financial Accounting Slides", type: "ppt" as const, course: "Financial Accounting", uploadedAt: "1 week ago", visibility: "public" as const, status: "approved" as const, size: "5.1 MB" },
  { id: "3", title: "Statistics Practice Problems", type: "docx" as const, course: "Business Statistics", uploadedAt: "3 days ago", visibility: "private" as const, status: "pending" as const, size: "1.2 MB" },
  { id: "4", title: "Case Study Analysis Template", type: "xlsx" as const, course: "Business Strategy", uploadedAt: "5 days ago", visibility: "public" as const, status: "approved" as const, size: "800 KB" },
  { id: "5", title: "Economics Chapter 8 Notes", type: "pdf" as const, course: "Microeconomics", uploadedAt: "1 day ago", visibility: "private" as const, status: "approved" as const, size: "3.2 MB" },
  { id: "6", title: "Leadership Theory Summary", type: "docx" as const, course: "Organizational Behavior", uploadedAt: "4 days ago", visibility: "public" as const, status: "rejected" as const, size: "950 KB" },
];

export const MaterialsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const courses = ["all", "Marketing Management", "Financial Accounting", "Business Statistics", "Business Strategy", "Microeconomics", "Organizational Behavior"];

  const filteredMaterials = sampleMaterials.filter((material) => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = filterCourse === "all" || material.course === filterCourse;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Materials</h1>
          <p className="text-sm text-muted-foreground mt-1">Upload and manage your study materials</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload Material
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload Study Material</DialogTitle>
              <DialogDescription>
                Upload your study materials to make them available for AI queries.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                  dragOver 
                    ? "border-secondary bg-secondary/5" 
                    : "border-border hover:border-muted-foreground"
                )}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={() => setDragOver(false)}
              >
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground">
                  Drag and drop files here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-3">
                  Supported: PDF, PPT, DOCX, XLSX (Max 50MB)
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Course</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.slice(1).map((course) => (
                        <SelectItem key={course} value={course}>{course}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Visibility</Label>
                  <Select defaultValue="private">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setUploadDialogOpen(false)}>
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="my-materials">
        <TabsList>
          <TabsTrigger value="my-materials">
            My Materials
            <Badge variant="secondary" className="ml-2">{sampleMaterials.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="public">
            Public Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-materials" className="mt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterCourse} onValueChange={setFilterCourse}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.slice(1).map((course) => (
                  <SelectItem key={course} value={course}>{course}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex border border-border rounded-md overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="rounded-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="rounded-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className={cn(
            "grid gap-4",
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
              : "grid-cols-1"
          )}>
            {filteredMaterials.map((material) => (
              <MaterialCard key={material.id} {...material} />
            ))}
          </div>

          {filteredMaterials.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-medium text-foreground">No materials found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="public" className="mt-6">
          <div className="text-center py-12">
            <FileIcon className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-medium text-foreground">Public Library</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Browse materials shared by faculty and other students
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaterialsPage;

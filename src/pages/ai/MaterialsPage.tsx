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
import { PdfPreviewModal } from "../../components/ai/PdfPreviewModal";
import { deleteMaterial, getMyMaterials, getPublicMaterials, submitMaterialForApproval, updateMaterial, uploadMaterial } from "../../api/ai";
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
import { toast } from "react-toastify";

type AiMaterial = {
  id: number;
  title: string;
  courseName?: string | null;
  courseType?: string | null;
  materialType?: string;
  mimeType: string;
  sizeBytes: number;
  visibility: "PRIVATE" | "PUBLIC";
  status: "UPLOADED" | "SUBMITTED" | "APPROVED" | "REJECTED" | "ARCHIVED";
  isApproved: boolean;
  createdAt: string;
  cloudinaryUrl?: string | null;
};

const bytesToSize = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  const kb = bytes / 1024;
  return `${Math.max(1, Math.round(kb))} KB`;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString();
};

const statusToCardStatus = (m: AiMaterial): "approved" | "pending" | "rejected" => {
  if (m.status === "REJECTED") return "rejected";
  if (m.isApproved || m.status === "APPROVED") return "approved";
  return "pending";
};

const mimeToCardType = (mime: string): "pdf" | "ppt" | "docx" | "xlsx" => {
  if (mime.includes("pdf")) return "pdf";
  if (mime.includes("presentation") || mime.includes("powerpoint")) return "ppt";
  if (mime.includes("word")) return "docx";
  if (mime.includes("excel") || mime.includes("spreadsheet")) return "xlsx";
  return "pdf";
};

export const MaterialsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [activeTab, setActiveTab] = useState<"my-materials" | "public">("my-materials");
  const [myMaterials, setMyMaterials] = useState<AiMaterial[]>([]);
  const [publicMaterials, setPublicMaterials] = useState<AiMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState<string>("");
  const [uploadCourseName, setUploadCourseName] = useState<string>("");
  const [uploadVisibility, setUploadVisibility] = useState<"private" | "public">("private");
  const [isUploading, setIsUploading] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editMaterialId, setEditMaterialId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCourseName, setEditCourseName] = useState("");
  const [editVisibility, setEditVisibility] = useState<"private" | "public">("private");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string | null>(null);

  const courses = ["all", "Marketing Management", "Financial Accounting", "Business Statistics", "Business Strategy", "Microeconomics", "Organizational Behavior"];

  const loadMyMaterials = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = (await getMyMaterials()) as AiMaterial[];
      setMyMaterials(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || "Dështoi ngarkimi i materialeve");
    } finally {
      setIsLoading(false);
    }
  };

  const loadPublicMaterials = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = (await getPublicMaterials()) as AiMaterial[];
      setPublicMaterials(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || "Dështoi ngarkimi i materialeve publike");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadMyMaterials();
  }, []);

  React.useEffect(() => {
    if (activeTab === "public") {
      loadPublicMaterials();
    }
  }, [activeTab]);

  const onSelectFile = (file: File | null) => {
    if (!file) return;
    setError(null);
    if (file.type !== "application/pdf") {
      setError("Mbështeten vetëm materiale PDF.");
      return;
    }
    setSelectedFile(file);
    if (!uploadTitle) {
      setUploadTitle(file.name);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Ju lutem zgjidhni një skedar PDF për ta ngarkuar.");
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", uploadTitle || selectedFile.name);
      if (uploadCourseName && uploadCourseName !== "none") {
        formData.append("courseName", uploadCourseName);
      }
      formData.append("materialType", "PDF");
      formData.append("visibility", uploadVisibility.toUpperCase());

      await uploadMaterial(formData);

      setUploadDialogOpen(false);
      setSelectedFile(null);
      setUploadTitle("");
      setUploadCourseName("");
      setUploadVisibility("private");
      await loadMyMaterials();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Ngarkimi dështoi");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitForApproval = async (materialId: number) => {
    setError(null);
    try {
      await submitMaterialForApproval(materialId);
      toast.success("U dërgua për aprovim");
      await loadMyMaterials();
    } catch (e: any) {
      toast.error("Dështoi dërgimi për aprovim");
      setError(e?.response?.data?.message || e?.message || "Dështoi dërgimi për aprovim");
    }
  };

  const openEditDialog = (m: AiMaterial) => {
    setEditMaterialId(m.id);
    setEditTitle(m.title || "");
    setEditCourseName((m.courseName || m.courseType || "") as string);
    setEditVisibility(m.visibility === "PUBLIC" ? "public" : "private");
    setEditDialogOpen(true);
  };

  const handleDelete = async (materialId: number) => {
    setError(null);
    if (!window.confirm("Të fshihet ky material? Ky veprim nuk mund të zhbëhet.")) return;
    try {
      await deleteMaterial(materialId);
      toast.success("Materiali u fshi");
      await loadMyMaterials();
    } catch (e: any) {
      toast.error("Dështoi fshirja e materialit");
      setError(e?.response?.data?.message || e?.message || "Fshirja dështoi");
    }
  };

  const handleSaveEdit = async () => {
    if (!editMaterialId) return;
    setIsSavingEdit(true);
    setError(null);
    try {
      await updateMaterial(editMaterialId, {
        title: editTitle,
        visibility: editVisibility.toUpperCase(),
        courseName: editCourseName && editCourseName !== "none" ? editCourseName : null,
      });
      toast.success("Materiali u përditësua");
      setEditDialogOpen(false);
      setEditMaterialId(null);
      await loadMyMaterials();
    } catch (e: any) {
      toast.error("Dështoi përditësimi i materialit");
      setError(e?.response?.data?.message || e?.message || "Përditësimi dështoi");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const sourceList = activeTab === "public" ? publicMaterials : myMaterials;
  const filteredMaterials = sourceList.filter((material) => {
    const course = material.courseName || material.courseType || "";
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = filterCourse === "all" || course === filterCourse;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="space-y-6">
      <PdfPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        url={previewUrl}
        title={previewTitle}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Materialet</h1>
          <p className="text-sm text-muted-foreground mt-1">Ngarkoni dhe menaxhoni materialet tuaja të studimit</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Ngarko material
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Ngarko material studimi</DialogTitle>
              <DialogDescription>
                Ngarkoni materialet tuaja të studimit që të jenë të disponueshme për pyetje te AI.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                id="ai-material-file"
                onChange={(e) => onSelectFile(e.target.files?.[0] || null)}
              />
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                  dragOver 
                    ? "border-secondary bg-secondary/5" 
                    : "border-border hover:border-muted-foreground"
                )}
                onClick={() => {
                  const el = document.getElementById("ai-material-file") as HTMLInputElement | null;
                  el?.click();
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const f = e.dataTransfer.files?.[0] || null;
                  onSelectFile(f);
                }}
              >
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground">
                  Zvarrit dhe lësho skedarët këtu
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ose kliko për të zgjedhur
                </p>
                <p className="text-xs text-muted-foreground mt-3">
                  Mbështetur: PDF (maks. 25MB)
                </p>
                {selectedFile && (
                  <p className="text-xs text-muted-foreground mt-3">
                    I zgjedhur: <span className="text-foreground">{selectedFile.name}</span>
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Lënda (opsionale)</Label>
                  <Select value={uploadCourseName} onValueChange={setUploadCourseName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Asnjë" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Asnjë</SelectItem>
                      {courses.slice(1).map((course) => (
                        <SelectItem key={course} value={course}>{course}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Dukshmëria</Label>
                  <Select value={uploadVisibility} onValueChange={(v: any) => setUploadVisibility(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Privat</SelectItem>
                      <SelectItem value="public">Publik</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Titulli</Label>
                <Input
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Titull opsional"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Anulo
              </Button>
              <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
                {isUploading ? "Duke u ngarkuar..." : "Ngarko"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs
        defaultValue="my-materials"
        onValueChange={(v) => setActiveTab(v as "my-materials" | "public")}
      >
        <TabsList>
          <TabsTrigger value="my-materials">
            Materialet e mia
            <Badge variant="secondary" className="ml-2">{myMaterials.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="public">
            Biblioteka publike
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-materials" className="mt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Kërko materiale..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterCourse} onValueChange={setFilterCourse}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtro sipas lëndës" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Të gjitha lëndët</SelectItem>
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

          {isLoading && (
            <p className="text-sm text-muted-foreground">Po ngarkohet...</p>
          )}
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className={cn(
            "grid gap-4",
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
              : "grid-cols-1"
          )}>
            {filteredMaterials.map((material) => {
              const cardStatus = statusToCardStatus(material);
              const canSubmit = cardStatus === "pending" && material.status === "UPLOADED";
              const card = (
                <MaterialCard
                  key={material.id}
                  id={String(material.id)}
                  title={material.title}
                  type={mimeToCardType(material.mimeType)}
                  course={(material.courseName || material.courseType || "").toString() || "—"}
                  uploadedAt={formatDate(material.createdAt) || ""}
                  visibility={material.visibility === "PUBLIC" ? "public" : "private"}
                  status={cardStatus}
                  size={bytesToSize(material.sizeBytes)}
                  onView={() => {
                    if (!material.cloudinaryUrl) {
                      toast.error("Nuk ka parapamje për këtë material");
                      return;
                    }
                    setPreviewUrl(String(material.cloudinaryUrl));
                    setPreviewTitle(material.title || "Parapamje PDF");
                    setPreviewOpen(true);
                  }}
                  onDownload={() => {
                    if (material.cloudinaryUrl) window.open(material.cloudinaryUrl, "_blank");
                  }}
                  onEdit={() => openEditDialog(material)}
                  onDelete={() => {
                    handleDelete(material.id);
                  }}
                />
              );

              if (!canSubmit) return card;

              return (
                <div key={material.id} className="space-y-2">
                  {card}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleSubmitForApproval(material.id)}
                  >
                    Dërgo për aprovim
                  </Button>
                </div>
              );
            })}
          </div>

          {filteredMaterials.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-medium text-foreground">Nuk u gjetën materiale</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Provoni të ndryshoni kërkimin ose filtrat
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="public" className="mt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Kërko materiale..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterCourse} onValueChange={setFilterCourse}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtro sipas lëndës" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Të gjitha lëndët</SelectItem>
                {courses.slice(1).map((course) => (
                  <SelectItem key={course} value={course}>{course}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading && (
            <p className="text-sm text-muted-foreground">Po ngarkohet...</p>
          )}
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className={cn(
            "grid gap-4",
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
              : "grid-cols-1"
          )}>
            {filteredMaterials.map((material) => (
              <MaterialCard
                key={material.id}
                id={String(material.id)}
                title={material.title}
                type={mimeToCardType(material.mimeType)}
                course={(material.courseName || material.courseType || "").toString() || "—"}
                uploadedAt={formatDate(material.createdAt) || ""}
                visibility={material.visibility === "PUBLIC" ? "public" : "private"}
                status={statusToCardStatus(material)}
                size={bytesToSize(material.sizeBytes)}
                onView={() => {
                  if (!material.cloudinaryUrl) {
                    toast.error("Nuk ka parapamje për këtë material");
                    return;
                  }
                  setPreviewUrl(String(material.cloudinaryUrl));
                  setPreviewTitle(material.title || "Parapamje PDF");
                  setPreviewOpen(true);
                }}
                onDownload={() => {
                  if (material.cloudinaryUrl) window.open(material.cloudinaryUrl, "_blank");
                }}
                onDelete={() => {
                  toast.info("Mund të fshini vetëm materialet që janë tuajat.");
                }}
              />
            ))}
          </div>

          {!isLoading && filteredMaterials.length === 0 && (
            <div className="text-center py-12">
              <FileIcon className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-medium text-foreground">Biblioteka publike</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Nuk u gjetën materiale publike.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ndrysho materialin</DialogTitle>
            <DialogDescription>Përditësoni të dhënat për materialin tuaj të ngarkuar.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Titulli</Label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lënda (opsionale)</Label>
                <Select value={editCourseName} onValueChange={setEditCourseName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Asnjë" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Asnjë</SelectItem>
                    {courses.slice(1).map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Dukshmëria</Label>
                <Select value={editVisibility} onValueChange={(v: any) => setEditVisibility(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Privat</SelectItem>
                    <SelectItem value="public">Publik</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Anulo
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSavingEdit}>
              {isSavingEdit ? "Duke ruajtur..." : "Ruaj"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaterialsPage;

import React, { useState } from "react";
import { 
  FileText, 
  Copy, 
  Download,
  RefreshCw,
  CheckCircle,
  Plus,
  History,
  BookOpen,
  ListChecks,
  MessageSquare,
  FileSearch,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { cn } from "../../lib/utils";
import { getAiConversation, getMyMaterials, listAiConversations, summarizeMaterialSaved } from "../../api/ai";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";

type AiMaterial = {
  id: number;
  title: string;
  courseName?: string | null;
  courseType?: string | null;
  isApproved: boolean;
};

type ConversationListItem = {
  id: number;
  title: string;
  type: "CHAT" | "SUMMARY" | "EXAM";
  createdAt: string;
  updatedAt: string;
};

const summaryTypes = [
  { id: "bullet", name: "Bullet Points", description: "Key points" },
  { id: "paragraph", name: "Paragraph", description: "Narrative" },
  { id: "study-guide", name: "Study Guide", description: "Exam-ready" },
  { id: "key-terms", name: "Key Terms", description: "Vocabulary" },
];

export const SummarizePage: React.FC = () => {
  const [materials, setMaterials] = useState<AiMaterial[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [summaryType, setSummaryType] = useState<string>("bullet");
  const [summary, setSummary] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [customInstructions, setCustomInstructions] = useState("");

  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const load = async () => {
      setError(null);
      try {
        const data = (await getMyMaterials()) as any[];
        const list = Array.isArray(data) ? (data as AiMaterial[]) : [];
        const approved = list.filter((m) => m.isApproved);
        setMaterials(approved);
      } catch (e: any) {
        setError(e?.message || "Failed to load materials");
      }
    };

    load();
  }, []);

  React.useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = (await listAiConversations()) as any[];
        const list = Array.isArray(data) ? (data as ConversationListItem[]) : [];
        setConversations(list.filter((c) => c.type === "SUMMARY"));
      } catch {
        // ignore
      }
    };

    loadConversations();
  }, []);

  const mapSummaryTypeToBackendStyle = (t: string): "bullet" | "short" | "detailed" => {
    if (t === "bullet") return "bullet";
    if (t === "paragraph") return "short";
    if (t === "study-guide") return "detailed";
    if (t === "key-terms") return "bullet";
    return "bullet";
  };

  const refreshConversations = async () => {
    try {
      const data = (await listAiConversations()) as any[];
      const list = Array.isArray(data) ? (data as ConversationListItem[]) : [];
      setConversations(list.filter((c) => c.type === "SUMMARY"));
    } catch {
      // ignore
    }
  };

  const openConversation = async (id: number) => {
    setError(null);
    try {
      const convo = (await getAiConversation(id)) as any;
      setActiveConversationId(convo?.id || id);
      const msgs = Array.isArray(convo?.messages) ? convo.messages : [];
      const lastAssistant = [...msgs].reverse().find((m: any) => String(m.role).toUpperCase() === "ASSISTANT");
      setSummary(lastAssistant?.content || "");

      const materialId = typeof convo?.materialId === "number" ? convo.materialId : null;
      if (materialId !== null) {
        setSelectedMaterial(String(materialId));
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to load summary");
    }
  };

  const handleNewSummary = () => {
    setActiveConversationId(null);
    setSummary("");
    setError(null);
  };

  const handleGenerate = async () => {
    const materialId = Number(selectedMaterial);
    if (Number.isNaN(materialId)) {
      setError("Please select a material.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const res = (await summarizeMaterialSaved({
        materialIds: [materialId],
        style: mapSummaryTypeToBackendStyle(summaryType),
        conversationId: activeConversationId || undefined,
      })) as any;
      setSummary(res?.summary || "");

      if (typeof res?.conversationId === "number") {
        setActiveConversationId(res.conversationId);
      }

      refreshConversations();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to generate summary");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Summarize</h1>
        <p className="text-sm text-muted-foreground mt-1">Generate summaries of your study materials</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <History className="w-4 h-4" />
                History
              </CardTitle>
              <Button variant="outline" size="sm" onClick={handleNewSummary}>
                <Plus className="w-4 h-4 mr-1" />
                New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {conversations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No summaries yet.</p>
            ) : (
              <div className="space-y-2">
                {conversations.slice(0, 12).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => openConversation(Number(c.id))}
                    className={cn(
                      "w-full text-left rounded-md border px-3 py-2 text-sm transition-colors",
                      activeConversationId === c.id ? "bg-muted" : "hover:bg-muted/50"
                    )}
                  >
                    <div className="font-medium text-foreground truncate">{c.title}</div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {new Date(c.updatedAt).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-1">
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Select Material</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a material" />
                </SelectTrigger>
                <SelectContent>
                  {materials.map((material) => (
                    <SelectItem key={material.id} value={String(material.id)}>
                      {material.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Summary Format</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {summaryTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSummaryType(type.id)}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-colors",
                      summaryType === type.id
                        ? "border-secondary bg-secondary/5"
                        : "border-border hover:border-muted-foreground"
                    )}
                  >
                    <p className="text-sm font-medium text-foreground">{type.name}</p>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Custom Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Add specific instructions (optional)"
                className="min-h-[80px] resize-none text-sm"
              />
            </CardContent>
          </Card>

          <Button
            className="w-full"
            onClick={handleGenerate}
            disabled={!selectedMaterial || isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              "Generate Summary"
            )}
          </Button>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <Card className="lg:col-span-2 h-fit">
          {summary ? (
            <>
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-foreground">Summary Generated</span>
                  <Badge variant="outline" className="text-xs">
                    {summaryTypes.find(t => t.id === summaryType)?.name}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleGenerate}>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Regenerate
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-[500px] p-6">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {summary}
                  </div>
                </div>
              </ScrollArea>
            </>
          ) : (
            <CardContent className="flex items-center justify-center py-24">
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground">No Summary Yet</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                  Select a material and click "Generate Summary" to create a summary.
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SummarizePage;

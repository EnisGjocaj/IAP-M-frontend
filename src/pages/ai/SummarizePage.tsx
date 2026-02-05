import React, { useState } from "react";
import { 
  FileText, 
  Copy, 
  Download,
  RefreshCw,
  CheckCircle,
  Plus,
  History,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { cn } from "../../lib/utils";
import { getAiChunk, getAiConversation, getMyMaterials, listAiConversations, summarizeMaterialSaved } from "../../api/ai";
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
import { ReferencePreviewModal } from "../../components/ai/ReferencePreviewModal";
import { AIPdfDownloadButton } from "../../components/ai/pdf/AIPdfDownloadButton";
import { IapmAIDocument } from "../../components/ai/pdf/IapmAIDocument";

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
  { id: "bullet", name: "Pika", description: "Pikat kryesore" },
  { id: "paragraph", name: "Paragraf", description: "Rrëfim" },
  { id: "study-guide", name: "Udhëzues Studimi", description: "Gati për provim" },
  { id: "key-terms", name: "Terma kyç", description: "Fjalor" },
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
  const [activeConversationTitle, setActiveConversationTitle] = useState<string | null>(null);

  const [activeReferences, setActiveReferences] = useState<
    Array<{
      sourceNo: number;
      chunkId: number;
      materialTitle: string;
      pageStart: number | null;
      pageEnd: number | null;
    }>
  >([]);

  const [refOpen, setRefOpen] = useState(false);
  const [refTitle, setRefTitle] = useState<string | null>(null);
  const [refUrl, setRefUrl] = useState<string | null>(null);
  const [refPage, setRefPage] = useState<number | null>(null);
  const [refText, setRefText] = useState<string | null>(null);

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
        setError(e?.message || "Dështoi ngarkimi i materialeve");
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
      setActiveConversationTitle(convo?.title || null);
      const msgs = Array.isArray(convo?.messages) ? convo.messages : [];
      const lastAssistant = [...msgs].reverse().find((m: any) => String(m.role).toUpperCase() === "ASSISTANT");
      setSummary(lastAssistant?.content || "");
      setActiveReferences(Array.isArray(lastAssistant?.references) ? lastAssistant.references : []);

      const materialId = typeof convo?.materialId === "number" ? convo.materialId : null;
      if (materialId !== null) {
        setSelectedMaterial(String(materialId));
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Dështoi ngarkimi i përmbledhjes");
    }
  };

  const handleNewSummary = () => {
    setActiveConversationId(null);
    setActiveConversationTitle(null);
    setSummary("");
    setActiveReferences([]);
    setError(null);
  };

  const openReference = async (chunkId: number, pageStart: number | null) => {
    try {
      const chunk = (await getAiChunk(chunkId)) as any;
      const title = chunk?.material?.title || "Referencë";
      const url = chunk?.material?.cloudinaryUrl || null;
      setRefTitle(title);
      setRefUrl(url);
      setRefPage(pageStart ?? chunk?.pageStart ?? null);
      setRefText(chunk?.text || null);
      setRefOpen(true);
    } catch {
      // ignore
    }
  };

  const handleGenerate = async () => {
    const materialId = Number(selectedMaterial);
    if (Number.isNaN(materialId)) {
      setError("Ju lutem zgjidhni një material.");
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

      setActiveConversationTitle((res as any)?.title || activeConversationTitle);
      setActiveReferences(Array.isArray(res?.references) ? res.references : []);

      refreshConversations();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Dështoi gjenerimi i përmbledhjes");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
  };

  const logoSrc = typeof window !== "undefined" ? `${window.location.origin}/iap-m-logo.jpg` : undefined;
  const fileSafeTitle = (activeConversationTitle || "Përmbledhje").replace(/[^a-z0-9\-_ ]/gi, "");
  const fileName = `IAPM_${fileSafeTitle.replace(/\s+/g, "_")}.pdf`;

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">

      <ReferencePreviewModal
        open={refOpen}
        onOpenChange={setRefOpen}
        title={refTitle}
        url={refUrl}
        page={refPage}
        excerpt={refText}
      />

      <Card className="w-[280px] hidden lg:flex flex-col overflow-hidden">
        <CardContent className="p-3 flex flex-col gap-2">
          <Button variant="outline" size="sm" onClick={handleNewSummary}>
            <Plus className="w-4 h-4 mr-2" />
            Përmbledhje e re
          </Button>
          <div className="text-xs text-muted-foreground mt-1">Historik</div>
          <ScrollArea className="flex-1 pr-2">
            <div className="space-y-1">
              {conversations.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">Ende s’ka përmbledhje.</p>
              ) : (
                conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => openConversation(Number(c.id))}
                    className={cn(
                      "w-full text-left rounded-md border px-2 py-2 text-sm transition-colors",
                      activeConversationId === c.id ? "bg-muted" : "hover:bg-muted/50"
                    )}
                  >
                    <div className="font-medium text-foreground truncate">{c.title}</div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {new Date(c.updatedAt).toLocaleDateString()}
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="flex-1 flex flex-col">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Përmbledhje</h1>
            <p className="text-sm text-muted-foreground mt-1">Gjeneroni përmbledhje të materialeve tuaja të studimit</p>
          </div>
          <div className="flex gap-2">
            <AIPdfDownloadButton
              document={
                <IapmAIDocument
                  title={activeConversationTitle || "Përmbledhje"}
                  subtitle={selectedMaterial ? `Materiali #${selectedMaterial}` : null}
                  generatedAt={new Date()}
                  logoSrc={logoSrc}
                  sections={[{ title: "Përmbledhje", content: summary || "" }]}
                  references={activeReferences.map((r) => ({
                    sourceNo: r.sourceNo,
                    chunkId: r.chunkId,
                    materialTitle: r.materialTitle,
                    pageStart: r.pageStart,
                    pageEnd: r.pageEnd,
                  }))}
                />
              }
              fileName={fileName}
              disabled={!summary}
            >
              <Download className="w-4 h-4 mr-2" />
              Eksporto PDF
            </AIPdfDownloadButton>
            <Button variant="outline" size="sm" onClick={handleNewSummary}>
              <Plus className="w-4 h-4 mr-2" />
              I ri
            </Button>
          </div>
        </div>

        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label>Materiali</Label>
                <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                  <SelectTrigger>
                    <SelectValue placeholder="Zgjidh një material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((material) => (
                      <SelectItem key={material.id} value={String(material.id)}>
                        {material.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Formati i përmbledhjes</Label>
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
              </div>

              <div className="space-y-2">
                <Label>Udhëzime të personalizuara</Label>
                <Textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="Shto udhëzime specifike (opsionale)"
                  className="min-h-[44px] max-h-28 resize-none text-sm"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
              <Button
                onClick={handleGenerate}
                disabled={!selectedMaterial || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    Duke gjeneruar...
                  </>
                ) : (
                  "Gjenero përmbledhje"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 overflow-hidden flex flex-col">
          {summary ? (
            <>
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-foreground">Përmbledhje</span>
                  <Badge variant="outline" className="text-xs">
                    {summaryTypes.find(t => t.id === summaryType)?.name}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    <Copy className="w-4 h-4 mr-1" />
                    Kopjo
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleGenerate}>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Rigjenero
                  </Button>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 xl:grid-cols-3">
                <ScrollArea className="xl:col-span-2 p-6">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                      {summary}
                    </div>
                  </div>
                </ScrollArea>

                <div className="border-t xl:border-t-0 xl:border-l border-border p-4">
                  <div className="text-sm font-medium text-foreground mb-2">Referencat</div>
                  {activeReferences.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nuk ka referenca.</p>
                  ) : (
                    <div className="space-y-2">
                      {activeReferences.map((r) => (
                        <button
                          key={`${r.sourceNo}-${r.chunkId}`}
                          onClick={() => openReference(r.chunkId, r.pageStart)}
                          className="w-full text-left rounded-md border px-3 py-2 text-sm hover:bg-muted/50"
                        >
                          <div className="font-medium text-foreground truncate">
                            Burimi {r.sourceNo}: {r.materialTitle}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate">
                            {r.pageStart && r.pageEnd
                              ? `Faqet ${r.pageStart}–${r.pageEnd}`
                              : r.pageStart
                                ? `Faqja ${r.pageStart}`
                                : "Intervali i faqeve nuk është i disponueshëm"}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex items-center justify-center py-24">
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground">Ende s’ka përmbledhje</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                  Zgjidhni një material dhe klikoni "Gjenero përmbledhje" për të krijuar një përmbledhje.
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

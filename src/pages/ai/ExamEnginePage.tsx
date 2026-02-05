import React, { useState } from "react";
import { 
  Play, 
  RotateCcw,
  Download,
  History,
  Plus,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { generateExamSaved, getAiChunk, getAiConversation, getMyMaterials, listAiConversations } from "../../api/ai";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Slider } from "../../components/ui/slider";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
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

const examTypes = [
  { id: "multiple-choice", name: "Me alternativa", description: "Test me alternativa" },
  { id: "case-study", name: "Studim rasti", description: "Analizo skenarë" },
  { id: "short-answer", name: "Përgjigje e shkurtër", description: "Përgjigje të shkurtra" },
  { id: "oral-prep", name: "Përgatitje për provim oral", description: "Praktikë verbale" },
];


export const ExamEnginePage: React.FC = () => {
  const [materials, setMaterials] = useState<AiMaterial[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("multiple-choice");
  const [questionCount, setQuestionCount] = useState([10]);
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const [examText, setExamText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [activeReferences, setActiveReferences] = useState<
    Array<{
      sourceNo: number;
      chunkId: number;
      materialTitle: string;
      pageStart: number | null;
      pageEnd: number | null;
    }>
  >([]);

  const [examConversations, setExamConversations] = useState<any[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);

  const [refOpen, setRefOpen] = useState(false);
  const [refTitle, setRefTitle] = useState<string | null>(null);
  const [refUrl, setRefUrl] = useState<string | null>(null);
  const [refPage, setRefPage] = useState<number | null>(null);
  const [refText, setRefText] = useState<string | null>(null);

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
    const loadHistory = async () => {
      try {
        const convos = (await listAiConversations()) as any[];
        const list = Array.isArray(convos) ? convos : [];
        setExamConversations(list.filter((c) => c.type === "EXAM"));
      } catch {
        // ignore
      }
    };

    loadHistory();
  }, []);

  const refreshHistory = async () => {
    try {
      const convos = (await listAiConversations()) as any[];
      const list = Array.isArray(convos) ? convos : [];
      setExamConversations(list.filter((c) => c.type === "EXAM"));
    } catch {
      // ignore
    }
  };

  const openExamConversation = async (id: number) => {
    setError(null);
    try {
      const convo = (await getAiConversation(id)) as any;
      setActiveConversationId(convo?.id || id);
      const msgs = Array.isArray(convo?.messages) ? convo.messages : [];
      const lastAssistant = [...msgs].reverse().find((m: any) => String(m.role).toUpperCase() === "ASSISTANT");
      setExamText(lastAssistant?.content || "");
      setActiveReferences(Array.isArray(lastAssistant?.references) ? lastAssistant.references : []);
      setShowExam(true);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Dështoi ngarkimi i provimit");
    }
  };

  const handleNewExam = () => {
    setActiveConversationId(null);
    setExamText("");
    setActiveReferences([]);
    setShowExam(false);
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

  const splitExamSections = (text: string) => {
    const normalized = String(text || "");
    const lines = normalized.split(/\r?\n/);

    const findIndex = (re: RegExp) => lines.findIndex((l) => re.test(l.trim()));
    const qIdx = findIndex(/^(questions|exam questions)\b/i);
    const aIdx = findIndex(/^(answers|answer key)\b/i);
    const rIdx = findIndex(/^(references|sources)\b/i);

    const slice = (start: number, end: number) =>
      start >= 0 ? lines.slice(start + 1, end >= 0 ? end : undefined).join("\n").trim() : "";

    if (qIdx >= 0 || aIdx >= 0 || rIdx >= 0) {
      const starts = [qIdx, aIdx, rIdx].filter((n) => n >= 0).sort((x, y) => x - y);
      const nextOf = (idx: number) => {
        const after = starts.find((s) => s > idx);
        return typeof after === "number" ? after : -1;
      };

      return {
        questions: slice(qIdx, nextOf(qIdx)),
        answers: slice(aIdx, nextOf(aIdx)),
        references: slice(rIdx, nextOf(rIdx)),
        raw: normalized.trim(),
      };
    }

    return { questions: normalized.trim(), answers: "", references: "", raw: normalized.trim() };
  };

  const logoSrc = typeof window !== "undefined" ? `${window.location.origin}/iap-m-logo.jpg` : undefined;
  const fileSafeTitle = (activeConversationId ? `Provim_${activeConversationId}` : "Provim").replace(/[^a-z0-9\-_ ]/gi, "");
  const fileName = `IAPM_${fileSafeTitle.replace(/\s+/g, "_")}.pdf`;

  const handleGenerate = async () => {
    const materialId = Number(selectedMaterial);
    if (Number.isNaN(materialId)) {
      setError("Ju lutem zgjidhni një material.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const res = (await generateExamSaved({
        materialIds: [materialId],
        count: questionCount[0],
        conversationId: activeConversationId || undefined,
      })) as any;
      setExamText(res?.exam || "");
      setShowExam(true);
      if (typeof res?.conversationId === "number") {
        setActiveConversationId(res.conversationId);
      }
      setActiveReferences(Array.isArray(res?.references) ? res.references : []);
      refreshHistory();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Dështoi gjenerimi i provimit");
    } finally {
      setIsGenerating(false);
    }
  };

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

      <Card className="w-[280px] hidden lg:flex flex-col overflow-hidden shrink-0">
        <CardContent className="p-3 flex flex-col gap-2 min-h-0">
          <Button variant="outline" size="sm" onClick={handleNewExam}>
            <Plus className="w-4 h-4 mr-2" />
            Provim i ri
          </Button>
          <div className="text-xs text-muted-foreground mt-1">Historik</div>
          <div className="space-y-1 flex-1 min-h-0 overflow-auto pr-2">
            {examConversations.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">Ende s’ka provime.</p>
            ) : (
              examConversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => openExamConversation(Number(c.id))}
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
        </CardContent>
      </Card>

      <div className="flex-1 min-w-0 flex flex-col min-h-0">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Motori i Provimeve</h1>
            <p className="text-sm text-muted-foreground mt-1">Gjeneroni provime praktike nga materialet tuaja të studimit</p>
          </div>
          <div className="flex gap-2">
            <AIPdfDownloadButton
              document={
                <IapmAIDocument
                  title="Provim"
                  subtitle={activeConversationId ? `Biseda #${activeConversationId}` : null}
                  generatedAt={new Date()}
                  logoSrc={logoSrc}
                  sections={(() => {
                    const s = splitExamSections(examText);
                    return [
                      { title: "Pyetjet", content: s.questions || s.raw || "" },
                      ...(s.answers ? [{ title: "Përgjigjet", content: s.answers }] : []),
                    ];
                  })()}
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
              disabled={!examText}
            >
              <Download className="w-4 h-4 mr-2" />
              Eksporto PDF
            </AIPdfDownloadButton>
            <Button variant="outline" size="sm" onClick={handleNewExam}>
              <Plus className="w-4 h-4 mr-2" />
              I ri
            </Button>
          </div>
        </div>

        {!showExam ? (
          <Card className="flex-1 min-h-0 overflow-auto">
            <CardHeader>
              <CardTitle className="text-base font-medium">Krijo provim praktik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Materiali</Label>
                <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                  <SelectTrigger>
                    <SelectValue placeholder="Zgjidh një material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((m) => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {m.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Lloji i provimit</Label>
                <div className="grid grid-cols-2 gap-3">
                  {examTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={cn(
                        "p-3 rounded-lg border text-left transition-colors",
                        selectedType === type.id
                          ? "border-secondary bg-secondary/5"
                          : "border-border hover:border-muted-foreground"
                      )}
                    >
                      <p className="font-medium text-sm text-foreground">{type.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Numri i pyetjeve</Label>
                  <span className="text-sm font-medium text-foreground">{questionCount[0]}</span>
                </div>
                <Slider
                  value={questionCount}
                  onValueChange={setQuestionCount}
                  min={5}
                  max={50}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Niveli i vështirësisë</Label>
                <div className="flex gap-2">
                  {["easy", "medium", "hard"].map((level) => (
                    <Button
                      key={level}
                      variant={difficulty === level ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setDifficulty(level)}
                      className="flex-1 capitalize"
                    >
                      {level === "easy" ? "lehtë" : level === "medium" ? "mesatare" : "vështirë"}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleGenerate}
                disabled={!selectedMaterial || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin mr-2" />
                    Duke gjeneruar...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Gjenero provim praktik
                  </>
                )}
              </Button>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="flex-1 min-h-0 flex flex-col">
            <div className="p-4 bg-muted/50 border-b border-border">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">Provim i gjeneruar</span>
                  <span className="text-[11px] text-muted-foreground">
                    {activeConversationId ? `Biseda #${activeConversationId}` : ""}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(examText);
                    }}
                    disabled={!examText}
                  >
                    Kopjo
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-3">
              <div className="xl:col-span-2 min-h-0 overflow-auto p-6">
                {examText ? (
                  (() => {
                    const sections = splitExamSections(examText);
                    return (
                      <div className="space-y-4">
                        <Card>
                          <CardHeader className="py-4">
                            <CardTitle className="text-sm font-medium">Pyetjet</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                              {sections.questions || sections.raw}
                            </div>
                          </CardContent>
                        </Card>

                        {sections.answers ? (
                          <Card>
                            <CardHeader className="py-4">
                              <CardTitle className="text-sm font-medium">Përgjigjet</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                                {sections.answers}
                              </div>
                            </CardContent>
                          </Card>
                        ) : null}
                      </div>
                    );
                  })()
                ) : (
                  <p className="text-sm text-muted-foreground">Nuk u gjenerua asnjë provim.</p>
                )}
              </div>

              <div className="border-t xl:border-t-0 xl:border-l border-border min-h-0 flex flex-col">
                <div className="p-4 border-b border-border/60">
                  <div className="text-sm font-medium text-foreground">Referencat</div>
                </div>
                <div className="flex-1 min-h-0 overflow-auto p-4">
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
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ExamEnginePage;

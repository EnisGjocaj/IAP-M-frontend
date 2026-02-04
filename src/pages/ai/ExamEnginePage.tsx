import React, { useState } from "react";
import { 
  GraduationCap, 
  Play, 
  Clock,
  Target,
  RotateCcw,
  CheckCircle,
  BookOpen,
  Download,
  History,
  Plus,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
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
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ReferencePreviewModal } from "../../components/ai/ReferencePreviewModal";

type AiMaterial = {
  id: number;
  title: string;
  courseName?: string | null;
  courseType?: string | null;
  isApproved: boolean;
};

const examTypes = [
  { id: "multiple-choice", name: "Multiple Choice", description: "Test with MCQs" },
  { id: "case-study", name: "Case Study", description: "Analyze scenarios" },
  { id: "short-answer", name: "Short Answer", description: "Brief responses" },
  { id: "oral-prep", name: "Oral Exam Prep", description: "Verbal practice" },
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
        setError(e?.message || "Failed to load materials");
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
      setError(e?.response?.data?.message || e?.message || "Failed to load exam");
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
      const title = chunk?.material?.title || "Reference";
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

  const handleGenerate = async () => {
    const materialId = Number(selectedMaterial);
    if (Number.isNaN(materialId)) {
      setError("Please select a material.");
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
      setError(e?.response?.data?.message || e?.message || "Failed to generate exam");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Exam Engine</h1>
          <p className="text-sm text-muted-foreground mt-1">Generate practice exams from your study materials</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleNewExam}>
            <Plus className="w-4 h-4 mr-2" />
            New Exam
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <History className="w-4 h-4" />
              History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {examConversations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No exams yet.</p>
            ) : (
              <div className="space-y-2">
                {examConversations.slice(0, 12).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => openExamConversation(Number(c.id))}
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

        {!showExam ? (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-base font-medium">Create Practice Exam</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Material</Label>
                <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a material" />
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
                <Label>Exam Type</Label>
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
                  <Label>Number of Questions</Label>
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
                <Label>Difficulty Level</Label>
                <div className="flex gap-2">
                  {["easy", "medium", "hard"].map((level) => (
                    <Button
                      key={level}
                      variant={difficulty === level ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setDifficulty(level)}
                      className="flex-1 capitalize"
                    >
                      {level}
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
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Generate Practice Exam
                  </>
                )}
              </Button>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <div className="p-4 bg-muted/50 border-b border-border">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">Generated Exam</span>
                    <span className="text-[11px] text-muted-foreground">
                      {activeConversationId ? `Conversation #${activeConversationId}` : ""}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(examText);
                      }}
                    >
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleNewExam}>
                      <Plus className="w-4 h-4 mr-1" />
                      New
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                {examText ? (
                  (() => {
                    const sections = splitExamSections(examText);
                    return (
                      <div className="space-y-4">
                        <Card>
                          <CardHeader className="py-4">
                            <CardTitle className="text-sm font-medium">Questions</CardTitle>
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
                              <CardTitle className="text-sm font-medium">Answers</CardTitle>
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
                  <p className="text-sm text-muted-foreground">No exam generated.</p>
                )}
              </CardContent>
            </Card>

            {activeReferences.length > 0 ? (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">References</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {activeReferences.map((r) => (
                      <button
                        key={`${r.sourceNo}-${r.chunkId}`}
                        onClick={() => openReference(r.chunkId, r.pageStart)}
                        className="w-full text-left rounded-md border px-3 py-2 text-sm hover:bg-muted/50"
                      >
                        <div className="font-medium text-foreground truncate">
                          Source {r.sourceNo}: {r.materialTitle}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {r.pageStart && r.pageEnd
                            ? `Pages ${r.pageStart}–${r.pageEnd}`
                            : r.pageStart
                              ? `Page ${r.pageStart}`
                              : "Page range unavailable"}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        )}
      </div>

      <ReferencePreviewModal
        open={refOpen}
        onOpenChange={setRefOpen}
        title={refTitle}
        pdfUrl={refUrl}
        page={refPage}
        excerpt={refText}
      />
    </div>
  );
};

export default ExamEnginePage;

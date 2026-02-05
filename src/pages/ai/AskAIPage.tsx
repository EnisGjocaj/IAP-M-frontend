import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  BookOpen, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  RotateCcw,
  FileText,
  Download,
  X,
  Plus,
  History,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { cn } from "../../lib/utils";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Card, CardContent } from "../../components/ui/card";
import { askAIWithConversation, getAiChunk, getAiConversation, getMyMaterials, listAiConversations } from "../../api/ai";
import { ReferencePreviewModal } from "../../components/ai/ReferencePreviewModal";
import { AIPdfDownloadButton } from "../../components/ai/pdf/AIPdfDownloadButton";
import { IapmAIDocument } from "../../components/ai/pdf/IapmAIDocument";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  references?: Array<{
    sourceNo: number;
    chunkId: number;
    materialTitle: string;
    pageStart: number | null;
    pageEnd: number | null;
  }>;
}

type ConversationListItem = {
  id: number;
  title: string;
  type: "CHAT" | "SUMMARY";
  createdAt: string;
  updatedAt: string;
};

type AiMaterial = {
  id: number;
  title: string;
  courseName?: string | null;
  courseType?: string | null;
  isApproved: boolean;
  visibility: "PRIVATE" | "PUBLIC";
};

const suggestedQueries = [
  "Shpjego këtë koncept thjesht",
  "Cilat janë pyetjet e mundshme të provimit?",
  "Përmbledh me pika",
  "Krahaso këto dy koncepte",
];

export const AskAIPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [materials, setMaterials] = useState<AiMaterial[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [activeConversationTitle, setActiveConversationTitle] = useState<string | null>(null);

  const [refOpen, setRefOpen] = useState(false);
  const [refTitle, setRefTitle] = useState<string | null>(null);
  const [refUrl, setRefUrl] = useState<string | null>(null);
  const [refPage, setRefPage] = useState<number | null>(null);
  const [refText, setRefText] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const load = async () => {
      setError(null);
      try {
        const data = (await getMyMaterials()) as any[];
        const list = Array.isArray(data) ? (data as AiMaterial[]) : [];
        const approved = list.filter((m) => m.isApproved);
        setMaterials(approved);
        if (approved.length > 0) {
          setSelectedMaterials([approved[0].id]);
        }
      } catch (e: any) {
        setError(e?.message || "Dështoi ngarkimi i materialeve");
      }
    };

    load();
  }, []);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = (await listAiConversations()) as any[];
        setConversations(Array.isArray(data) ? (data as ConversationListItem[]) : []);
      } catch (e: any) {
        // ignore
      }
    };

    loadConversations();
  }, []);

  const openConversation = async (id: number) => {
    setError(null);
    try {
      const convo = (await getAiConversation(id)) as any;
      setActiveConversationId(convo?.id || id);
      setActiveConversationTitle(convo?.title || null);
      const loaded: Message[] = (convo?.messages || []).map((m: any) => ({
        id: String(m.id),
        role: (String(m.role).toLowerCase() === "user" ? "user" : "assistant") as any,
        content: m.content || "",
        timestamp: new Date(m.createdAt || Date.now()),
        references: Array.isArray(m.references)
          ? m.references.map((r: any) => ({
              sourceNo: r.sourceNo,
              chunkId: r.chunkId,
              materialTitle: r.materialTitle,
              pageStart: r.pageStart ?? null,
              pageEnd: r.pageEnd ?? null,
            }))
          : undefined,
      }));
      setMessages(loaded);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Dështoi ngarkimi i bisedës");
    }
  };

  const refreshConversations = async () => {
    try {
      const data = (await listAiConversations()) as any[];
      setConversations(Array.isArray(data) ? (data as ConversationListItem[]) : []);
    } catch {
      // ignore
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    if (!selectedMaterials || selectedMaterials.length === 0) {
      setError("Ju lutem zgjidhni të paktën një material të aprovuar.");
      return;
    }

    setError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = (await askAIWithConversation({
        question: userMessage.content,
        materialIds: selectedMaterials,
        conversationId: activeConversationId || undefined,
      })) as any;
      const answer = result?.answer || "";

      const conversationId = typeof result?.conversationId === "number" ? result.conversationId : null;
      if (!activeConversationId && conversationId) {
        setActiveConversationId(conversationId);
        refreshConversations();
      }

      const refs = Array.isArray(result?.references) ? result.references : [];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: answer,
        timestamp: new Date(),
        references: refs.map((r: any) => ({
          sourceNo: r.sourceNo,
          chunkId: r.chunkId,
          materialTitle: r.materialTitle,
          pageStart: r.pageStart ?? null,
          pageEnd: r.pageEnd ?? null,
        })),
      };
      setMessages((prev) => [...prev, aiMessage]);
      refreshConversations();
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Dështoi marrja e përgjigjes";
      setError(msg);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: msg,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMaterial = (id: number) => {
    setSelectedMaterials((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
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

      <Card className="w-[280px] hidden lg:flex flex-col overflow-hidden">
        <CardContent className="p-3 flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setActiveConversationId(null);
              setMessages([]);
            }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Bisedë e re
          </Button>
          <div className="text-xs text-muted-foreground mt-1">Historik</div>
          <div className="space-y-1">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => openConversation(c.id)}
                className={cn(
                  "w-full text-left rounded-md border px-2 py-2 text-sm transition-colors",
                  activeConversationId === c.id ? "bg-muted" : "hover:bg-muted/50"
                )}
              >
                <div className="font-medium text-foreground truncate">{c.title}</div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {c.type === "SUMMARY" ? "Përmbledhje" : "Bisedë"} · {new Date(c.updatedAt).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex-1 flex flex-col">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Pyet AI</h1>
          <p className="text-sm text-muted-foreground mt-1">Bëni pyetje mbi materialet tuaja akademike</p>
        </div>
        <div className="flex gap-2">
          <AIPdfDownloadButton
            document={
              <IapmAIDocument
                title={activeConversationTitle || "Pyet AI"}
                subtitle={selectedMaterials.length > 0 ? `Materiale: ${selectedMaterials.length}` : null}
                generatedAt={new Date()}
                logoSrc={typeof window !== "undefined" ? `${window.location.origin}/iap-m-logo.jpg` : undefined}
                transcript={messages.map((m) => ({
                  role: m.role === "user" ? "USER" : "ASSISTANT",
                  content: m.content,
                }))}
                references={(() => {
                  const seen = new Set<number>();
                  const refs: Array<any> = [];
                  for (const msg of messages) {
                    for (const r of msg.references || []) {
                      if (seen.has(r.chunkId)) continue;
                      seen.add(r.chunkId);
                      refs.push({
                        sourceNo: r.sourceNo,
                        chunkId: r.chunkId,
                        materialTitle: r.materialTitle,
                        pageStart: r.pageStart,
                        pageEnd: r.pageEnd,
                      });
                    }
                  }
                  return refs;
                })()}
              />
            }
            fileName={`IAPM_${(activeConversationTitle || "PyetAI").replace(/\s+/g, "_")}.pdf`}
            disabled={messages.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Eksporto PDF
          </AIPdfDownloadButton>
          <Button variant="outline" size="sm" onClick={() => {
            setActiveConversationId(null);
            setActiveConversationTitle(null);
            setMessages([]);
          }}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Bisedë e re
          </Button>
        </div>
      </div>

      <Card className="mb-4">
        <CardContent className="py-3">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Materialet e zgjedhura</span>
            <span className="text-xs text-muted-foreground">({selectedMaterials.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {materials.map((material) => (
              <Badge
                key={material.id}
                variant={selectedMaterials.includes(material.id) ? "secondary" : "outline"}
                className="cursor-pointer transition-colors"
                onClick={() => toggleMaterial(material.id)}
              >
                <FileText className="w-3 h-3 mr-1" />
                {material.title}
                {selectedMaterials.includes(material.id) && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">
              <Plus className="w-3 h-3 mr-1" />
              Shto të tjera
            </Badge>
          </div>
        </CardContent>
      </Card>

      {error && (
        <p className="text-sm text-destructive mb-3">{error}</p>
      )}


      <Card className="flex-1 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground">Fillo një bisedë</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  Bëni pyetje rreth materialeve tuaja të studimit.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {suggestedQueries.map((query, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => setInput(query)}
                    >
                      {query}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-secondary-foreground" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-3",
                    message.role === "user"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted"
                  )}
                >
                  <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                  {message.references && message.references.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <span className="text-xs text-muted-foreground">Burimet:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {message.references.map((r) => {
                          const pages =
                            r.pageStart && r.pageEnd
                              ? r.pageStart === r.pageEnd
                                ? `faqja ${r.pageStart}`
                                : `faqet ${r.pageStart}–${r.pageEnd}`
                              : "faqet ?";
                          const label = `${r.materialTitle} (${pages})`;
                          return (
                            <Badge
                              key={`${message.id}-${r.chunkId}-${r.sourceNo}`}
                              variant="outline"
                              className="text-xs cursor-pointer hover:bg-muted"
                              onClick={async () => {
                                try {
                                  const data = await getAiChunk(r.chunkId);
                                  setRefTitle(`${data?.material?.title || r.materialTitle}`);
                                  setRefUrl(data?.material?.cloudinaryUrl || null);
                                  setRefPage(data?.pageStart || r.pageStart || null);
                                  setRefText(data?.text || null);
                                  setRefOpen(true);
                                } catch (e: any) {
                                  setError(e?.response?.data?.message || e?.message || "Dështoi ngarkimi i referencës");
                                }
                              }}
                            >
                              {label}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {message.role === "assistant" && (
                    <div className="flex gap-1 mt-2">
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center shrink-0">
                    <span className="text-xs font-medium text-muted-foreground">S</span>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-secondary-foreground" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t border-border p-3 bg-background">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Bëni një pyetje rreth materialeve tuaja..."
              className="min-h-[40px] max-h-24 resize-none text-sm"
              rows={1}
            />
            <Button
              size="icon"
              className="shrink-0 h-10 w-10"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Shtyp Enter për të dërguar, Shift+Enter për rresht të ri
          </p>
        </div>
      </Card>
      </div>
    </div>
  );
};

export default AskAIPage;

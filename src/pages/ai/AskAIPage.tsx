import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Sparkles, 
  BookOpen, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  RotateCcw,
  FileText,
  X,
  Plus,
  History,
  Lightbulb,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { cn } from "../../lib/utils";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: string[];
}

const suggestedQueries = [
  "Explain this slide like I'm 18",
  "What are likely exam questions?",
  "Summarize this lecture in bullet points",
  "Compare these two concepts",
  "Create flashcards for key terms",
];

const availableMaterials = [
  { id: "1", name: "Marketing Strategy Lecture 5", course: "Marketing" },
  { id: "2", name: "Financial Accounting Slides", course: "Finance" },
  { id: "3", name: "Statistics Practice Problems", course: "Statistics" },
  { id: "4", name: "Economics Chapter 8 Notes", course: "Economics" },
];

const sampleConversation: Message[] = [
  {
    id: "1",
    role: "user",
    content: "What are the key concepts in Marketing Strategy Lecture 5?",
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: "2",
    role: "assistant",
    content: `Based on Marketing Strategy Lecture 5, here are the key concepts:

**1. Competitive Analysis Framework**
- Porter's Five Forces model
- SWOT analysis integration
- Market positioning strategies

**2. Value Proposition Development**
- Customer-centric approach
- Unique selling propositions (USP)
- Brand differentiation tactics

**3. Strategic Implementation**
- Resource allocation methods
- Timeline and milestone planning
- Performance metrics (KPIs)

Would you like me to elaborate on any of these concepts?`,
    timestamp: new Date(Date.now() - 240000),
    sources: ["Marketing Strategy Lecture 5 - Slide 12-24"],
  },
];

export const AskAIPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(sampleConversation);
  const [input, setInput] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(["1"]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "This is a simulated AI response. In the full implementation, this would query the `/api/ai/query` endpoint with your selected materials and return relevant insights based on the uploaded academic content.",
        timestamp: new Date(),
        sources: ["Selected Material - Page 5-8"],
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMaterial = (id: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Ask AI
            <Sparkles className="w-5 h-5 text-primary" />
          </h1>
          <p className="text-muted-foreground mt-1">Query your academic materials with AI assistance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
          {/* @ts-ignore */}
          <Button variant="ai-outline" size="sm" onClick={() => setMessages([])}>
            <RotateCcw className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>
      </div>

      <div className="ai-card border border-border p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-secondary" />
          <span className="font-medium text-sm text-foreground">Selected Materials</span>
          <span className="text-xs text-muted-foreground">({selectedMaterials.length} selected)</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableMaterials.map((material) => (
            <Badge
              key={material.id}
              variant={selectedMaterials.includes(material.id) ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all duration-200",
                selectedMaterials.includes(material.id)
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  : "hover:bg-secondary/10"
              )}
              onClick={() => toggleMaterial(material.id)}
            >
              <FileText className="w-3 h-3 mr-1" />
              {material.name}
              {selectedMaterials.includes(material.id) && (
                <X className="w-3 h-3 ml-1" />
              )}
            </Badge>
          ))}
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">
            <Plus className="w-3 h-3 mr-1" />
            Add More
          </Badge>
        </div>
      </div>

      <div className="flex-1 ai-card border border-border overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">Start a conversation</h3>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                  Ask questions about your study materials. I can explain concepts, generate summaries, or help you prepare for exams.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {suggestedQueries.map((query, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => setInput(query)}
                    >
                      <Lightbulb className="w-3 h-3 mr-1" />
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
                  "flex gap-4",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-secondary-foreground" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-4",
                    message.role === "user"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted"
                  )}
                >
                  <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                    {message.content}
                  </div>
                  {message.sources && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <span className="text-xs text-muted-foreground">Sources:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {message.sources.map((source, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {message.role === "assistant" && (
                    <div className="flex gap-2 mt-3">
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                    <span className="text-sm font-medium text-primary-foreground">S</span>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-secondary-foreground animate-spin-slow" />
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-secondary/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-secondary/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-secondary/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t border-border p-4 bg-background">
          <div className="flex gap-3">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your materials..."
              className="min-h-[44px] max-h-32 resize-none"
              rows={1}
            />
            {/* @ts-ignore */}
            <Button variant="ai"
              size="icon"
              className="shrink-0 h-11 w-11"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default AskAIPage;

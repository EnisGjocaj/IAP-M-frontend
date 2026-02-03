import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  BookOpen, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  RotateCcw,
  FileText,
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

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: string[];
}

const suggestedQueries = [
  "Explain this concept simply",
  "What are likely exam questions?",
  "Summarize in bullet points",
  "Compare these two concepts",
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
    <div className="h-[calc(100vh-8rem)] flex flex-col">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Ask AI</h1>
          <p className="text-sm text-muted-foreground mt-1">Query your academic materials</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
          <Button variant="outline" size="sm" onClick={() => setMessages([])}>
            <RotateCcw className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>
      </div>

      <Card className="mb-4">
        <CardContent className="py-3">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Selected Materials</span>
            <span className="text-xs text-muted-foreground">({selectedMaterials.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableMaterials.map((material) => (
              <Badge
                key={material.id}
                variant={selectedMaterials.includes(material.id) ? "secondary" : "outline"}
                className="cursor-pointer transition-colors"
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
        </CardContent>
      </Card>


      <Card className="flex-1 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground">Start a conversation</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  Ask questions about your study materials.
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
                  {message.sources && (
                    <div className="mt-2 pt-2 border-t border-border/50">
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
              placeholder="Ask a question about your materials..."
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
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AskAIPage;

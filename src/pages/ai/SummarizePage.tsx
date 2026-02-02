import React, { useState } from "react";
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Download,
  RefreshCw,
  CheckCircle,
  BookOpen,
  ListChecks,
  MessageSquare,
  FileSearch,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { cn } from "../../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { ScrollArea } from "../../components/ui/scroll-area";

const availableMaterials = [
  { id: "1", name: "Marketing Strategy Lecture 5", course: "Marketing" },
  { id: "2", name: "Financial Accounting Slides", course: "Finance" },
  { id: "3", name: "Statistics Practice Problems", course: "Statistics" },
  { id: "4", name: "Economics Chapter 8 Notes", course: "Economics" },
];

const summaryTypes = [
  { id: "bullet", name: "Bullet Points", icon: ListChecks, description: "Concise key points" },
  { id: "paragraph", name: "Paragraph", icon: MessageSquare, description: "Flowing narrative" },
  { id: "study-guide", name: "Study Guide", icon: BookOpen, description: "Exam-ready format" },
  { id: "key-terms", name: "Key Terms", icon: FileSearch, description: "Vocabulary focus" },
];

const sampleSummary = `# Marketing Strategy - Lecture 5 Summary

## Key Concepts

### 1. Competitive Analysis Framework
- **Porter's Five Forces**: Understanding industry competition through supplier power, buyer power, competitive rivalry, threat of substitution, and threat of new entrants
- **SWOT Integration**: Combining internal strengths/weaknesses with external opportunities/threats
- **Market Positioning**: Identifying unique value propositions in competitive landscapes

### 2. Value Proposition Development
- Customer-centric approach focusing on solving real problems
- Unique Selling Propositions (USP) that differentiate from competitors
- Brand differentiation through emotional and functional benefits

### 3. Strategic Implementation
- Resource allocation based on strategic priorities
- Timeline and milestone planning for execution
- Key Performance Indicators (KPIs) for measuring success

## Exam Focus Areas
- Porter's Five Forces model application
- SWOT analysis case study examples
- Value proposition canvas creation

## Key Terms to Remember
- **USP**: Unique Selling Proposition
- **KPI**: Key Performance Indicator
- **SWOT**: Strengths, Weaknesses, Opportunities, Threats`;

export const SummarizePage: React.FC = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [summaryType, setSummaryType] = useState<string>("bullet");
  const [summary, setSummary] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [customInstructions, setCustomInstructions] = useState("");

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setSummary(sampleSummary);
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          Summarize
          <Sparkles className="w-5 h-5 text-primary" />
        </h1>
        <p className="text-muted-foreground mt-1">Generate AI-powered summaries of your study materials</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="ai-card border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-secondary" />
              Select Material
            </h3>
            <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a material to summarize" />
              </SelectTrigger>
              <SelectContent>
                {availableMaterials.map((material) => (
                  <SelectItem key={material.id} value={material.id}>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>{material.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="ai-card border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4">Summary Format</h3>
            <div className="grid grid-cols-2 gap-3">
              {summaryTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSummaryType(type.id)}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-all duration-200",
                    summaryType === type.id
                      ? "border-secondary bg-secondary/5"
                      : "border-border hover:border-secondary/50"
                  )}
                >
                  <type.icon className={cn(
                    "w-5 h-5 mb-2",
                    summaryType === type.id ? "text-secondary" : "text-muted-foreground"
                  )} />
                  <p className="font-medium text-sm text-foreground">{type.name}</p>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="ai-card border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4">Custom Instructions</h3>
            <Textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="Add any specific instructions for the summary (optional)"
              className="min-h-[80px] resize-none"
            />
          </div>
          {/* @ts-ignore */}
            <Button variant="ai"
            size="lg"
            className="w-full"
            onClick={handleGenerate}
            disabled={!selectedMaterial || isGenerating}
            >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Summary
              </>
            )}
          </Button>
        </div>

        <div className="lg:col-span-2">
          <div className="ai-card border border-border h-full flex flex-col">
            {summary ? (
              <>
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="font-medium text-sm text-foreground">Summary Generated</span>
                    <Badge variant="outline" className="text-xs">
                      {summaryTypes.find(t => t.id === summaryType)?.name}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleCopy}>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                    {/* @ts-ignore */}
                    <Button variant="ai-outline" size="sm" onClick={handleGenerate}>
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Regenerate
                    </Button>
                  </div>
                </div>
                <ScrollArea className="flex-1 p-6">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                      {summary}
                    </div>
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">No Summary Yet</h3>
                  <p className="text-muted-foreground mt-2 max-w-sm">
                    Select a material and click "Generate Summary" to create an AI-powered summary of your study content.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummarizePage;

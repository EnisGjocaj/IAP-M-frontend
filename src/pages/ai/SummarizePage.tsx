import React, { useState } from "react";
import { 
  FileText, 
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
import { ScrollArea } from "../../components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";

const availableMaterials = [
  { id: "1", name: "Marketing Strategy Lecture 5", course: "Marketing" },
  { id: "2", name: "Financial Accounting Slides", course: "Finance" },
  { id: "3", name: "Statistics Practice Problems", course: "Statistics" },
  { id: "4", name: "Economics Chapter 8 Notes", course: "Economics" },
];

const summaryTypes = [
  { id: "bullet", name: "Bullet Points", description: "Key points" },
  { id: "paragraph", name: "Paragraph", description: "Narrative" },
  { id: "study-guide", name: "Study Guide", description: "Exam-ready" },
  { id: "key-terms", name: "Key Terms", description: "Vocabulary" },
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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Summarize</h1>
        <p className="text-sm text-muted-foreground mt-1">Generate summaries of your study materials</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          
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
                  {availableMaterials.map((material) => (
                    <SelectItem key={material.id} value={material.id}>
                      {material.name}
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

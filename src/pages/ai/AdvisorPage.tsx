import React, { useState } from "react";
import { 
  Brain, 
  RefreshCw,
  Download,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { advisorPlan } from "../../api/ai";
import { Textarea } from "../../components/ui/textarea";
import { AIPdfDownloadButton } from "../../components/ai/pdf/AIPdfDownloadButton";
import { IapmAIDocument } from "../../components/ai/pdf/IapmAIDocument";

export const AdvisorPage: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [prompt, setPrompt] = useState(
    "Create a 7-day study plan for my upcoming exam based on typical Faculty of Business topics. Be structured with daily tasks and priorities."
  );
  const [advice, setAdvice] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const logoSrc = typeof window !== "undefined" ? `${window.location.origin}/iap-m-logo.jpg` : undefined;
  const fileName = `IAPM_Advisor_${new Date().toISOString().slice(0, 10)}.pdf`;

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setError(null);
    try {
      const res = (await advisorPlan({ prompt })) as any;
      setAdvice(res?.advice || "");
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to generate plan");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Academic Advisor</h1>
          <p className="text-sm text-muted-foreground mt-1">Personalized study recommendations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          <AIPdfDownloadButton
            document={
              <IapmAIDocument
                title="Advisor Plan"
                subtitle="Academic Study Plan"
                generatedAt={new Date()}
                logoSrc={logoSrc}
                sections={[{ title: "Plan", content: advice || "" }]}
              />
            }
            fileName={fileName}
            disabled={!advice}
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </AIPdfDownloadButton>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-4 overflow-hidden">
        <Card className="xl:col-span-1 overflow-hidden flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Prompt</CardTitle>
            <CardDescription>Describe the plan you want the Advisor to generate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 flex-1 overflow-auto">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[140px] resize-none text-sm"
              placeholder="Describe what you want the advisor to produce..."
            />
            <div className="flex gap-2">
              <Button onClick={handleRefresh} disabled={isRefreshing || !prompt.trim()}>
                <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
                Generate
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (advice) navigator.clipboard.writeText(advice);
                }}
                disabled={!advice}
              >
                Copy
              </Button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>

        <Card className="xl:col-span-2 overflow-hidden flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Plan</CardTitle>
            <CardDescription>Generated study plan output</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {advice ? (
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">{advice}</div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Generate a plan to see results here.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvisorPage;

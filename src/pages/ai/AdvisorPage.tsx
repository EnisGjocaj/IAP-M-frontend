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

export const AdvisorPage: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [prompt, setPrompt] = useState(
    "Create a 7-day study plan for my upcoming exam based on typical Faculty of Business topics. Be structured with daily tasks and priorities."
  );
  const [advice, setAdvice] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Academic Advisor</h1>
          <p className="text-sm text-muted-foreground mt-1">Personalized study recommendations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Plan
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">AI Study Plan (MVP)</CardTitle>
          <CardDescription>Generate a structured plan from the backend advisor endpoint</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[90px] resize-none text-sm"
            placeholder="Describe what you want the advisor to produce..."
          />
          <div className="flex gap-2">
            <Button onClick={handleRefresh} disabled={isRefreshing || !prompt.trim()}>
              <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
              Generate Plan
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
          {advice ? (
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">{advice}</div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Generate a plan to see results here.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Insights & Recommendations</CardTitle>
          <CardDescription>Coming soon (MVP)</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Analytics like readiness scores, skill gaps, recommendations, schedules, and achievements are not enabled in this MVP.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvisorPage;

"use client";

import React from "react";
import CountUp from "react-countup";
import { Activity, RefreshCw, Users, MessageSquare, FileText, GraduationCap, BookOpen, Shield } from "lucide-react";

import { getAdminAiDashboard, getAiSettings, updateAiSettings } from "../../../api/ai";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Switch } from "../../../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { Separator } from "../../../components/ui/separator";
import { SidebarTrigger } from "../../../components/ui/sidebar";
import { toast } from "react-toastify";

type AdminAiDashboardResponse = {
  kpis: {
    totalInteractions: number;
    activeUsers: number;
    examsGenerated: number;
    summariesCreated: number;
    askAiRequests: number;
  };
  breakdown: { askAi: number; chat: number; summary: number; exam: number; advisor?: number };
  materials: { approved: number; pending: number; rejected: number; indexed: number; indexing: number; failed: number };
  trends: {
    daily: Array<{ date: string; askAi: number; chat: number; summary: number; exam: number }>;
    weekly?: Array<{ weekStart: string; askAi: number; chat: number; summary: number; exam: number }>;
  };
  topUsers: Array<{ userId: number; name: string; surname: string; email: string; interactions: number }>;
  topMaterials?: Array<{ materialId: number; title: string; interactions: number }>;
  recentActivity?: Array<{
    kind: "ASK_AI" | "CHAT" | "SUMMARY" | "EXAM";
    createdAt: string;
    userId: number;
    materialId?: number | null;
    title: string;
  }>;
};

const MiniBar = ({ value, max }: { value: number; max: number }) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
      <div className="h-full bg-secondary" style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  subtitle: string;
}) => (
  <Card className="relative overflow-hidden border-none group hover:scale-[1.01] transition-all duration-200">
    <div className="absolute inset-0 bg-secondary opacity-[0.06] group-hover:opacity-[0.09] transition-opacity" />
    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent" />
    <CardContent className="p-6 relative">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-secondary/15 shadow-sm">
          <Icon className="w-5 h-5 text-secondary" strokeWidth={1.5} />
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold tracking-tight text-foreground">
          <CountUp end={Number.isFinite(value) ? value : 0} duration={1.2} separator="," />
        </div>
        <div className="text-sm font-medium text-foreground mt-1">{title}</div>
        <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
      </div>
    </CardContent>
  </Card>
);

export default function AdminAiDashboardPage() {
  const [range, setRange] = React.useState<"7d" | "30d">("7d");
  const [data, setData] = React.useState<AdminAiDashboardResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [aiEnabled, setAiEnabled] = React.useState(true);
  const [settingsLoading, setSettingsLoading] = React.useState(true);
  const [settingsSaving, setSettingsSaving] = React.useState(false);

  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = (await getAdminAiDashboard({ range })) as any;
      setData(res as AdminAiDashboardResponse);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [range]);

  const loadSettings = React.useCallback(async () => {
    try {
      setSettingsLoading(true);
      const s = (await getAiSettings()) as any;
      setAiEnabled(Boolean(s?.aiEnabled ?? true));
    } catch {
      setAiEnabled(true);
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  React.useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleToggleAiEnabled = async (nextValue: boolean) => {
    if (settingsLoading || settingsSaving) return;
    const prev = aiEnabled;
    try {
      setSettingsSaving(true);
      setAiEnabled(nextValue);
      await updateAiSettings({ aiEnabled: nextValue });
      toast.success("AI settings updated");
      await load();
    } catch (e) {
      setAiEnabled(prev);
      toast.error("Failed to update AI settings");
    } finally {
      setSettingsSaving(false);
    }
  };

  const maxTrend = React.useMemo(() => {
    const arr = data?.trends?.daily || [];
    let m = 0;
    for (const d of arr) {
      const v = (d.askAi || 0) + (d.chat || 0) + (d.summary || 0) + (d.exam || 0);
      if (v > m) m = v;
    }
    return m;
  }, [data]);

  const maxWeeklyTrend = React.useMemo(() => {
    const arr = data?.trends?.weekly || [];
    let m = 0;
    for (const d of arr) {
      const v = (d.askAi || 0) + (d.chat || 0) + (d.summary || 0) + (d.exam || 0);
      if (v > m) m = v;
    }
    return m;
  }, [data]);

  return (
    <div className="flex h-full w-full flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-background px-6">
        <div className="flex items-center gap-2 flex-1">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-6" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard" className="text-muted-foreground hover:text-foreground">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">AI Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-3">
          <Select value={range} onValueChange={(v) => setRange(v as any)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={load} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Analytics</h1>
            <p className="text-muted-foreground mt-1">Usage overview across Ask AI, Summaries, and Exam Engine</p>
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : !data ? (
          <div className="text-sm text-destructive">Failed to load AI dashboard.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <Card className="xl:col-span-2 border border-gray-200/80 shadow-lg">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Overview
                      </CardTitle>
                      <CardDescription className="text-xs">Key usage and performance indicators</CardDescription>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`text-xs font-medium px-2 py-1 rounded-full ${aiEnabled ? "bg-emerald-500/10 text-emerald-700" : "bg-rose-500/10 text-rose-700"}`}>
                        {aiEnabled ? "AI Enabled" : "AI Disabled"}
                      </div>
                      <div className="flex items-center gap-2">
                        {(settingsLoading || settingsSaving) && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{settingsLoading ? "Loading…" : "Saving…"}</span>
                        )}
                        <Switch
                          checked={aiEnabled}
                          disabled={settingsLoading || settingsSaving}
                          onCheckedChange={(v) => handleToggleAiEnabled(Boolean(v))}
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatCard
                      title="Total interactions"
                      value={data.kpis.totalInteractions}
                      icon={MessageSquare}
                      subtitle="All AI actions"
                    />
                    <StatCard title="Active users" value={data.kpis.activeUsers} icon={Users} subtitle={`${range} window`} />
                    <StatCard title="Ask AI" value={data.kpis.askAiRequests} icon={MessageSquare} subtitle="Questions asked" />
                    <StatCard title="Summaries" value={data.kpis.summariesCreated} icon={FileText} subtitle="Generated" />
                    <StatCard title="Exams" value={data.kpis.examsGenerated} icon={GraduationCap} subtitle="Generated" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200/80 shadow-lg">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Materials moderation
                  </CardTitle>
                  <CardDescription className="text-xs">Approval and indexing pipeline</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-md border p-3">
                      <div className="text-muted-foreground">Approved</div>
                      <div className="text-foreground font-semibold mt-1">{data.materials.approved}</div>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-muted-foreground">Pending</div>
                      <div className="text-foreground font-semibold mt-1">{data.materials.pending}</div>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-muted-foreground">Rejected</div>
                      <div className="text-foreground font-semibold mt-1">{data.materials.rejected}</div>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-muted-foreground">Indexed</div>
                      <div className="text-foreground font-semibold mt-1">{data.materials.indexed}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-md border p-3">
                      <div className="text-muted-foreground">Indexing</div>
                      <div className="text-foreground font-semibold mt-1">{data.materials.indexing}</div>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-muted-foreground">Failed</div>
                      <div className="text-foreground font-semibold mt-1">{data.materials.failed}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <Card className="xl:col-span-2 border border-gray-200/80 shadow-lg">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-base">Trends</CardTitle>
                      <CardDescription className="text-xs">Daily and weekly activity</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <Tabs defaultValue="daily" className="w-full">
                    <TabsList>
                      <TabsTrigger value="daily">Daily</TabsTrigger>
                      <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    </TabsList>

                    <TabsContent value="daily">
                      <div className="space-y-3">
                        {(data.trends.daily || []).map((d) => {
                          const total = (d.askAi || 0) + (d.chat || 0) + (d.summary || 0) + (d.exam || 0);
                          return (
                            <div key={d.date} className="grid grid-cols-12 gap-3 items-center">
                              <div className="col-span-3 text-xs text-muted-foreground">{d.date}</div>
                              <div className="col-span-7">
                                <MiniBar value={total} max={maxTrend} />
                              </div>
                              <div className="col-span-2 text-xs font-medium text-foreground text-right">{total}</div>
                            </div>
                          );
                        })}
                      </div>
                    </TabsContent>

                    <TabsContent value="weekly">
                      <div className="space-y-3">
                        {(data.trends.weekly || []).map((d) => {
                          const total = (d.askAi || 0) + (d.chat || 0) + (d.summary || 0) + (d.exam || 0);
                          return (
                            <div key={d.weekStart} className="grid grid-cols-12 gap-3 items-center">
                              <div className="col-span-3 text-xs text-muted-foreground">{d.weekStart}</div>
                              <div className="col-span-7">
                                <MiniBar value={total} max={maxWeeklyTrend} />
                              </div>
                              <div className="col-span-2 text-xs font-medium text-foreground text-right">{total}</div>
                            </div>
                          );
                        })}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card className="border border-gray-200/80 shadow-lg">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                  <CardTitle className="text-base">Feature breakdown</CardTitle>
                  <CardDescription className="text-xs">All-time counts</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {([
                    { key: "askAi", label: "Ask AI", value: data.breakdown.askAi },
                    { key: "chat", label: "Chat", value: data.breakdown.chat },
                    { key: "summary", label: "Summary", value: data.breakdown.summary },
                    { key: "exam", label: "Exam", value: data.breakdown.exam },
                    { key: "advisor", label: "Advisor", value: Number(data.breakdown.advisor || 0) },
                  ] as const).map((row) => (
                    <div key={row.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-foreground">{row.label}</div>
                        <div className="text-sm text-muted-foreground">{row.value}</div>
                      </div>
                      <MiniBar value={row.value} max={Math.max(1, data.kpis.totalInteractions)} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card className="border border-gray-200/80 shadow-lg">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                  <CardTitle className="text-base">Most active users</CardTitle>
                  <CardDescription className="text-xs">Top users by interactions (queries + conversations)</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Interactions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(data.topUsers || []).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-sm text-muted-foreground">
                            No data.
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.topUsers.map((u) => (
                          <TableRow key={u.userId}>
                            <TableCell className="font-medium">
                              {u.name} {u.surname}
                            </TableCell>
                            <TableCell className="text-muted-foreground">{u.email}</TableCell>
                            <TableCell className="text-right font-medium">{u.interactions}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="border border-gray-200/80 shadow-lg">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Most used materials
                  </CardTitle>
                  <CardDescription className="text-xs">Top materials referenced in Ask AI</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Material</TableHead>
                        <TableHead className="text-right">Interactions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {((data.topMaterials || []) as any[]).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={2} className="text-sm text-muted-foreground">
                            No data.
                          </TableCell>
                        </TableRow>
                      ) : (
                        (data.topMaterials || []).map((m) => (
                          <TableRow key={m.materialId}>
                            <TableCell className="font-medium">{m.title || `#${m.materialId}`}</TableCell>
                            <TableCell className="text-right font-medium">{m.interactions}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-gray-200/80 shadow-lg">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                <CardTitle className="text-base">Recent AI activity</CardTitle>
                <CardDescription className="text-xs">Latest interactions across features</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>When</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="text-right">User ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {((data.recentActivity || []) as any[]).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-sm text-muted-foreground">
                          No data.
                        </TableCell>
                      </TableRow>
                    ) : (
                      (data.recentActivity || []).map((a, idx) => (
                        <TableRow key={`${a.createdAt}-${idx}`}>
                          <TableCell className="text-muted-foreground">{String(a.createdAt).replace('T', ' ').slice(0, 16)}</TableCell>
                          <TableCell className="font-medium">{a.kind}</TableCell>
                          <TableCell className="max-w-[520px] truncate">{a.title}</TableCell>
                          <TableCell className="text-right text-muted-foreground">{a.userId}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

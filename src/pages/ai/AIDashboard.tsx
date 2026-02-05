import React from "react";
import { 
  FolderOpen, 
  MessageSquare, 
  GraduationCap, 
  Brain,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { getAiStats } from "../../api/ai";

type AiStats = {
  materials: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    visibility: { private: number; public: number };
    indexStatus: { indexed: number; indexing: number; failed: number };
  };
  conversations: {
    total: number;
    chat: number;
    summary: number;
    exam: number;
    messages: number;
  };
  queries: {
    total: number;
  };
  recentActivity: Array<{
    kind: "MATERIAL" | "CONVERSATION" | "QUERY";
    id: number;
    title: string;
    timestamp: string;
    meta?: any;
  }>;
};

const quickActions = [
  { title: "Bëj një pyetje", description: "Pyet materialet e tua të studimit me AI", href: "/ai/ask" },
  { title: "Gjenero provim praktik", description: "Krijo teste praktike të personalizuara", href: "/ai/exam" },
  { title: "Ngarko materiale", description: "Shto përmbajtje të re studimi", href: "/ai/materials" },
  { title: "Merr plan studimi", description: "Rekomandime të personalizuara", href: "/ai/advisor" },
];

export const AIDashboard: React.FC = () => {
  const [statsData, setStatsData] = React.useState<AiStats | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = (await getAiStats()) as any;
        setStatsData(data as AiStats);
      } catch {
        setStatsData(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = [
    { title: "Materiale të ngarkuara", value: statsData?.materials?.total ?? "—", subtitle: "Ngarkimet e tua" },
    { title: "Pyetje për AI", value: statsData?.queries?.total ?? "—", subtitle: "Pyetje të bëra" },
    { title: "Provime praktike", value: statsData?.conversations?.exam ?? "—", subtitle: "Seanca provimi të ruajtura" },
    { title: "Përmbledhje", value: statsData?.conversations?.summary ?? "—", subtitle: "Përmbledhje të ruajtura" },
  ];

  const indexedPct = (() => {
    const total = statsData?.materials?.total ?? 0;
    if (!total) return 0;
    return Math.round(((statsData?.materials?.indexStatus?.indexed ?? 0) / total) * 100);
  })();

  const formatWhen = (iso: string) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-8">
      <section className="border-b border-border pb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Asistenti Akademik AI i IAP-M
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Shoqëruesi yt i personalizuar i studimit. Ngarko materiale, bëj pyetje dhe përgatitu për provime me mjete të fuqizuara nga AI, të dizajnuara për sukses akademik.
        </p>
        <div className="flex gap-3 mt-4">
          <Button asChild>
            <Link to="/ai/ask">Fillo të pyesësh</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/ai/materials">Ngarko materiale</Link>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
          Përmbledhje
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="pt-5 pb-4">
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-sm font-medium text-foreground mt-1">{stat.title}</p>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
          Veprime të shpejta
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className="group block p-4 bg-card border border-border rounded-lg hover:border-secondary/50 hover:shadow-md transition-all"
            >
              <h3 className="font-medium text-foreground group-hover:text-secondary transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {action.description}
              </p>
              <span className="inline-flex items-center text-sm text-secondary mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Shko <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Aktiviteti i fundit</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Po ngarkohet...</p>
            ) : !statsData || !statsData.recentActivity || statsData.recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">Ende s’ka aktivitet.</p>
            ) : (
              <div className="space-y-3">
                {statsData.recentActivity.map((a) => (
                  <div key={`${a.kind}-${a.id}`} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {a.kind === "MATERIAL" ? "Material" : a.kind === "CONVERSATION" ? "Bisedë" : "Pyetje"}: {a.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatWhen(a.timestamp)}
                      </p>
                    </div>
                    {a.kind === "CONVERSATION" ? (
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          to={
                            (a.meta?.type === "SUMMARY"
                              ? "/ai/summarize"
                              : a.meta?.type === "EXAM"
                                ? "/ai/exam"
                                : "/ai/ask")
                          }
                        >
                          Hap
                        </Link>
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Provimet e ardhshme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">S’ka provime të ardhshme.</p>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Progresi i indeksimit</span>
                <span className="text-xs text-muted-foreground">{statsData ? `${indexedPct}%` : "—"}</span>
              </div>
              <Progress value={statsData ? indexedPct : 0} />
              <p className="text-xs text-muted-foreground mt-2">
                Të indeksuara: {statsData?.materials?.indexStatus?.indexed ?? "—"} / {statsData?.materials?.total ?? "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Rekomandim studimi</p>
              <p className="text-sm text-muted-foreground mt-1">
                Bazuar në aktivitetin tuaj, fokusimi te Raportet Financiare mund të përmirësojë gatishmërinë tuaj për provim.
              </p>
            </div>
            <Button variant="secondary" size="sm" asChild>
              <Link to="/ai/advisor">Shiko planin</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIDashboard;

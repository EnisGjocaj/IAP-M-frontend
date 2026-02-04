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
import { getMyMaterials } from "../../api/ai";

type AiMaterial = { id: number };

const quickActions = [
  { title: "Ask a Question", description: "Query your study materials with AI", href: "/ai/ask" },
  { title: "Generate Practice Exam", description: "Create custom practice tests", href: "/ai/exam" },
  { title: "Upload Materials", description: "Add new study content", href: "/ai/materials" },
  { title: "Get Study Plan", description: "Personalized recommendations", href: "/ai/advisor" },
];

export const AIDashboard: React.FC = () => {
  const [materialsCount, setMaterialsCount] = React.useState<number>(0);

  React.useEffect(() => {
    const load = async () => {
      try {
        const data = (await getMyMaterials()) as any[];
        const list = Array.isArray(data) ? (data as AiMaterial[]) : [];
        setMaterialsCount(list.length);
      } catch {
        setMaterialsCount(0);
      }
    };

    load();
  }, []);

  const stats = [
    { title: "Materials Uploaded", value: materialsCount, subtitle: "Your uploads" },
    { title: "AI Queries", value: "—", subtitle: "Coming soon" },
    { title: "Practice Exams", value: "—", subtitle: "Coming soon" },
    { title: "Study Score", value: "—", subtitle: "Coming soon" },
  ];

  return (
    <div className="space-y-8">
      <section className="border-b border-border pb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          IAP-M AI Academic Assistant
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Your personalized study companion. Upload materials, ask questions, and prepare for exams using AI-powered tools designed for academic excellence.
        </p>
        <div className="flex gap-3 mt-4">
          <Button asChild>
            <Link to="/ai/ask">Start Asking</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/ai/materials">Upload Materials</Link>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
          Overview
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
          Quick Actions
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
                Go <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Upcoming Exams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No upcoming exams.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Study Recommendation</p>
              <p className="text-sm text-muted-foreground mt-1">
                Based on your activity, focusing on Financial Ratios could improve your exam readiness.
              </p>
            </div>
            <Button variant="secondary" size="sm" asChild>
              <Link to="/ai/advisor">View Plan</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIDashboard;

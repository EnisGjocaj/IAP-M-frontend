import React from "react";
import { 
  FolderOpen, 
  MessageSquare, 
  FileText, 
  GraduationCap, 
  Brain,
  TrendingUp,
  BookOpen,
  Target,
  Sparkles,
  Clock,
  Zap,
} from "lucide-react";
import { StatsCard } from "../../components/ai/cards/StatsCard";
import { QuickActionCard } from "../../components/ai/cards/QuickActionCard";
import { RecentActivityCard } from "../../components/ai/cards/RecentActivityCard";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Link } from "react-router-dom";

const stats = [
  { title: "Materials", value: 24, subtitle: "Uploaded this semester", icon: FolderOpen, variant: "primary" as const },
  { title: "AI Queries", value: 156, subtitle: "Questions answered", icon: MessageSquare, trend: { value: 12, isPositive: true }, variant: "default" as const },
  { title: "Practice Exams", value: 8, subtitle: "Completed this week", icon: GraduationCap, variant: "secondary" as const },
  { title: "Study Score", value: "87%", subtitle: "Above average", icon: Target, trend: { value: 5, isPositive: true }, variant: "accent" as const },
];

const quickActions = [
  { title: "Ask a Question", description: "Query your study materials with AI", icon: MessageSquare, href: "/ai/ask", variant: "secondary" as const },
  { title: "Generate Practice Exam", description: "Create custom practice tests", icon: GraduationCap, href: "/ai/exam", variant: "default" as const },
  { title: "Upload Materials", description: "Add new study content", icon: FolderOpen, href: "/ai/materials", variant: "default" as const },
  { title: "Get Study Plan", description: "Personalized recommendations", icon: Brain, href: "/ai/advisor", variant: "default" as const },
];

const recentActivities = [
  { id: "1", title: "Asked about Marketing Strategy", description: "Lecture 5 - Competitive Analysis", icon: MessageSquare, time: "2m ago", type: "query" as const },
  { id: "2", title: "Uploaded Finance Module 6", description: "PDF, 2.4 MB", icon: FolderOpen, time: "1h ago", type: "material" as const },
  { id: "3", title: "Completed Practice Exam", description: "Statistics - 85% score", icon: GraduationCap, time: "3h ago", type: "exam" as const },
  { id: "4", title: "New Study Recommendation", description: "Focus on Financial Ratios", icon: Brain, time: "5h ago", type: "advisor" as const },
];

const upcomingExams = [
  { course: "Marketing Management", date: "Jan 15, 2025", daysLeft: 3, progress: 75 },
  { course: "Financial Accounting", date: "Jan 18, 2025", daysLeft: 6, progress: 45 },
  { course: "Business Statistics", date: "Jan 22, 2025", daysLeft: 10, progress: 30 },
];

export const AIDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="ai-card-premium p-6 rounded-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center animate-pulse-glow">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-secondary-foreground">
                Welcome back, Student!
              </h1>
              <p className="text-secondary-foreground/80 mt-1">
                Your AI-powered academic assistant is ready to help you excel.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {/* @ts-ignore */}
            <Button variant="ai-primary" size="lg" asChild>
              <Link to="/ai/ask">
                <Zap className="w-4 h-4" />
                Quick Question
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <QuickActionCard key={action.title} {...action} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivityCard activities={recentActivities} />
        </div>

        <div className="ai-card border border-border p-5">
          <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary" />
            Upcoming Exams
          </h3>
          <div className="space-y-4">
            {upcomingExams.map((exam, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-foreground">{exam.course}</span>
                  <span className="text-xs text-muted-foreground">{exam.daysLeft} days left</span>
                </div>
                <Progress value={exam.progress} className="h-2" />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">{exam.date}</span>
                  <span className="text-xs font-medium text-secondary">{exam.progress}% prepared</span>
                </div>
              </div>
            ))}
          </div>
          {/* @ts-ignore */}
          <Button variant="ai-outline" className="w-full mt-4" asChild>
            <Link to="/ai/exam">
              View All Exams
            </Link>
          </Button>
        </div>
      </div>

      <div className="ai-card border border-border p-5 bg-gradient-to-r from-accent to-accent/50">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 text-secondary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">AI Study Insight</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Based on your activity, focusing on Financial Ratios in the next 2 days could improve your exam readiness by 15%.
            </p>
          </div>
          {/* @ts-ignore */}
          <Button variant="ai" asChild>
            <Link to="/ai/advisor">
              <BookOpen className="w-4 h-4" />
              Get Plan
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIDashboard;

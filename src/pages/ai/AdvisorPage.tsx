import React, { useState } from "react";
import { 
  Brain, 
  Sparkles, 
  TrendingUp,
  Target,
  Calendar,
  BookOpen,
  Award,
  ArrowRight,
  RefreshCw,
  Download,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Lightbulb,
  Clock,
  BarChart3,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { cn } from "../../lib/utils";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const skillGaps = [
  { skill: "Financial Ratios", proficiency: 45, trend: "improving", priority: "high" },
  { skill: "Market Analysis", proficiency: 72, trend: "stable", priority: "medium" },
  { skill: "Statistical Methods", proficiency: 58, trend: "declining", priority: "high" },
  { skill: "Strategic Planning", proficiency: 85, trend: "improving", priority: "low" },
  { skill: "Leadership Theory", proficiency: 68, trend: "stable", priority: "medium" },
];

const studyPlan = [
  {
    day: "Today",
    tasks: [
      { title: "Review Financial Ratios", duration: "45 min", type: "review", completed: false },
      { title: "Practice Statistics Problems", duration: "30 min", type: "practice", completed: false },
    ],
  },
  {
    day: "Tomorrow",
    tasks: [
      { title: "Marketing Case Study", duration: "1 hr", type: "study", completed: false },
      { title: "Quiz: Chapter 5 Concepts", duration: "20 min", type: "quiz", completed: false },
    ],
  },
  {
    day: "Wednesday",
    tasks: [
      { title: "Financial Statement Analysis", duration: "1 hr", type: "study", completed: false },
      { title: "Group Discussion Prep", duration: "30 min", type: "prep", completed: false },
    ],
  },
];

const recommendations = [
  {
    id: "1",
    title: "Focus on Financial Ratios",
    description: "Your recent exam showed weakness in ratio analysis. Spend 45 minutes reviewing the key formulas.",
    priority: "high",
    action: "Start Now",
    href: "/ai/materials",
  },
  {
    id: "2",
    title: "Practice Statistics",
    description: "Improve your statistical methods proficiency by completing practice problems from Chapter 7.",
    priority: "high",
    action: "Practice",
    href: "/ai/exam",
  },
  {
    id: "3",
    title: "Review Marketing Strategy",
    description: "Strengthen your market analysis skills with the latest lecture summaries.",
    priority: "medium",
    action: "Summarize",
    href: "/ai/summarize",
  },
];

const achievements = [
  { title: "7-Day Streak", icon: "🔥", description: "Studied every day this week" },
  { title: "Quiz Master", icon: "🏆", description: "Scored 90%+ on 5 quizzes" },
  { title: "Early Bird", icon: "🌅", description: "Started studying before 8am" },
];

export const AdvisorPage: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Academic Advisor
            <Brain className="w-6 h-6 text-primary" />
          </h1>
          <p className="text-muted-foreground mt-1">Personalized study recommendations powered by AI</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          {/* @ts-ignore */}
          <Button variant="ai" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Plan
          </Button>
        </div>
      </div>

      <div className="ai-card-premium p-6 rounded-xl">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm text-secondary-foreground/80">AI Insight</span>
            </div>
            <h2 className="text-xl font-bold text-secondary-foreground mb-2">
              You're on track for your Marketing exam!
            </h2>
            <p className="text-secondary-foreground/80">
              Based on your study patterns and quiz performance, focusing on Financial Ratios this week will increase your readiness by 15%.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">78%</span>
            </div>
            <span className="text-sm text-secondary-foreground/80">Overall Readiness</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="ai-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-secondary" />
                Skill Gap Analysis
              </CardTitle>
              <CardDescription>Your proficiency across key subject areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillGaps.map((skill) => (
                  <div key={skill.skill} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground">{skill.skill}</span>
                        {skill.priority === "high" && (
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                            Priority
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-xs",
                          skill.trend === "improving" ? "text-success" :
                          skill.trend === "declining" ? "text-destructive" :
                          "text-muted-foreground"
                        )}>
                          {skill.trend === "improving" && "↑"}
                          {skill.trend === "declining" && "↓"}
                          {skill.trend === "stable" && "→"}
                          {" "}{skill.trend}
                        </span>
                        <span className="text-sm font-medium text-foreground">{skill.proficiency}%</span>
                      </div>
                    </div>
                    <Progress
                      value={skill.proficiency}
                      className={cn(
                        "h-2",
                        skill.proficiency < 50 ? "[&>div]:bg-destructive" :
                        skill.proficiency < 70 ? "[&>div]:bg-warning" :
                        "[&>div]:bg-success"
                      )}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="ai-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                Personalized Recommendations
              </CardTitle>
              <CardDescription>AI-generated suggestions based on your performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className={cn(
                      "p-4 rounded-lg border transition-all duration-200 hover:shadow-card cursor-pointer",
                      rec.priority === "high" ? "border-destructive/30 bg-destructive/5" :
                      rec.priority === "medium" ? "border-warning/30 bg-warning/5" :
                      "border-border"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {rec.priority === "high" ? (
                            <AlertCircle className="w-4 h-4 text-destructive" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-success" />
                          )}
                          <h4 className="font-medium text-foreground">{rec.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                      </div>
                      {/* @ts-ignore */}
                      <Button variant="ai-outline" size="sm">
                        {rec.action}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="ai-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="w-4 h-4 text-secondary" />
                Weekly Study Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {studyPlan.map((day) => (
                    <div key={day.day}>
                      <h4 className="font-medium text-sm text-foreground mb-2">{day.day}</h4>
                      <div className="space-y-2">
                        {day.tasks.map((task, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              task.type === "review" ? "bg-secondary" :
                              task.type === "practice" ? "bg-primary" :
                              task.type === "quiz" ? "bg-success" :
                              "bg-muted-foreground"
                            )} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {task.title}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {task.duration}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              {/* @ts-ignore */}
              <Button variant="ai-outline" className="w-full mt-4" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                View Full Schedule
              </Button>
            </CardContent>
          </Card>

          <Card className="ai-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Award className="w-4 h-4 text-primary" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-transparent"
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <p className="font-medium text-sm text-foreground">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <div className="ai-card border border-border p-4 text-center">
              <TrendingUp className="w-6 h-6 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">+12%</p>
              <p className="text-xs text-muted-foreground">Weekly Progress</p>
            </div>
            <div className="ai-card border border-border p-4 text-center">
              <Target className="w-6 h-6 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">4/5</p>
              <p className="text-xs text-muted-foreground">Goals Met</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorPage;

import React, { useState } from "react";
import { 
  Brain, 
  TrendingUp,
  Target,
  Calendar,
  BookOpen,
  Award,
  RefreshCw,
  Download,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Clock,
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
import { Link } from "react-router-dom";

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

      {/* Summary Banner */}
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Study Insight</p>
              <p className="text-sm text-muted-foreground mt-1">
                You're on track for your Marketing exam. Focusing on Financial Ratios this week will improve your readiness.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-2xl font-semibold text-foreground">78%</p>
                <p className="text-xs text-muted-foreground">Readiness</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skill Gap Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Skill Gap Analysis</CardTitle>
              <CardDescription>Your proficiency across key subject areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillGaps.map((skill) => (
                  <div key={skill.skill} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{skill.skill}</span>
                        {skill.priority === "high" && (
                          <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200">
                            Priority
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-xs",
                          skill.trend === "improving" ? "text-green-600" :
                          skill.trend === "declining" ? "text-red-600" :
                          "text-muted-foreground"
                        )}>
                          {skill.trend === "improving" && "↑"}
                          {skill.trend === "declining" && "↓"}
                          {skill.trend === "stable" && "→"}
                        </span>
                        <span className="text-sm font-medium text-foreground">{skill.proficiency}%</span>
                      </div>
                    </div>
                    <Progress
                      value={skill.proficiency}
                      className={cn(
                        "h-1.5",
                        skill.proficiency < 50 ? "[&>div]:bg-red-500" :
                        skill.proficiency < 70 ? "[&>div]:bg-amber-500" :
                        "[&>div]:bg-green-500"
                      )}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Recommendations</CardTitle>
              <CardDescription>Suggestions based on your performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className={cn(
                      "p-4 rounded-lg border transition-colors",
                      rec.priority === "high" ? "border-red-200 bg-red-50/50" :
                      "border-border"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {rec.priority === "high" ? (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          <h4 className="font-medium text-sm text-foreground">{rec.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={rec.href}>
                          {rec.action}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Study Plan & Achievements */}
        <div className="space-y-6">
          {/* Weekly Study Plan */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                Weekly Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-56">
                <div className="space-y-4">
                  {studyPlan.map((day) => (
                    <div key={day.day}>
                      <h4 className="font-medium text-sm text-foreground mb-2">{day.day}</h4>
                      <div className="space-y-2">
                        {day.tasks.map((task, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 rounded bg-muted/50"
                          >
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              task.type === "review" ? "bg-secondary" :
                              task.type === "practice" ? "bg-primary" :
                              task.type === "quiz" ? "bg-green-500" :
                              "bg-muted-foreground"
                            )} />
                            <span className="flex-1 text-sm text-foreground truncate">
                              {task.title}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {task.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Button variant="outline" className="w-full mt-4" size="sm">
                View Full Schedule
              </Button>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Award className="w-4 h-4 text-muted-foreground" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded bg-muted/50"
                  >
                    <span className="text-xl">{achievement.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="pt-4 pb-3 text-center">
                <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <p className="text-lg font-semibold text-foreground">+12%</p>
                <p className="text-xs text-muted-foreground">Weekly</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3 text-center">
                <Target className="w-5 h-5 text-secondary mx-auto mb-1" />
                <p className="text-lg font-semibold text-foreground">4/5</p>
                <p className="text-xs text-muted-foreground">Goals</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorPage;

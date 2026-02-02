import React, { useState } from "react";
import { 
  GraduationCap, 
  Sparkles, 
  Play, 
  Clock,
  Target,
  RotateCcw,
  CheckCircle,
  XCircle,
  BookOpen,
  Lightbulb,
  Download,
  History,
  Settings,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { cn } from "../../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Slider } from "../../components/ui/slider";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";

const courses = [
  { id: "marketing", name: "Marketing Management" },
  { id: "finance", name: "Financial Accounting" },
  { id: "statistics", name: "Business Statistics" },
  { id: "strategy", name: "Business Strategy" },
];

const examTypes = [
  { id: "multiple-choice", name: "Multiple Choice", description: "Test your knowledge with MCQs" },
  { id: "case-study", name: "Case Study", description: "Analyze business scenarios" },
  { id: "short-answer", name: "Short Answer", description: "Brief written responses" },
  { id: "oral-prep", name: "Oral Exam Prep", description: "Practice verbal explanations" },
];

const recentExams = [
  { id: "1", course: "Marketing", type: "Multiple Choice", score: 85, date: "2 days ago", questions: 20 },
  { id: "2", course: "Finance", type: "Case Study", score: 78, date: "4 days ago", questions: 5 },
  { id: "3", course: "Statistics", type: "Short Answer", score: 92, date: "1 week ago", questions: 10 },
];

const sampleQuestions = [
  {
    id: "1",
    question: "According to Porter's Five Forces model, which of the following is NOT a competitive force?",
    options: [
      "Threat of new entrants",
      "Bargaining power of suppliers",
      "Market segmentation strategy",
      "Competitive rivalry"
    ],
    correctAnswer: 2,
    explanation: "Market segmentation strategy is a marketing approach, not one of Porter's Five Forces.",
    source: "Marketing Strategy Lecture 5 - Slide 15",
  },
  {
    id: "2",
    question: "A company's Unique Selling Proposition (USP) should primarily focus on:",
    options: [
      "Matching competitor prices",
      "Differentiation from competitors",
      "Reducing operational costs",
      "Expanding product lines"
    ],
    correctAnswer: 1,
    explanation: "A USP differentiates a company from competitors by highlighting unique benefits.",
    source: "Marketing Strategy Lecture 5 - Slide 22",
  },
];

export const ExamEnginePage: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("multiple-choice");
  const [questionCount, setQuestionCount] = useState([10]);
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowExam(true);
      setCurrentQuestion(0);
      setAnswers({});
      setShowResults(false);
    }, 2000);
  };

  const handleAnswer = () => {
    if (selectedAnswer === null) return;
    setAnswers((prev) => ({
      ...prev,
      [sampleQuestions[currentQuestion].id]: selectedAnswer,
    }));
    setSelectedAnswer(null);
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const getScore = () => {
    let correct = 0;
    Object.entries(answers).forEach(([id, answer]) => {
      const question = sampleQuestions.find((q) => q.id === id);
      if (question && question.correctAnswer === answer) {
        correct++;
      }
    });
    return Math.round((correct / sampleQuestions.length) * 100);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Exam Engine
            <GraduationCap className="w-6 h-6 text-primary" />
          </h1>
          <p className="text-muted-foreground mt-1">Generate practice exams based on your study materials</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
          {/* @ts-ignore */}
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {!showExam ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="ai-card border border-border p-6">
              <h3 className="font-semibold text-lg text-foreground mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                Create Practice Exam
              </h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Course</Label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Exam Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {examTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={cn(
                          "p-4 rounded-lg border text-left transition-all duration-200",
                          selectedType === type.id
                            ? "border-secondary bg-secondary/5"
                            : "border-border hover:border-secondary/50"
                        )}
                      >
                        <p className="font-medium text-sm text-foreground">{type.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Number of Questions</Label>
                    <span className="text-sm font-medium text-secondary">{questionCount[0]}</span>
                  </div>
                  <Slider
                    value={questionCount}
                    onValueChange={setQuestionCount}
                    min={5}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5</span>
                    <span>25</span>
                    <span>50</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Difficulty Level</Label>
                  <div className="flex gap-3">
                    {["easy", "medium", "hard"].map((level) => (
                      <Button
                        key={level}
                        variant={difficulty === level ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setDifficulty(level)}
                        className="flex-1 capitalize"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
                
              {/* @ts-ignore */}
                <Button variant="ai"
                  size="lg"
                  className="w-full"
                  onClick={handleGenerate}
                  disabled={!selectedCourse || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      Generating Exam...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Generate Practice Exam
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="ai-card border border-border p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <History className="w-4 h-4 text-secondary" />
                Recent Exams
              </h3>
              <div className="space-y-3">
                {recentExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-foreground">{exam.course}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          exam.score >= 80 ? "bg-success/10 text-success border-success/20" :
                          exam.score >= 60 ? "bg-warning/10 text-warning border-warning/20" :
                          "bg-destructive/10 text-destructive border-destructive/20"
                        )}
                      >
                        {exam.score}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{exam.type}</span>
                      <span>{exam.questions} questions • {exam.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ai-card-premium p-5 rounded-lg">
              <h3 className="font-semibold text-secondary-foreground mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-secondary-foreground/80">Average Score</span>
                  <span className="text-2xl font-bold text-primary">85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary-foreground/80">Exams Taken</span>
                  <span className="text-lg font-semibold text-secondary-foreground">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary-foreground/80">Streak</span>
                  <span className="text-lg font-semibold text-secondary-foreground">7 days 🔥</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : showResults ? (
        <div className="max-w-2xl mx-auto">
          <div className="ai-card border border-border p-8 text-center">
            <div className={cn(
              "w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center",
              getScore() >= 80 ? "bg-success/10" : getScore() >= 60 ? "bg-warning/10" : "bg-destructive/10"
            )}>
              {getScore() >= 80 ? (
                <CheckCircle className="w-10 h-10 text-success" />
              ) : (
                <Target className="w-10 h-10 text-warning" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Exam Complete!</h2>
            <p className="text-muted-foreground mb-6">
              You scored <span className="font-bold text-foreground">{getScore()}%</span> on this practice exam
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setShowExam(false)}>
                New Exam
              </Button>
              {/* @ts-ignore */}
              <Button variant="ai">
                <BookOpen className="w-4 h-4 mr-2" />
                Review Answers
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="ai-card border border-border overflow-hidden">
            <div className="p-4 bg-muted/50 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Question {currentQuestion + 1} of {sampleQuestions.length}
                </span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">12:45</span>
                </div>
              </div>
              <Progress value={(currentQuestion + 1) / sampleQuestions.length * 100} className="h-2" />
            </div>

            <div className="p-6">
              <h3 className="text-lg font-medium text-foreground mb-6">
                {sampleQuestions[currentQuestion].question}
              </h3>

              <RadioGroup
                value={selectedAnswer?.toString()}
                onValueChange={(value) => setSelectedAnswer(parseInt(value))}
                className="space-y-3"
              >
                {sampleQuestions[currentQuestion].options.map((option, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer",
                      selectedAnswer === index
                        ? "border-secondary bg-secondary/5"
                        : "border-border hover:border-secondary/50"
                    )}
                    onClick={() => setSelectedAnswer(index)}
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  disabled={currentQuestion === 0}
                  onClick={() => setCurrentQuestion((prev) => prev - 1)}
                >
                  Previous
                </Button>
                {/* @ts-ignore */}
                <Button variant="ai"
                  onClick={handleAnswer}
                  disabled={selectedAnswer === null}
                >
                  {currentQuestion === sampleQuestions.length - 1 ? "Finish Exam" : "Next Question"}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>

            <div className="p-4 bg-muted/30 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <BookOpen className="w-3 h-3" />
                <span>Source: {sampleQuestions[currentQuestion].source}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamEnginePage;

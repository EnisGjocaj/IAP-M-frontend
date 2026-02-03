import React, { useState } from "react";
import { 
  GraduationCap, 
  Play, 
  Clock,
  Target,
  RotateCcw,
  CheckCircle,
  BookOpen,
  Download,
  History,
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
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const courses = [
  { id: "marketing", name: "Marketing Management" },
  { id: "finance", name: "Financial Accounting" },
  { id: "statistics", name: "Business Statistics" },
  { id: "strategy", name: "Business Strategy" },
];

const examTypes = [
  { id: "multiple-choice", name: "Multiple Choice", description: "Test with MCQs" },
  { id: "case-study", name: "Case Study", description: "Analyze scenarios" },
  { id: "short-answer", name: "Short Answer", description: "Brief responses" },
  { id: "oral-prep", name: "Oral Exam Prep", description: "Verbal practice" },
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Exam Engine</h1>
          <p className="text-sm text-muted-foreground mt-1">Generate practice exams from your study materials</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
        </div>
      </div>

      {!showExam ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-medium">Create Practice Exam</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                        "p-3 rounded-lg border text-left transition-colors",
                        selectedType === type.id
                          ? "border-secondary bg-secondary/5"
                          : "border-border hover:border-muted-foreground"
                      )}
                    >
                      <p className="font-medium text-sm text-foreground">{type.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Number of Questions</Label>
                  <span className="text-sm font-medium text-foreground">{questionCount[0]}</span>
                </div>
                <Slider
                  value={questionCount}
                  onValueChange={setQuestionCount}
                  min={5}
                  max={50}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <div className="flex gap-2">
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

              <Button
                className="w-full"
                onClick={handleGenerate}
                disabled={!selectedCourse || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Generate Practice Exam
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Recent Exams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-foreground">{exam.course}</span>
                        <span className={cn(
                          "text-xs font-medium",
                          exam.score >= 80 ? "text-green-600" :
                          exam.score >= 60 ? "text-amber-600" : "text-red-600"
                        )}>
                          {exam.score}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{exam.type}</span>
                        <span>{exam.questions}q • {exam.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average Score</span>
                    <span className="text-xl font-semibold text-foreground">85%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Exams Taken</span>
                    <span className="text-lg font-medium text-foreground">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Streak</span>
                    <span className="text-lg font-medium text-foreground">7 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : showResults ? (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-8 text-center">
            <div className={cn(
              "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center",
              getScore() >= 80 ? "bg-green-100" : getScore() >= 60 ? "bg-amber-100" : "bg-red-100"
            )}>
              {getScore() >= 80 ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <Target className="w-8 h-8 text-amber-600" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Exam Complete</h2>
            <p className="text-muted-foreground mb-6">
              You scored <span className="font-semibold text-foreground">{getScore()}%</span>
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => setShowExam(false)}>
                New Exam
              </Button>
              <Button>
                <BookOpen className="w-4 h-4 mr-2" />
                Review Answers
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-3xl mx-auto">
          <div className="p-4 bg-muted/50 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Question {currentQuestion + 1} of {sampleQuestions.length}
              </span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>12:45</span>
              </div>
            </div>
            <Progress value={(currentQuestion + 1) / sampleQuestions.length * 100} className="h-1.5" />
          </div>

          <CardContent className="p-6">
            <h3 className="text-base font-medium text-foreground mb-6">
              {sampleQuestions[currentQuestion].question}
            </h3>

            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => setSelectedAnswer(parseInt(value))}
              className="space-y-2"
            >
              {sampleQuestions[currentQuestion].options.map((option, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer",
                    selectedAnswer === index
                      ? "border-secondary bg-secondary/5"
                      : "border-border hover:border-muted-foreground"
                  )}
                  onClick={() => setSelectedAnswer(index)}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1 text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
              >
                Previous
              </Button>
              <Button
                onClick={handleAnswer}
                disabled={selectedAnswer === null}
              >
                {currentQuestion === sampleQuestions.length - 1 ? "Finish Exam" : "Next"}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>

          <div className="p-3 bg-muted/30 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <BookOpen className="w-3 h-3" />
              <span>Source: {sampleQuestions[currentQuestion].source}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ExamEnginePage;

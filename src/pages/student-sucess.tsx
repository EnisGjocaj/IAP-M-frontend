"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Separator } from "../components/ui/separator"
import {
  Mail,
  Phone,
  MapPin,
  Award,
  BookOpen,
  TrendingUp,
  Download,
  Settings,
  Star,
  Trophy,
  Clock,
  Users,
  FileText,
  Github,
  Linkedin,
  Edit,
  Eye,
  EyeOff,
  Bell,
} from "lucide-react"

export default function StudentProfile() {
  const [profileVisibility, setProfileVisibility] = useState("public")

  // Sample student data
  const studentData = {
    basicInfo: {
      name: "Sarah Johnson",
      email: "sarah.johnson@university.edu",
      phone: "+1 (555) 123-4567",
      university: "Tech University",
      faculty: "Computer Science",
      year: "3rd Year",
      level: "Advanced",
      bio: "Passionate computer science student with a focus on AI and machine learning. Always eager to learn new technologies and contribute to innovative projects.",
      profilePicture: "/placeholder.svg?height=150&width=150",
      socialLinks: {
        linkedin: "https://linkedin.com/in/sarahjohnson",
        github: "https://github.com/sarahjohnson",
      },
    },
    academic: {
      gpa: 3.85,
      attendance: 94,
      grades: [
        { subject: "Data Structures", grade: "A", semester: "Fall 2024" },
        { subject: "Machine Learning", grade: "A-", semester: "Fall 2024" },
        { subject: "Database Systems", grade: "B+", semester: "Spring 2024" },
        { subject: "Web Development", grade: "A", semester: "Spring 2024" },
      ],
    },
    trainings: [
      {
        title: "Python Programming Advanced",
        category: "Programming",
        level: "Advanced",
        completionDate: "2024-11-15",
        instructor: "Dr. Smith",
        hours: 40,
        certificate: true,
        progress: 100,
      },
      {
        title: "Financial Analysis Fundamentals",
        category: "Accounting",
        level: "Intermediate",
        completionDate: "2024-10-20",
        instructor: "Prof. Davis",
        hours: 30,
        certificate: true,
        progress: 100,
      },
      {
        title: "Digital Marketing Strategy",
        category: "Marketing",
        level: "Beginner",
        completionDate: null,
        instructor: "Ms. Wilson",
        hours: 25,
        certificate: false,
        progress: 65,
      },
    ],
    skills: [
      "Python",
      "JavaScript",
      "React",
      "Machine Learning",
      "Data Analysis",
      "SQL",
      "Git",
      "Docker",
      "AWS",
      "Financial Modeling",
    ],
    badges: [
      { name: "Top Performer - Programming 2024", verified: true, date: "2024-11-15" },
      { name: "Perfect Attendance", verified: true, date: "2024-10-01" },
      { name: "Hackathon Winner", verified: true, date: "2024-09-15" },
      { name: "Peer Mentor", verified: true, date: "2024-08-01" },
    ],
    metrics: {
      totalPoints: 2850,
      level: 7,
      globalRank: 23,
      departmentRank: 5,
      engagementScore: 92,
    },
    timeline: [
      { date: "2024-11-15", event: "Completed Python Programming Advanced", type: "training" },
      { date: "2024-11-01", event: "Achieved Top Performer Badge", type: "badge" },
      { date: "2024-10-20", event: "Completed Financial Analysis Course", type: "training" },
      { date: "2024-09-15", event: "Won University Hackathon", type: "achievement" },
    ],
    testimonials: [
      {
        author: "Dr. Smith",
        role: "Programming Instructor",
        content:
          "Sarah demonstrates exceptional problem-solving skills and consistently delivers high-quality work. Her dedication to learning is remarkable.",
        date: "2024-11-10",
      },
      {
        author: "Prof. Davis",
        role: "Finance Department",
        content:
          "Outstanding analytical thinking and attention to detail. Sarah has shown great potential in financial analysis.",
        date: "2024-10-25",
      },
    ],
    goals: [
      { title: "Complete AI Specialization", progress: 75, deadline: "2024-12-31", status: "in-progress" },
      { title: "Secure Summer Internship", progress: 40, deadline: "2025-03-01", status: "in-progress" },
      { title: "Publish Research Paper", progress: 20, deadline: "2025-06-01", status: "planned" },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <Card className="relative overflow-hidden border-0 shadow-shadow1">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-primary/20"></div>
          <CardContent className="relative p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={studentData.basicInfo.profilePicture || "/placeholder.svg"}
                    alt={studentData.basicInfo.name}
                  />
                  <AvatarFallback className="text-2xl bg-primary text-secondary">
                    {studentData.basicInfo.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-primary hover:bg-primary/90"
                >
                  <Edit className="w-4 h-4 text-secondary" />
                </Button>
              </div>

              <div className="flex-1 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold">{studentData.basicInfo.name}</h1>
                  <Badge className="bg-primary text-secondary hover:bg-primary/90">
                    Level {studentData.metrics.level}
                  </Badge>
                </div>
                <p className="text-lg opacity-90 mb-4">{studentData.basicInfo.bio}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{studentData.basicInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{studentData.basicInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{studentData.basicInfo.university}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>
                      {studentData.basicInfo.faculty} - {studentData.basicInfo.year}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button className="bg-primary text-secondary hover:bg-primary/90">
                  <Download className="w-4 h-4 mr-2" />
                  Export Profile
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-card hover:shadow-shadow1 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-secondary">{studentData.metrics.totalPoints}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card hover:shadow-shadow1 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-2xl font-bold text-secondary">#{studentData.metrics.globalRank}</div>
              <div className="text-sm text-muted-foreground">Global Rank</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card hover:shadow-shadow1 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-secondary">{studentData.academic.gpa}</div>
              <div className="text-sm text-muted-foreground">GPA</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card hover:shadow-shadow1 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-2xl font-bold text-secondary">{studentData.metrics.engagementScore}%</div>
              <div className="text-sm text-muted-foreground">Engagement</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 bg-white shadow-card">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-secondary">
              Overview
            </TabsTrigger>
            <TabsTrigger value="academic" className="data-[state=active]:bg-primary data-[state=active]:text-secondary">
              Academic
            </TabsTrigger>
            <TabsTrigger
              value="trainings"
              className="data-[state=active]:bg-primary data-[state=active]:text-secondary"
            >
              Trainings
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-primary data-[state=active]:text-secondary">
              Skills
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="data-[state=active]:bg-primary data-[state=active]:text-secondary"
            >
              Achievements
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-primary data-[state=active]:text-secondary">
              Timeline
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-primary data-[state=active]:text-secondary">
              Reviews
            </TabsTrigger>
            <TabsTrigger value="goals" className="data-[state=active]:bg-primary data-[state=active]:text-secondary">
              Goals
            </TabsTrigger>
            <TabsTrigger value="export" className="data-[state=active]:bg-primary data-[state=active]:text-secondary">
              Export
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-secondary">
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Recent Activity */}
                <Card className="border-0 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-secondary">
                      <Clock className="w-5 h-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {studentData.timeline.slice(0, 4).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div
                            className={`w-3 h-3 rounded-full mt-2 ${
                              item.type === "training"
                                ? "bg-secondary"
                                : item.type === "badge"
                                  ? "bg-primary"
                                  : "bg-green-500"
                            }`}
                          ></div>
                          <div className="flex-1">
                            <p className="font-medium text-secondary">{item.event}</p>
                            <p className="text-sm text-muted-foreground">{item.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Current Trainings */}
                <Card className="border-0 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-secondary">
                      <BookOpen className="w-5 h-5" />
                      Current Trainings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {studentData.trainings
                        .filter((t) => t.progress < 100)
                        .map((training, index) => (
                          <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-semibold text-secondary">{training.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {training.category} • {training.level}
                                </p>
                              </div>
                              <Badge variant="outline" className="border-secondary text-secondary">
                                {training.progress}%
                              </Badge>
                            </div>
                            <Progress value={training.progress} className="h-2 mb-2" />
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>Instructor: {training.instructor}</span>
                              <span>{training.hours} hours</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Performance Metrics */}
                <Card className="border-0 shadow-card">
                  <CardHeader>
                    <CardTitle className="text-secondary">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Academic Performance</span>
                      <span className="text-sm text-secondary font-bold">{studentData.academic.gpa}/4.0</span>
                    </div>
                    <Progress value={(studentData.academic.gpa / 4) * 100} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Attendance Rate</span>
                      <span className="text-sm text-secondary font-bold">{studentData.academic.attendance}%</span>
                    </div>
                    <Progress value={studentData.academic.attendance} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Engagement Score</span>
                      <span className="text-sm text-secondary font-bold">{studentData.metrics.engagementScore}%</span>
                    </div>
                    <Progress value={studentData.metrics.engagementScore} className="h-2" />
                  </CardContent>
                </Card>

                {/* Latest Badges */}
                <Card className="border-0 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-secondary">
                      <Award className="w-5 h-5" />
                      Latest Badges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {studentData.badges.slice(0, 3).map((badge, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-primary/5">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <Award className="w-4 h-4 text-secondary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-secondary">{badge.name}</p>
                            <p className="text-xs text-muted-foreground">{badge.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Academic Tab */}
          <TabsContent value="academic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-secondary">Academic Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-secondary">{studentData.academic.gpa}</div>
                        <div className="text-sm text-muted-foreground">Current GPA</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-secondary">{studentData.academic.attendance}%</div>
                        <div className="text-sm text-muted-foreground">Attendance</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-semibold text-secondary">Recent Grades</h4>
                      {studentData.academic.grades.map((grade, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-secondary">{grade.subject}</p>
                            <p className="text-sm text-muted-foreground">{grade.semester}</p>
                          </div>
                          <Badge
                            className={`${
                              grade.grade.startsWith("A")
                                ? "bg-green-100 text-green-800"
                                : grade.grade.startsWith("B")
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {grade.grade}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-secondary">Transcripts & Certificates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <FileText className="w-4 h-4 mr-2" />
                      Official Transcript - Fall 2024
                      <Download className="w-4 h-4 ml-auto" />
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <FileText className="w-4 h-4 mr-2" />
                      Academic Record - Spring 2024
                      <Download className="w-4 h-4 ml-auto" />
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Award className="w-4 h-4 mr-2" />
                      Dean's List Certificate
                      <Download className="w-4 h-4 ml-auto" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trainings Tab */}
          <TabsContent value="trainings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentData.trainings.map((training, index) => (
                <Card key={index} className="border-0 shadow-card hover:shadow-shadow1 transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-secondary">{training.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{training.category}</p>
                      </div>
                      <Badge
                        className={
                          training.progress === 100 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                        }
                      >
                        {training.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{training.progress}%</span>
                      </div>
                      <Progress value={training.progress} className="h-2" />

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Instructor:</span>
                          <span className="font-medium">{training.instructor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-medium">{training.hours} hours</span>
                        </div>
                        {training.completionDate && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Completed:</span>
                            <span className="font-medium">{training.completionDate}</span>
                          </div>
                        )}
                      </div>

                      {training.certificate && (
                        <Button size="sm" className="w-full bg-primary text-secondary hover:bg-primary/90">
                          <Download className="w-4 h-4 mr-2" />
                          Download Certificate
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="text-secondary">Skills & Competencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {studentData.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="px-3 py-1 border-secondary text-secondary hover:bg-secondary hover:text-white transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studentData.badges.map((badge, index) => (
                <Card key={index} className="border-0 shadow-card hover:shadow-shadow1 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-secondary mb-1">{badge.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">Earned on {badge.date}</p>
                        {badge.verified && <Badge className="bg-green-100 text-green-800">Verified</Badge>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="text-secondary">Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {studentData.timeline.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div
                        className={`w-4 h-4 rounded-full mt-1 ${
                          item.type === "training"
                            ? "bg-secondary"
                            : item.type === "badge"
                              ? "bg-primary"
                              : "bg-green-500"
                        }`}
                      ></div>
                      <div className="flex-1 pb-6 border-l-2 border-gray-100 pl-6 ml-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-secondary">{item.event}</p>
                            <p className="text-sm text-muted-foreground">{item.date}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              item.type === "training"
                                ? "border-secondary text-secondary"
                                : item.type === "badge"
                                  ? "border-primary text-primary"
                                  : "border-green-500 text-green-700"
                            }
                          >
                            {item.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="space-y-6">
              {studentData.testimonials.map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-secondary text-white">
                          {testimonial.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-secondary">{testimonial.author}</h4>
                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          </div>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{testimonial.content}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="space-y-4">
              {studentData.goals.map((goal, index) => (
                <Card key={index} className="border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-secondary">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground">Deadline: {goal.deadline}</p>
                      </div>
                      <Badge
                        className={
                          goal.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : goal.status === "in-progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }
                      >
                        {goal.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="text-secondary">Export Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Export your profile as a comprehensive CV or portfolio for job applications and internships.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="bg-secondary text-white hover:bg-secondary/90">
                    <Download className="w-4 h-4 mr-2" />
                    Download Full Profile PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="border-secondary text-secondary hover:bg-secondary hover:text-white bg-transparent"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Generate CV Format
                  </Button>
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-secondary bg-transparent"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Certificates Only
                  </Button>
                  <Button
                    variant="outline"
                    className="border-secondary text-secondary hover:bg-secondary hover:text-white bg-transparent"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Performance Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-secondary">Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Profile Visibility</p>
                        <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                      </div>
                      <select
                        className="px-3 py-2 border rounded-md"
                        value={profileVisibility}
                        onChange={(e) => setProfileVisibility(e.target.value)}
                      >
                        <option value="public">Public</option>
                        <option value="admin">Admin Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show Email</p>
                        <p className="text-sm text-muted-foreground">Display email on public profile</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show Phone</p>
                        <p className="text-sm text-muted-foreground">Display phone number on public profile</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <EyeOff className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-secondary">Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Training Notifications</p>
                        <p className="text-sm text-muted-foreground">Get notified about new training opportunities</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Bell className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Achievement Notifications</p>
                        <p className="text-sm text-muted-foreground">Get notified when you earn badges</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Bell className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weekly Progress Report</p>
                        <p className="text-sm text-muted-foreground">Receive weekly progress summaries</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Bell className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
